#!/usr/bin/env python3
"""
Script to upload DWLR water level data from CSV to Firebase
Converts water level from meters below ground level to percentage
"""

import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os
import sys

# Firebase Setup
cred_path = "aquawatch-42795-firebase-adminsdk-fbsvc-c63652eac0.json"
if not firebase_admin._apps:
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        print(f"Error: Firebase credentials file not found: {cred_path}")
        sys.exit(1)

db = firestore.client()


def convert_water_level_to_percentage(bgl_value):
    """
    Convert water level from meters below ground level to percentage
    Lower bgl values = higher water availability
    """
    try:
        bgl = float(bgl_value)
        # Assuming typical range: 0-50m bgl
        # 0m bgl = 100% availability, 50m bgl = 0% availability
        max_depth = 50.0
        percentage = max(0, min(100, 100 - (bgl / max_depth) * 100))
        return round(percentage, 1)
    except (ValueError, TypeError):
        return 50.0  # Default fallback


def get_water_status(water_percentage):
    """Determine water status based on percentage"""
    if water_percentage < 20:
        return "critical"
    elif water_percentage < 40:
        return "warning"
    elif water_percentage < 70:
        return "normal"
    else:
        return "good"


def upload_csv_to_firebase():
    """Upload CSV data to Firebase with proper conversion"""
    csv_file = "data/dwlr_india.csv"

    if not os.path.exists(csv_file):
        print(f"Error: CSV file not found: {csv_file}")
        return

    print(f"Reading CSV file: {csv_file}")
    df = pd.read_csv(csv_file)

    print(f"Found {len(df)} records")
    print(f"Columns: {list(df.columns)}")

    # Group by state for processing
    states_processed = set()
    total_records = 0

    for _, row in df.iterrows():
        state = str(row['State']).strip()
        date_str = str(row['Date'])
        time_str = str(row['Time'])
        water_level_bgl = row['Water_Level_m_bgl']

        # Convert to percentage
        water_percentage = convert_water_level_to_percentage(water_level_bgl)

        # Create datetime
        try:
            datetime_str = f"{date_str} {time_str}"
            measurement_date = pd.to_datetime(datetime_str)
        except:
            measurement_date = datetime.now()

        # Prepare document data
        doc_data = {
            'State': state,
            'Date': date_str,
            'Time': time_str,
            'Water_Level_m_bgl': float(water_level_bgl),
            'Water_Level_percentage': water_percentage,
            'timestamp': measurement_date,
            'status': get_water_status(water_percentage),
            'uploaded_at': datetime.now()
        }

        # Upload to Firebase: DWLR_state/{state}/data/{unique_id}
        state_doc = state.replace(" ", "_").replace(".", "_")
        doc_id = f"{date_str.replace('/', '_')}_{time_str.replace(':', '_')}"

        try:
            db.collection("DWLR_state").document(state_doc).collection(
                "data").document(doc_id).set(doc_data)
            total_records += 1
            states_processed.add(state)

            if total_records % 100 == 0:
                print(f"Uploaded {total_records} records...")

        except Exception as e:
            print(f"Error uploading record for {state}: {e}")

    # Update state summary documents
    for state in states_processed:
        state_doc = state.replace(" ", "_").replace(".", "_")

        # Get latest data for this state
        state_data_ref = db.collection("DWLR_state").document(
            state_doc).collection("data")
        latest_docs = state_data_ref.order_by(
            "timestamp", direction=firestore.Query.DESCENDING).limit(1).get()

        if latest_docs:
            latest_data = latest_docs[0].to_dict()

            # Update state summary document
            state_summary = {
                'state': state,
                'waterLevel': latest_data['Water_Level_percentage'],
                'status': latest_data['status'],
                'lastUpdated': latest_data['timestamp'],
                'location': f"{state} Region",
                'capacity': 50000,  # Default capacity
                'currentReserve': latest_data['Water_Level_percentage'] * 500,
                'data_source': 'DWLR_sensors',
                'last_sync': datetime.now()
            }

            db.collection("DWLR_state").document(
                state_doc).set(state_summary, merge=True)
            print(
                f"Updated summary for {state}: {latest_data['Water_Level_percentage']}%")

    print(f"\n✅ Upload complete!")
    print(f"Total records uploaded: {total_records}")
    print(f"States processed: {len(states_processed)}")
    print(f"States: {', '.join(sorted(states_processed))}")


if __name__ == "__main__":
    upload_csv_to_firebase()
