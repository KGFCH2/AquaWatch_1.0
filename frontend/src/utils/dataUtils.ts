// Utility functions for working with real DWLR data

export interface RealWaterData {
  date: string;
  state: string;
  water_level?: number;
  groundwater_level?: number;
  depth?: number;
  location?: string;
  [key: string]: any; // Allow for other CSV columns
}

/**
 * Converts various water level field names to a standardized format
 * Special handling for DWLR data where values are in meters below ground level (bgl)
 */
export const extractWaterLevel = (entry: any): number => {
  const possibleFields = [
    "Water_Level_m_bgl",
    "water_level_m_bgl",
    "water_level",
    "waterLevel",
    "level",
    "groundwater_level",
    "depth",
    "water_depth",
    "groundwater",
    "gwl",
    "water_table",
    "reservoir_level",
    "tank_level",
  ];

  for (const field of possibleFields) {
    if (
      entry[field] !== undefined &&
      entry[field] !== null &&
      entry[field] !== ""
    ) {
      const value = parseFloat(entry[field]);
      if (!isNaN(value)) {
        // Special handling for DWLR data (meters below ground level)
        if (field.includes("bgl") || field.includes("Water_Level_m_bgl")) {
          // Convert meters below ground level to percentage
          // Lower bgl values = higher water availability
          // Assuming typical range: 0-50m bgl
          // 0m bgl = 100% availability, 50m bgl = 0% availability
          const maxDepth = 50; // maximum depth in meters
          const waterPercentage = Math.max(
            0,
            Math.min(100, 100 - (value / maxDepth) * 100)
          );
          return Math.round(waterPercentage);
        }

        // For other depth measurements
        if (field.includes("depth") && value > 100) {
          // Assume it's depth in meters, convert to percentage (inverse relationship)
          return Math.max(0, Math.min(100, 100 - value / 10));
        }

        // For direct percentage values
        return Math.max(0, Math.min(100, value));
      }
    }
  }

  return 50; // Default fallback
};

/**
 * Extracts date from various date field formats
 * Special handling for DWLR CSV format: Date (9/4/2025) + Time (0:00:00)
 */
export const extractDate = (entry: any): Date => {
  // First try to find a combined timestamp field
  if (entry.timestamp && entry.timestamp.toDate) {
    return entry.timestamp.toDate();
  }

  // Handle DWLR CSV format with separate Date and Time fields
  if (entry.Date && entry.Time) {
    try {
      // Combine date and time: "9/4/2025 0:00:00"
      const dateTimeString = `${entry.Date} ${entry.Time}`;
      const combinedDate = new Date(dateTimeString);
      if (!isNaN(combinedDate.getTime())) {
        return combinedDate;
      }
    } catch (error) {
      console.log("Error parsing combined date/time:", error);
    }
  }

  // Try other possible date fields
  const possibleFields = [
    "date",
    "Date",
    "timestamp",
    "recorded_date",
    "measurement_date",
    "obs_date",
    "created_at",
    "updated_at",
  ];

  for (const field of possibleFields) {
    if (entry[field]) {
      // Handle Firestore Timestamp objects
      if (entry[field].toDate && typeof entry[field].toDate === "function") {
        return entry[field].toDate();
      }

      // Handle regular date strings
      const date = new Date(entry[field]);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return new Date(); // Default to current date
};

/**
 * Normalizes state names to match standard format
 */
export const normalizeStateName = (stateName: string): string => {
  const stateMapping: { [key: string]: string } = {
    maharashtra: "Maharashtra",
    tamil_nadu: "Tamil Nadu",
    uttar_pradesh: "Uttar Pradesh",
    karnataka: "Karnataka",
    gujarat: "Gujarat",
    rajasthan: "Rajasthan",
    punjab: "Punjab",
    haryana: "Haryana",
    kerala: "Kerala",
    west_bengal: "West Bengal",
    madhya_pradesh: "Madhya Pradesh",
    bihar: "Bihar",
    andhra_pradesh: "Andhra Pradesh",
    telangana: "Telangana",
    assam: "Assam",
    odisha: "Odisha",
    jharkhand: "Jharkhand",
    himachal_pradesh: "Himachal Pradesh",
    uttarakhand: "Uttarakhand",
    chhattisgarh: "Chhattisgarh",
    goa: "Goa",
    delhi: "Delhi",
  };

  const normalized = stateName.toLowerCase().replace(/\s+/g, "_");
  return stateMapping[normalized] || stateName;
};

/**
 * Sample function to test data insertion - can be called from admin panel
 */
export const createSampleDataEntry = (state: string): RealWaterData => {
  const today = new Date();
  const baseLevel = Math.floor(Math.random() * 60) + 20; // 20-80%

  return {
    date: today.toISOString().split("T")[0],
    state: state,
    water_level: baseLevel + (Math.random() * 10 - 5), // Add some variance
    groundwater_level: baseLevel,
    location: `${state} Region`,
    measurement_type: "automated_sensor",
    data_source: "DWLR_station",
  };
};
