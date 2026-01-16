# main.py
import os
import threading
from datetime import date
from contextlib import asynccontextmanager
import math
import time
import random
import asyncio
import pandas as pd
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
from dotenv import load_dotenv
load_dotenv()

# Firebase
import firebase_admin
from firebase_admin import credentials, firestore

from google.api_core.exceptions import ResourceExhausted, DeadlineExceeded, ServiceUnavailable

# MongoDB
from pymongo import MongoClient, UpdateOne

# ---------- Config ----------
CSV_FILE = "data/groundwater.csv"
COLLECTION_NAME = "DWLR_state"   # Firestore collection (per state sub-collections)
API_KEY = "bfb4498b5acd2ece3dadf3eed5aacfee"    # Govt. api key of DWLR

# MongoDB config (Data Warehouse)
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "aquawatch")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "states")   # one document per state, with data array
MONGO_STATE_FIELD_LIMIT = None     # we don't delete anything in MongoDB

FIREBASE_STATE_LIMIT = 200         # keep only latest 200 records per state in Firestore


# ---------- Firebase Setup ----------
cred = credentials.Certificate("auawatch-firebase-adminsdk-fbsvc-7af81c7aea.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ---------- MongoDB Setup ----------
try:
    if not MONGO_URI:
        raise ValueError("MONGO_URI not set")
    mongo_client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    mongo_db = mongo_client[MONGO_DB_NAME]
    mongo_states_col = mongo_db[MONGO_COLLECTION_NAME]
    # Test connection
    mongo_client.admin.command('ping')
    print("✅ MongoDB connected successfully")
except Exception as e:
    print(f"⚠️ MongoDB connection failed: {e}")
    mongo_client = None
    mongo_states_col = None


# ---------- Helpers ----------
def load_csv():
    df = pd.read_csv(CSV_FILE)
    return df.to_dict(orient="records"), df.columns[0]


def is_valid_row(row: dict) -> bool:
    """Only ensure required essential fields exist: State, Date, Time."""
    for key in ["State", "Date", "Time"]:
        v = str(row.get(key, "")).strip()
        if v in ["", "nan", "None"]:
            return False
    return True


def normalize_row(row: dict) -> dict:
    """Convert NaN/'nan'/None/empty-string to actual Python None."""
    clean = {}
    for k, v in row.items():
        if isinstance(v, float) and math.isnan(v):
            clean[k] = None
        elif str(v).strip() in ["", "nan", "None"]:
            clean[k] = None
        else:
            clean[k] = v
    return clean


# ---------- API Key Verification ----------
def verify_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return True


# ---------- Filter to keep only latest 200 records per state ----------
def filter_latest_per_state(valid_records, limit=FIREBASE_STATE_LIMIT):
    """
    Keep only latest `limit` records per state BEFORE Firestore upload.
    This prevents quota exhaustion.
    """
    by_state = {}

    for row in valid_records:
        state = str(row.get("State", "Unknown")).strip() or "Unknown"
        by_state.setdefault(state, []).append(row)

    final_records = []
    for state, rows in by_state.items():
        # assume CSV is append-only → last rows are latest
        final_records.extend(rows[-limit:])

    return final_records



def enforce_firestore_state_limit(states_touched, limit=FIREBASE_STATE_LIMIT):
    if limit is None:
        return

    for state_id in states_touched:
        state_data_col = db.collection(COLLECTION_NAME).document(state_id).collection("data")
        docs = list(state_data_col.stream())

        # Prefer csv_index field when present; fallback to numeric document id.
        def _sort_key(d):
            data = d.to_dict() or {}
            if "csv_index" in data and data["csv_index"] is not None:
                return int(data["csv_index"])
            try:
                return int(d.id)
            except ValueError:
                return 0

        sorted_docs = sorted(docs, key=_sort_key)

        extra = len(sorted_docs) - limit
        if extra <= 0:
            continue

        batch = db.batch()
        count = 0
        for d in sorted_docs[:extra]:  # delete oldest extras
            batch.delete(d.reference)
            count += 1
            if count % 400 == 0:
                _firestore_commit_with_retry(batch)
                batch = db.batch()
        if count % 400 != 0:
            _firestore_commit_with_retry(batch)

        print(f"🧹 Deleted {count} old records for {state_id}; capped at {limit}.")


# ---------- Sync Logic ----------
def _firestore_commit_with_retry(batch, *, max_retries: int = 6, base_delay_s: float = 1.0, max_delay_s: float = 30.0):
    """
    Retry Firestore batch.commit() on transient/quota errors with exponential backoff + jitter.
    """
    for attempt in range(max_retries + 1):
        try:
            return batch.commit()
        except (ResourceExhausted, DeadlineExceeded, ServiceUnavailable) as e:
            if attempt >= max_retries:
                raise
            delay = min(max_delay_s, base_delay_s * (2 ** attempt))
            delay = delay * (0.5 + random.random())  # jitter
            print(f"⚠️ Firestore commit failed ({e.__class__.__name__}). Retrying in {delay:.1f}s ({attempt+1}/{max_retries})")
            time.sleep(delay)


def sync_new_data():
    # Load CSV with small retry to avoid EmptyDataError during writes
    attempts = 3
    for attempt in range(attempts):
        try:
            records, state_column = load_csv()
            break
        except pd.errors.EmptyDataError:
            if attempt == attempts - 1:
                print("⚠️ CSV is empty right now; skipping sync.")
                return {"message": "⚠️ CSV empty, skipped sync."}
            time.sleep(0.2)

    total_rows = len(records)

    meta_ref = db.collection("metadata").document("upload_info")
    meta = meta_ref.get().to_dict() or {}
    last_index = meta.get("last_index", -1)
    old_last_index = meta.get("old_last_index", -1)

    if total_rows - 1 > last_index:
        new_records = records[last_index + 1:]
        valid_records = [normalize_row(r) for r in new_records if is_valid_row(r)]

        # 🔐 HARD LIMIT for Firestore (per state)
        valid_records = filter_latest_per_state(valid_records, FIREBASE_STATE_LIMIT)


        if not valid_records:
            meta_ref.set({"old_last_index": last_index, "last_index": total_rows - 1})
            print("⚡ No valid new data to upload.")
            return {"message": "⚡ No valid new data to upload."}

        batch_size = 500
        states_touched = set()
        total_uploaded = 0

        # Firebase: upload only the new rows
        for batch_start in range(0, len(valid_records), batch_size):
            batch = db.batch()
            batch_end = min(batch_start + batch_size, len(valid_records))
            for i, row in enumerate(valid_records[batch_start:batch_end],
                                    start=last_index + 1 + batch_start):
                original_state = str(row[state_column]).strip()
                state_id = original_state.replace(".", "_") or "Unknown"
                states_touched.add(state_id)

                # Add an explicit sortable index so we can keep "latest 200" reliably
                row_to_write = dict(row)
                row_to_write["csv_index"] = i

                doc_ref = (db.collection(COLLECTION_NAME)
                           .document(state_id)
                           .collection("data")
                           .document(str(i)))
                batch.set(doc_ref, row_to_write)

            _firestore_commit_with_retry(
                batch,
                max_retries=int(os.getenv("FIRESTORE_COMMIT_MAX_RETRIES", "6")),
                base_delay_s=float(os.getenv("FIRESTORE_COMMIT_BASE_DELAY_S", "1.0")),
                max_delay_s=float(os.getenv("FIRESTORE_COMMIT_MAX_DELAY_S", "30.0")),
            )
            total_uploaded += (batch_end - batch_start)

        # MongoDB: same new rows (if connected)
        if mongo_states_col is not None:
            mongo_batch_size = 1000
            total_mongo_written = 0

            for batch_start in range(0, len(valid_records), mongo_batch_size):
                batch_end = min(batch_start + mongo_batch_size, len(valid_records))
                state_buffer = {}

                # Group docs by state
                for i, row in enumerate(valid_records[batch_start:batch_end],
                                        start=last_index + 1 + batch_start):
                    state_id = str(row[state_column]).strip().replace(".", "_") or "Unknown"
                    mongo_doc = {
                        "date": row.get("Date"),
                        "time": row.get("Time"),
                        "water_level_m_bgl": row.get("Water_Level_m_bgl"),
                        "csv_index": i
                    }
                    state_buffer.setdefault(state_id, []).append(mongo_doc)

                # Prepare bulk operations: push arrays per state with upsert
                ops = []
                for state_id, docs in state_buffer.items():
                    MAX_PER_STATE = int(os.getenv("MONGO_STATE_LIMIT", "50000"))

                    ops.append(UpdateOne(
                        {"_id": state_id},
                        {
                            "$push": {
                                "data": {
                                    "$each": docs,
                                    "$slice": -MAX_PER_STATE
                                }
                            }
                        },
                        upsert=True
                    ))

                if ops:
                    try:
                        result = mongo_states_col.bulk_write(ops, ordered=False)
                        total_mongo_written += (result.modified_count + result.upserted_count)
                        print(f"📦 MongoDB bulk write: modified={result.modified_count}, upserts={len(result.upserted_ids or {})}")
                    except Exception as e:
                        print(f"❌ MongoDB bulk_write error: {e}")
        else:
            print("⚠️ MongoDB not connected. Skipping MongoDB uploads.")

        # Update metadata to the new end of file
        meta_ref.set({
            "old_last_index": last_index,
            "last_index": last_index + len(valid_records)
        })

        # Enforce 200-per-state in Firebase after inserts
        if os.getenv("FIRESTORE_HARD_TRIM", "0") == "1":
            enforce_firestore_state_limit(states_touched, FIREBASE_STATE_LIMIT)

        print(f"✅ Firebase: {total_uploaded} new rows; trimmed to 200/state.")
        return {"message": f"✅ Firebase: {total_uploaded} new rows; trimmed to 200/state."}

    elif total_rows - 1 < last_index:
        print("⚠️ Rollback detected. Fixing metadata...")
        meta_ref.set({"old_last_index": last_index - 1, "last_index": old_last_index})
        return {"message": "♻️ Rollback handled."}
    else:
        print("⚡ No new changes detected.")
        return {"message": "⚡ No new changes detected."}


# ---------- Watchdog Event ----------
class CSVHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(os.path.basename(CSV_FILE)):
            print("📌 CSV modified, syncing new data...")
            sync_new_data()


# ---------- Lifespan Context Manager (Modern FastAPI) ----------
async def _run_initial_sync_safely():
    try:
        await asyncio.to_thread(sync_new_data)
    except Exception as e:
        print(f"⚠️ Initial sync failed; continuing without it. Error: {type(e).__name__}: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    meta_ref = db.collection("metadata").document("upload_info")
    meta = meta_ref.get().to_dict() or {}
    last_index = meta.get("last_index", None)

    if last_index is not None and last_index >= 0:
        print(f"⚡ Existing data detected (last_index={last_index}). Skipping initial sync.")
    else:
        print("🚀 No existing data. Running initial sync...")
        if os.getenv("RUN_INITIAL_SYNC", "1") == "1":
            if os.getenv("INITIAL_SYNC_BACKGROUND", "1") == "1":
                asyncio.create_task(_run_initial_sync_safely())
            else:
                await _run_initial_sync_safely()

    event_handler = CSVHandler()
    observer = Observer()
    observer.schedule(event_handler, path=os.path.dirname(CSV_FILE) or ".", recursive=False)
    threading.Thread(target=observer.start, daemon=True).start()
    print("👀 Watching CSV file for changes...")

    yield

    # Shutdown
    if mongo_client:
        mongo_client.close()
        print("🔌 MongoDB connection closed.")


# ---------- FastAPI App ----------
app = FastAPI(lifespan=lifespan)


@app.get("/today-data")
def get_today_data(api_key: str, valid: bool = Depends(verify_api_key)):
    today = str(date.today())
    results = {}

    for state_doc in db.collection(COLLECTION_NAME).stream():
        state_name = state_doc.id
        docs = (db.collection(COLLECTION_NAME)
                .document(state_name)
                .collection("data")
                .where("Date", "==", today)
                .stream())
        results[state_name] = {doc.id: doc.to_dict() for doc in docs}

    return {"date": today, "records_by_state": results}


@app.get("/state-data")
def get_state_data(state: str, api_key: str, valid: bool = Depends(verify_api_key)):
    state_id = state.replace(".", "_")
    docs = db.collection(COLLECTION_NAME).document(state_id).collection("data").stream()
    results = {doc.id: doc.to_dict() for doc in docs}
    return {"state": state, "records": results}


@app.post("/sync")
def manual_sync(api_key: str, valid: bool = Depends(verify_api_key)):
    return sync_new_data()


@app.get("/mongo-state")
def mongo_state(state: str, api_key: str, valid: bool = Depends(verify_api_key)):
    if mongo_states_col is None:
        return {"error": "MongoDB not connected"}
    state_id = state.replace(".", "_")
    doc = mongo_states_col.find_one({"_id": state_id}, {"data": {"$slice": -5}})
    return {"state": state, "last5": doc.get("data", []) if doc else []}


# ---------- Run ----------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)