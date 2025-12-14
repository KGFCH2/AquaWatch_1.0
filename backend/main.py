# main.py
import os
import threading
from datetime import date
from contextlib import asynccontextmanager
import math
import time

import pandas as pd
import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

# Firebase
import firebase_admin
from firebase_admin import credentials, firestore

# MongoDB
from pymongo import MongoClient

# ---------- Config ----------
CSV_FILE = "data/groundwater.csv"
COLLECTION_NAME = "DWLR_state"   # Firestore collection (per state sub-collections)
API_KEY = "bfb4498b5acd2ece3dadf3eed5aacfee"

# MongoDB config (Data Warehouse)
MONGO_URI = "mongodb+srv://aquawatch:AquaWatch%402025@cluster0.gbzbbrn.mongodb.net/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true"
MONGO_DB_NAME = "aquawatch"
MONGO_COLLECTION_NAME = "states"   # one document per state, with data array
MONGO_STATE_FIELD_LIMIT = None     # we don't delete anything in MongoDB

FIREBASE_STATE_LIMIT = 200         # keep only latest 200 records per state in Firestore


# ---------- Firebase Setup ----------
cred = credentials.Certificate("aquawatch-30c00-firebase-adminsdk-fbsvc-382838e8af.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ---------- MongoDB Setup ----------
try:
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
    """Filter records to keep only the latest 'limit' records per state."""
    state_records = {}
    
    # Group records by state
    for i, row in enumerate(valid_records):
        state = str(row.get("State", "Unknown")).strip()
        if state not in state_records:
            state_records[state] = []
        state_records[state].append((i, row))
    
    # Keep only the latest 'limit' records per state
    filtered = []
    for state, records in state_records.items():
        # Keep the last 'limit' records (most recent)
        latest_records = records[-limit:] if len(records) > limit else records
        filtered.extend(latest_records)
    
    return filtered


def enforce_firestore_state_limit(states_touched, limit=FIREBASE_STATE_LIMIT):
    if limit is None:
        return

    for state_id in states_touched:
        state_data_col = db.collection(COLLECTION_NAME).document(state_id).collection("data")
        docs = list(state_data_col.stream())

        # Sort by numeric doc id (csv index) so we can remove oldest locally
        try:
            sorted_docs = sorted(docs, key=lambda d: int(d.id))
        except ValueError:
            # Fallback: leave order as-is if any id is non-numeric
            sorted_docs = docs

        extra = len(sorted_docs) - limit
        if extra <= 0:
            continue

        batch = db.batch()
        count = 0
        for d in sorted_docs[:extra]:  # delete oldest extras
            batch.delete(d.reference)
            count += 1
            if count % 400 == 0:
                batch.commit()
                batch = db.batch()
        if count % 400 != 0:
            batch.commit()

        print(f"🧹 Deleted {count} old records for {state_id}; capped at {limit}.")


# ---------- Sync Logic ----------
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
                doc_ref = (db.collection(COLLECTION_NAME)
                           .document(state_id)
                           .collection("data")
                           .document(str(i)))
                batch.set(doc_ref, row)
            batch.commit()
            total_uploaded += (batch_end - batch_start)

        # MongoDB: same new rows (if connected)
        if mongo_states_col is not None:
            mongo_batch_size = 500
            for batch_start in range(0, len(valid_records), mongo_batch_size):
                batch_end = min(batch_start + mongo_batch_size, len(valid_records))
                for i, row in enumerate(valid_records[batch_start:batch_end],
                                        start=last_index + 1 + batch_start):
                    original_state = str(row[state_column]).strip()
                    state_id = original_state.replace(".", "_") or "Unknown"
                    mongo_doc = {
                        "state": original_state,
                        "date": row.get("Date"),
                        "time": row.get("Time"),
                        "water_level_m_bgl": row.get("Water_Level_m_bgl"),
                        "csv_index": i
                    }
                    try:
                        mongo_states_col.update_one(
                            {"_id": state_id},
                            {"$push": {"data": mongo_doc}},
                            upsert=True
                        )
                    except Exception as e:
                        print(f"⚠️ MongoDB insert error for {state_id}: {e}")
        else:
            print("⚠️ MongoDB not connected. Skipping MongoDB uploads.")

        # Update metadata to the new end of file
        meta_ref.set({
            "old_last_index": last_index,
            "last_index": last_index + len(valid_records)
        })

        # Enforce 200-per-state in Firebase after inserts
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
        sync_new_data()

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


# ---------- Run ----------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)