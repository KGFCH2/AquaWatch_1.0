import json
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate("aquawatch1-101ef-firebase-adminsdk-fbsvc-e660198f76.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load JSON file
with open("data/groundwater_india.json") as f:
    records = json.load(f)

# Upload each record to Firestore
for i, row in enumerate(records):
    db.collection("DWLR_state").document(str(i)).set(row)

print("✅ JSON uploaded to Firebase Firestore!")
