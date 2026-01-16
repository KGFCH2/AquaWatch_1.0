# upload_to_mongo.py
import pandas as pd
from mongo_service import MongoService

CSV_FILE = "data/groundwater.csv"
BATCH_SIZE = 1000


def upload_csv_to_mongo():
    ms = MongoService()

    if not ms.is_connected():
        print("❌ MongoDB not connected. Aborting upload.")
        return

    print("📄 Loading CSV...")
    df = pd.read_csv(CSV_FILE)

    total_rows = len(df)
    print(f"📊 Total rows in CSV: {total_rows}")

    for batch_start in range(0, total_rows, BATCH_SIZE):
        batch_end = min(batch_start + BATCH_SIZE, total_rows)
        batch_df = df.iloc[batch_start:batch_end]

        state_buffer = {}

        for idx, row in batch_df.iterrows():
            state_id = str(row.get("State", "Unknown")).strip().replace(".", "_") or "Unknown"

            mongo_doc = {
                "date": row.get("Date"),
                "time": row.get("Time"),
                "water_level_m_bgl": row.get("Water_Level_m_bgl"),
                "csv_index": int(idx)
            }

            state_buffer.setdefault(state_id, []).append(mongo_doc)

        ms.bulk_upsert_state_data(state_buffer)

        print(f"✅ Uploaded rows {batch_start} → {batch_end}")

    ms.close()
    print("🎉 CSV upload completed successfully!")


if __name__ == "__main__":
    upload_csv_to_mongo()
