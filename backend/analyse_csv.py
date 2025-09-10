import pandas as pd
import json

# Load CSV
df = pd.read_csv("data/groundwater_india.csv")

# Example: Get summary statistics
summary = df.describe().to_dict()

# Save dataset as JSON
records = df.to_dict(orient="records")

# Save locally
with open("data/groundwater_india.json", "w") as f:
    json.dump(records, f, indent=2)

print("✅ CSV converted to JSON successfully!")
