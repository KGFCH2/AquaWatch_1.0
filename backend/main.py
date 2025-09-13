# main.py
import pandas as pd
from datetime import date
from fastapi import FastAPI, Depends, HTTPException
import uvicorn
import firebase_admin
from firebase_admin import credentials, firestore
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import os

# ---------- Config ----------
CSV_FILE = "data/dwlr_india.csv"
COLLECTION_NAME = "DWLR_state"
API_KEY = "bfb4498b5acd2ece3dadf3eed5aacfee"

# ---------- Firebase Setup ----------
cred = credentials.Certificate("aquawatch-42795-firebase-adminsdk-fbsvc-c63652eac0.json")
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ---------- Helpers ----------
def load_csv():
    df = pd.read_csv(CSV_FILE)
    return df.to_dict(orient="records"), df.columns[0]  # return first column as state column

def is_complete_row(row: dict) -> bool:
    """Check if all attributes in the row are filled (non-empty, non-null)."""
    return all(str(value).strip() not in ["", "nan", "None"] for value in row.values())

# ---------- API Key Verification ----------
def verify_api_key(api_key: str):
    if api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return True

# ---------- Sync Logic ----------
def sync_new_data():
    """Sync new rows incrementally using batching (≤500 writes)."""
    records, state_column = load_csv()
    total_rows = len(records)

    # Ensure metadata exists
    meta_ref = db.collection("metadata").document("upload_info")
    meta = meta_ref.get().to_dict() or {}
    last_index = meta.get("last_index", -1)
    old_last_index = meta.get("old_last_index", -1)

    # --- Handle new rows ---
    if total_rows - 1 > last_index:
        new_records = records[last_index + 1 :]
        complete_new_records = [row for row in new_records if is_complete_row(row)]

        if not complete_new_records:
            print("⚡ No complete new data to upload.")
            return {"message": "⚡ No complete new data to upload."}

        batch_size = 500
        total_uploaded = 0

        for batch_start in range(0, len(complete_new_records), batch_size):
            batch = db.batch()
            batch_end = min(batch_start + batch_size, len(complete_new_records))

            for i, row in enumerate(
                complete_new_records[batch_start:batch_end],
                start=last_index + 1 + batch_start
            ):
                state_name = str(row[state_column]).replace(".", "_").strip() or "Unknown"
                doc_ref = db.collection(COLLECTION_NAME).document(state_name).collection("data").document(str(i))
                batch.set(doc_ref, row)

            batch.commit()
            total_uploaded += (batch_end - batch_start)
            print(f"📤 Uploaded batch {batch_start // batch_size + 1}: {batch_end - batch_start} rows")

        # Update metadata after all batches succeed
        meta_ref.set({
            "old_last_index": last_index,
            "last_index": last_index + len(complete_new_records)
        })

        print(f"✅ Uploaded {total_uploaded} new rows by state to Firebase.")
        return {"message": f"✅ Uploaded {total_uploaded} new rows by state to Firebase."}

    # Step7: Handle rollback (rows deleted in CSV)
    elif total_rows - 1 < last_index:
        print(f"⚠️ Detected rollback. Updating metadata...")
        meta_ref.set({
            "old_last_index": last_index - 1,
            "last_index": old_last_index
        })
        print(f"♻️ Rollback handled. last_index={old_last_index}, old_last_index={last_index - 1}")
        return {"message": f"♻️ Rollback handled. last_index={old_last_index}, old_last_index={last_index - 1}"}

    else:
        print("⚡ No new changes detected.")
        return {"message": "⚡ No new changes detected."}

# ---------- Watchdog Event ----------
class CSVHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(os.path.basename(CSV_FILE)):
            print("📌 CSV modified, syncing new data...")
            sync_new_data()

# ---------- FastAPI App ----------
app = FastAPI()

@app.get("/today-data")
def get_today_data(api_key: str, valid: bool = Depends(verify_api_key)):
    today = str(date.today())
    results = {}
    for state_doc in db.collection(COLLECTION_NAME).stream():
        state_name = state_doc.id
        docs = db.collection(COLLECTION_NAME).document(state_name).collection("data")\
                 .where("date", "==", today).stream()
        results[state_name] = {doc.id: doc.to_dict() for doc in docs}
    return {"date": today, "records_by_state": results}

@app.get("/state-data")
def get_state_data(state: str, api_key: str, valid: bool = Depends(verify_api_key)):
    state_name = state.replace(".", "_")
    docs = db.collection(COLLECTION_NAME).document(state_name).collection("data").stream()
    results = {doc.id: doc.to_dict() for doc in docs}
    return {"state": state, "records": results}

@app.post("/sync")
def manual_sync(api_key: str, valid: bool = Depends(verify_api_key)):
    """Manually trigger sync of new rows."""
    return sync_new_data()

# ---------- Startup ----------
@app.on_event("startup")
def startup_event():
    meta_ref = db.collection("metadata").document("upload_info")
    meta = meta_ref.get().to_dict() or {}
    last_index = meta.get("last_index", None)

    if last_index is not None and last_index >= 0:
        print(f"⚡ Existing data detected in Firebase (last_index={last_index}). Skipping initial sync.")
    else:
        print("🚀 No existing data. Starting initial sync...")
        sync_new_data()

    # Step3: Start watchdog to monitor CSV changes
    event_handler = CSVHandler()
    observer = Observer()
    observer.schedule(event_handler, path=os.path.dirname(CSV_FILE) or ".", recursive=False)
    observer_thread = threading.Thread(target=observer.start, daemon=True)
    observer_thread.start()
    print("👀 Watching CSV file for changes...")


# ---------- Run ----------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
