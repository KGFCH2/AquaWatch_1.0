#!/usr/bin/env python3
"""
Script to check and analyze the existing DWLR data in Firebase
"""

import firebase_admin
from firebase_admin import credentials, firestore
import json

# Firebase Setup
cred_path = "aquawatch-42795-firebase-adminsdk-fbsvc-c63652eac0.json"
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()


def analyze_firebase_data():
    """Analyze the current structure and data in Firebase"""
    print("🔍 Analyzing Firebase DWLR_state collection...")

    # Get all state documents
    states_ref = db.collection("DWLR_state")
    states = states_ref.get()

    print(f"\n📊 Found {len(states)} state documents:")

    for state_doc in states:
        state_id = state_doc.id
        state_data = state_doc.to_dict()

        print(f"\n🏛️  State: {state_id}")
        print(f"   Water Level: {state_data.get('waterLevel', 'N/A')}%")
        print(f"   Status: {state_data.get('status', 'N/A')}")
        print(f"   Last Updated: {state_data.get('lastUpdated', 'N/A')}")

        # Check if there's a data subcollection
        data_ref = db.collection("DWLR_state").document(
            state_id).collection("data")
        data_docs = data_ref.limit(5).get()  # Get first 5 records

        if data_docs:
            print(f"   📈 Data subcollection: {len(data_docs)} sample records")
            for i, doc in enumerate(data_docs):
                doc_data = doc.to_dict()
                print(f"      Record {i+1}: {doc_data}")
        else:
            print(f"   📈 Data subcollection: No data found")

    # Check for any other collections
    print(f"\n🗂️  Checking for other collections...")
    collections = db.collections()
    for collection in collections:
        print(f"   Collection: {collection.id}")


def get_sample_state_data(state_name="Maharashtra"):
    """Get detailed data for a specific state"""
    print(f"\n🔍 Getting detailed data for {state_name}...")

    # Try different possible document IDs
    possible_ids = [state_name, state_name.replace(
        " ", "_"), state_name.lower(), state_name.lower().replace(" ", "_")]

    for doc_id in possible_ids:
        try:
            state_ref = db.collection("DWLR_state").document(doc_id)
            state_doc = state_ref.get()

            if state_doc.exists:
                print(f"✅ Found state document: {doc_id}")
                state_data = state_doc.to_dict()
                print(
                    f"State data: {json.dumps(state_data, indent=2, default=str)}")

                # Get subcollection data
                data_ref = state_ref.collection("data")
                data_docs = data_ref.order_by(
                    "timestamp", direction=firestore.Query.DESCENDING).limit(10).get()

                print(f"\n📊 Latest 10 data entries:")
                for i, doc in enumerate(data_docs):
                    doc_data = doc.to_dict()
                    water_level = doc_data.get(
                        'Water_Level_percentage', doc_data.get('waterLevel', 'N/A'))
                    timestamp = doc_data.get(
                        'timestamp', doc_data.get('date', 'N/A'))
                    print(
                        f"   {i+1}. Water Level: {water_level}% | Time: {timestamp}")

                return state_data, [doc.to_dict() for doc in data_docs]
            else:
                print(f"❌ Document not found: {doc_id}")
        except Exception as e:
            print(f"❌ Error checking {doc_id}: {e}")

    return None, []


def fix_state_data_if_needed():
    """Fix any issues with state data structure"""
    print(f"\n🔧 Checking and fixing state data structure...")

    states_ref = db.collection("DWLR_state")
    states = states_ref.get()

    for state_doc in states:
        state_id = state_doc.id
        state_data = state_doc.to_dict()

        # Check if waterLevel is set to default 50
        if state_data.get('waterLevel') == 50:
            print(
                f"🔄 State {state_id} has default waterLevel (50%), checking for real data...")

            # Get latest data from subcollection
            data_ref = db.collection("DWLR_state").document(
                state_id).collection("data")
            latest_docs = data_ref.order_by(
                "timestamp", direction=firestore.Query.DESCENDING).limit(1).get()

            if latest_docs:
                latest_data = latest_docs[0].to_dict()
                real_water_level = latest_data.get(
                    'Water_Level_percentage', latest_data.get('waterLevel'))

                if real_water_level and real_water_level != 50:
                    print(
                        f"   ✅ Found real data: {real_water_level}% - updating state document")

                    # Update state document with real data
                    update_data = {
                        'waterLevel': real_water_level,
                        'status': get_status(real_water_level),
                        'lastUpdated': latest_data.get('timestamp', firestore.SERVER_TIMESTAMP),
                        'data_source': 'real_dwlr_sensors'
                    }

                    state_doc.reference.update(update_data)
                    print(f"   🎯 Updated {state_id}: {real_water_level}%")


def get_status(water_level):
    """Get status based on water level"""
    if water_level < 20:
        return "critical"
    elif water_level < 40:
        return "warning"
    elif water_level < 70:
        return "normal"
    else:
        return "good"


if __name__ == "__main__":
    print("🚀 Firebase Data Analysis Tool")
    print("=" * 50)

    # Analyze current data
    analyze_firebase_data()

    # Get sample state data
    state_data, data_entries = get_sample_state_data("Maharashtra")

    # Fix state data if needed
    fix_state_data_if_needed()

    print("\n✅ Analysis complete!")
