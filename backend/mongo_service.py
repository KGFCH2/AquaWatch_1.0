# mongo_service.py
import os
from pymongo import MongoClient, UpdateOne
from dotenv import load_dotenv

# ---------- MongoDB Config ----------
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "aquawatch")
MONGO_COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "states")
MONGO_STATE_LIMIT = int(os.getenv("MONGO_STATE_LIMIT", "50000"))


class MongoService:
    def __init__(self):
        self.client = None
        self.collection = None
        self._connect()

    def _connect(self):
        try:
            if not MONGO_URI:
                raise ValueError("MONGO_URI not set")

            self.client = MongoClient(
                MONGO_URI,
                serverSelectionTimeoutMS=5000
            )
            db = self.client[MONGO_DB_NAME]
            self.collection = db[MONGO_COLLECTION_NAME]

            self.client.admin.command("ping")
            print("✅ MongoDB connected successfully")

        except Exception as e:
            print(f"⚠️ MongoDB connection failed: {e}")
            self.client = None
            self.collection = None

    def is_connected(self) -> bool:
        return self.collection is not None

    def bulk_upsert_state_data(self, state_buffer: dict):
        """
        state_buffer = {
            "West_Bengal": [ {...}, {...} ],
            "Bihar": [ {...} ]
        }
        """

        if self.collection is None:
            print("⚠️ MongoDB not connected. Skipping write.")
            return

        ops = []

        for state_id, docs in state_buffer.items():
            ops.append(UpdateOne(
                {"_id": state_id},
                {
                    "$push": {
                        "data": {
                            "$each": docs,
                            "$slice": -MONGO_STATE_LIMIT
                        }
                    }
                },
                upsert=True
            ))

        if not ops:
            return

        try:
            result = self.collection.bulk_write(ops, ordered=False)
            print(
                f"📦 MongoDB bulk write → "
                f"modified={result.modified_count}, "
                f"upserts={len(result.upserted_ids or {})}"
            )
        except Exception as e:
            print(f"❌ MongoDB bulk_write error: {e}")

    def get_last_n_by_state(self, state_id: str, limit: int = 5):
        if self.collection is None:
            return []

        doc = self.collection.find_one(
            {"_id": state_id},
            {"data": {"$slice": -limit}}
        )
        return doc.get("data", []) if doc else []

    def close(self):
        if self.client:
            self.client.close()
            print("🔌 MongoDB connection closed")

if __name__ == "__main__":
    ms = MongoService()
    print("Connected:", ms.is_connected())
    ms.close()
