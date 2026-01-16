import pandas as pd
from prophet import Prophet
from pymongo import MongoClient
from datetime import datetime, timezone
import logging
import os
from dotenv import load_dotenv
import warnings
import matplotlib.pyplot as plt

# Suppress Prophet warnings
warnings.filterwarnings('ignore', message='.*Y.*is deprecated.*')
warnings.filterwarnings('ignore', message='.*utcnow.*is deprecated.*')

# ------------------- LOGGING -------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

# ------------------- MONGODB CONFIG -------------------
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")
RAW_DATA_COLLECTION = os.getenv("MONGO_COLLECTION_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

raw_col = db[RAW_DATA_COLLECTION]
OUTPUT_DIR = "predictions"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ------------------- MODEL CONFIG -------------------
YEARS_TO_PREDICT = 5
CONFIDENCE_INTERVAL = 0.90
MIN_DATA_POINTS = 10   # minimum records per state

# ------------------- RISK THRESHOLDS -------------------
def classify_risk(level):
    """
    Emergency classification logic
    Modify thresholds if required (state-wise later)
    """
    if level < 3.0:
        return "EMERGENCY"
    elif level < 5.0:
        return "WARNING"
    else:
        return "SAFE"

# ------------------- LOAD DATA -------------------
def load_state_data(state):
    """
    Fetch and prepare state-wise data for Prophet
    """
    records = list(raw_col.find(
        {"state": state},
        {"_id": 0, "date": 1, "water_level": 1}
    ))

    if len(records) < MIN_DATA_POINTS:
        return None

    df = pd.DataFrame(records)
    df.rename(columns={
        "date": "ds",
        "water_level": "y"
    }, inplace=True)

    df["ds"] = pd.to_datetime(df["ds"])
    df = df.sort_values("ds")

    return df

# ------------------- TRAIN & PREDICT -------------------
def train_and_predict(df):
    """
    Train Prophet model and predict future water levels
    """
    try:
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            interval_width=CONFIDENCE_INTERVAL
        )

        model.fit(df)

        future = model.make_future_dataframe(
            periods=YEARS_TO_PREDICT,
            freq="YE"  # Changed from deprecated 'Y' to 'YE'
        )

        forecast = model.predict(future)

        return model, forecast.tail(YEARS_TO_PREDICT)
    except KeyboardInterrupt:
        return None, None
    except Exception as e:
        logging.error(f"Model training failed: {str(e)}")
        return None, None

# ------------------- SAVE PREDICTIONS TO MONGODB -------------------
def save_predictions_to_mongodb(state, forecast):
    """
    Save forecast predictions to MongoDB as JSON for the state
    """
    try:
        # Create predictions collection if not exists
        predictions_col = db["state_predictions"]
        
        # Convert forecast dataframe to list of dictionaries
        forecast_list = []
        for _, row in forecast.iterrows():
            forecast_dict = {
                "date": row['ds'].strftime("%Y-%m-%d") if pd.notna(row['ds']) else None,
                "forecast": float(row['yhat']) if pd.notna(row['yhat']) else None,
                "lower_bound": float(row['yhat_lower']) if pd.notna(row['yhat_lower']) else None,
                "upper_bound": float(row['yhat_upper']) if pd.notna(row['yhat_upper']) else None,
                "trend": float(row['trend']) if pd.notna(row['trend']) else None,
            }
            forecast_list.append(forecast_dict)
        
        # Prepare document for MongoDB
        prediction_doc = {
            "_id": state,
            "state": state,
            "forecast_data": forecast_list,
            "created_at": datetime.now(timezone.utc),
            "forecast_period_years": YEARS_TO_PREDICT,
            "confidence_interval": CONFIDENCE_INTERVAL,
            "total_predictions": len(forecast_list)
        }
        
        # Upsert the document (replace if exists)
        result = predictions_col.replace_one(
            {"_id": state},
            prediction_doc,
            upsert=True
        )
        
        logging.info(f"✅ Saved {len(forecast_list)} predictions for {state} to MongoDB")
        return True
        
    except Exception as e:
        logging.error(f"Failed to save predictions to MongoDB for {state}: {str(e)}")
        return False


# ------------------- SAVE PREDICTIONS GRAPH -------------------
def save_predictions_graph(state, model, forecast):
    """
    Create and save forecast graph for each state
    """
    try:
        # Extract year from dates
        forecast['year'] = forecast['ds'].dt.year
        
        # Create figure
        fig, ax = plt.subplots(figsize=(14, 7))
        
        # Plot forecast year-wise
        ax.plot(forecast['year'], forecast['yhat'], label='Forecast', color='blue', linewidth=2, marker='o', markersize=8)
        ax.fill_between(forecast['year'], 
                        forecast['yhat_lower'], 
                        forecast['yhat_upper'], 
                        alpha=0.2, 
                        color='blue', 
                        label='Confidence Interval')
        
        ax.set_xlabel('Year', fontsize=12, fontweight='bold')
        ax.set_ylabel('Water Level (m bgl)', fontsize=12, fontweight='bold')
        ax.set_title(f'Groundwater Level Forecast - {state}', fontsize=14, fontweight='bold')
        ax.legend(loc='best', fontsize=10)
        ax.grid(True, alpha=0.3)
        
        # Set x-axis to show years as integers
        ax.set_xticks(forecast['year'].values)
        ax.set_xticklabels(forecast['year'].astype(int).values, rotation=45)
        
        plt.tight_layout()
        
        # Save figure
        
        filename = f"{state.replace(' ', '_')}_forecast.png"
        filepath = os.path.join(OUTPUT_DIR, filename)
        plt.savefig(filepath, dpi=100, bbox_inches='tight')
        plt.close()
        
        return filepath
    except Exception as e:
        logging.error(f"Failed to save graph for {state}: {str(e)}")
        plt.close()
        return None


# ------------------- MAIN PIPELINE -------------------
def run_prediction_pipeline():
    states = raw_col.distinct("state")

    logging.info(f"Found {len(states)} states for prediction")
    
    successful_states = 0
    failed_states = 0

    for state in states:
        try:
            logging.info(f"Processing state: {state}")

            df = load_state_data(state)
            if df is None:
                logging.warning(f"Not enough data for {state}")
                continue

            model, forecast = train_and_predict(df)
            if forecast is None or model is None:
                logging.warning(f"Forecast generation failed for {state}, skipping...")
                failed_states += 1
                continue
            
            # Save predictions to MongoDB
            mongo_saved = save_predictions_to_mongodb(state, forecast)
            
            # Save graph
            graph_path = save_predictions_graph(state, model, forecast)
            
            if mongo_saved and graph_path:
                successful_states += 1
                logging.info(f"✓ Predictions & graph saved for {state}")
            else:
                failed_states += 1

        except Exception as e:
            failed_states += 1
            logging.error(f"Error processing {state}: {str(e)}")
            continue

    logging.info(f"Prediction pipeline finished!")
    logging.info(f"Summary: {successful_states} states processed successfully, {failed_states} failed")
    logging.info(f"All graphs saved to: {OUTPUT_DIR}")
    logging.info(f"All predictions stored in MongoDB collection: state_predictions")


# ------------------- ENTRY POINT -------------------
if __name__ == "__main__":
    run_prediction_pipeline()
