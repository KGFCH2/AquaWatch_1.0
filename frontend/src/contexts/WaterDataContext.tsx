import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";

interface WaterData {
  state: string;
  waterLevel: number;
  lastUpdated: Date;
  status: "critical" | "warning" | "normal" | "good";
  location?: string;
  capacity?: number;
  currentReserve?: number;
}

interface StateData {
  [key: string]: WaterData;
}

interface WaterDataContextType {
  stateWaterData: StateData;
  loading: boolean;
  error: string | null;
  getUserStateData: () => WaterData | null;
  getAllStatesData: () => Promise<StateData>;
  updateStateData: (
    stateName: string,
    data: Partial<WaterData>
  ) => Promise<void>;
  refreshData: () => Promise<void>;
}

const WaterDataContext = createContext<WaterDataContextType | undefined>(
  undefined
);

export const useWaterData = () => {
  const context = useContext(WaterDataContext);
  if (context === undefined) {
    throw new Error("useWaterData must be used within a WaterDataProvider");
  }
  return context;
};

export const WaterDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stateWaterData, setStateWaterData] = useState<StateData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData, isAdmin } = useAuth();

  // Function to determine water status based on level
  const getWaterStatus = (
    waterLevel: number
  ): "critical" | "warning" | "normal" | "good" => {
    if (waterLevel < 20) return "critical";
    if (waterLevel < 40) return "warning";
    if (waterLevel < 70) return "normal";
    return "good";
  };

  // Get user's state data
  const getUserStateData = (): WaterData | null => {
    if (!userData || userData.role === "admin") return null;
    const userState = (userData as any).state;

    // For demo user, ensure Maharashtra data is available
    if (userData.uid === "demo_user_123" && userState === "Maharashtra") {
      // If Maharashtra data doesn't exist, create it
      if (!stateWaterData["Maharashtra"]) {
        const demoMaharashtraData: WaterData = {
          state: "Maharashtra",
          waterLevel: 45,
          lastUpdated: new Date(),
          status: "warning",
          location: "Mumbai, Pune, Nagpur",
          capacity: 125000,
          currentReserve: 56250,
        };

        // Update the state data with Maharashtra info
        setStateWaterData((prev) => ({
          ...prev,
          Maharashtra: demoMaharashtraData,
        }));

        return demoMaharashtraData;
      }
    }

    return stateWaterData[userState] || null;
  };

  // Get all states data from Firebase
  const getAllStatesData = async (): Promise<StateData> => {
    try {
      setLoading(true);
      setError(null);

      const dwlrCollectionRef = collection(db, "DWLR_state");
      const querySnapshot = await getDocs(dwlrCollectionRef);

      const data: StateData = {};

      if (querySnapshot.empty) {
        console.log("No DWLR_state documents found, using fallback data");
        // If no data exists in Firebase, create some initial data
        await createInitialStateData();
        return getAllStatesData(); // Retry after creating initial data
      }

      querySnapshot.forEach((doc) => {
        const stateData = doc.data();
        const stateName = doc.id;

        // Extract water level data from the document
        const waterLevel = stateData.waterLevel || 50; // fallback to 50%
        const lastUpdated = stateData.lastUpdated?.toDate() || new Date();

        data[stateName] = {
          state: stateName,
          waterLevel: Number(waterLevel),
          lastUpdated,
          status: getWaterStatus(Number(waterLevel)),
          location: stateData.location || stateName,
          capacity: stateData.capacity || 50000,
          currentReserve: stateData.currentReserve || Number(waterLevel) * 500,
        };
      });

      console.log("Fetched real data from Firebase DWLR_state:", data);
      setStateWaterData(data);
      return data;
    } catch (err) {
      console.error("Error fetching water data from Firebase:", err);
      setError("Failed to fetch water data from Firebase");
      // Fallback to demo data if Firebase fails
      await createInitialStateData();
      return {};
    } finally {
      setLoading(false);
    }
  };

  // Create initial state data in Firebase if none exists
  const createInitialStateData = async () => {
    try {
      console.log("Creating initial state data in Firebase...");
      const dwlrCollectionRef = collection(db, "DWLR_state");

      // Check if any data already exists
      const existingData = await getDocs(dwlrCollectionRef);
      if (!existingData.empty) {
        console.log("Data already exists, skipping creation");
        return;
      }

      const initialStates = [
        {
          name: "Maharashtra",
          waterLevel: 45,
          location: "Mumbai, Pune, Nagpur",
          capacity: 125000,
        },
        {
          name: "Uttar Pradesh",
          waterLevel: 65,
          location: "Lucknow, Kanpur",
          capacity: 145000,
        },
        {
          name: "Tamil Nadu",
          waterLevel: 25,
          location: "Chennai, Coimbatore",
          capacity: 95000,
        },
        {
          name: "Karnataka",
          waterLevel: 55,
          location: "Bangalore, Mysore",
          capacity: 78000,
        },
        {
          name: "Gujarat",
          waterLevel: 35,
          location: "Ahmedabad, Surat",
          capacity: 95000,
        },
        {
          name: "Rajasthan",
          waterLevel: 15,
          location: "Jaipur, Jodhpur",
          capacity: 72000,
        },
        {
          name: "Punjab",
          waterLevel: 80,
          location: "Chandigarh, Ludhiana",
          capacity: 48000,
        },
        {
          name: "Haryana",
          waterLevel: 75,
          location: "Chandigarh, Faridabad",
          capacity: 42000,
        },
        {
          name: "Kerala",
          waterLevel: 85,
          location: "Thiruvananthapuram, Kochi",
          capacity: 52000,
        },
        {
          name: "West Bengal",
          waterLevel: 70,
          location: "Kolkata, Durgapur",
          capacity: 85000,
        },
        {
          name: "Madhya Pradesh",
          waterLevel: 47,
          location: "Bhopal, Indore",
          capacity: 88000,
        },
        {
          name: "Bihar",
          waterLevel: 38,
          location: "Patna, Gaya",
          capacity: 82000,
        },
        {
          name: "Andhra Pradesh",
          waterLevel: 42,
          location: "Visakhapatnam, Vijayawada",
          capacity: 75000,
        },
        {
          name: "Telangana",
          waterLevel: 39,
          location: "Hyderabad, Warangal",
          capacity: 68000,
        },
        {
          name: "Assam",
          waterLevel: 76,
          location: "Guwahati, Silchar",
          capacity: 55000,
        },
        {
          name: "Odisha",
          waterLevel: 51,
          location: "Bhubaneswar, Cuttack",
          capacity: 65000,
        },
        {
          name: "Jharkhand",
          waterLevel: 28,
          location: "Ranchi, Jamshedpur",
          capacity: 58000,
        },
        {
          name: "Himachal Pradesh",
          waterLevel: 92,
          location: "Shimla, Dharamshala",
          capacity: 38000,
        },
        {
          name: "Uttarakhand",
          waterLevel: 87,
          location: "Dehradun, Haridwar",
          capacity: 42000,
        },
        {
          name: "Chhattisgarh",
          waterLevel: 52,
          location: "Raipur, Bilaspur",
          capacity: 48000,
        },
        {
          name: "Goa",
          waterLevel: 78,
          location: "Panaji, Margao",
          capacity: 15000,
        },
        {
          name: "Delhi",
          waterLevel: 33,
          location: "New Delhi, Dwarka",
          capacity: 35000,
        },
      ];

      // Create documents for each state
      for (const state of initialStates) {
        const stateDocRef = doc(db, "DWLR_state", state.name);
        await setDoc(stateDocRef, {
          state: state.name,
          waterLevel: state.waterLevel,
          status: getWaterStatus(state.waterLevel),
          location: state.location,
          capacity: state.capacity,
          currentReserve: state.waterLevel * (state.capacity / 100),
          lastUpdated: new Date(),
          totalUsers: 0,
          users: [],
          lastUserActivity: new Date(),
        });
      }

      console.log("Initial state data created successfully");
    } catch (error) {
      console.error("Error creating initial state data:", error);
    }
  };

  // Update state data (admin only)
  const updateStateData = async (
    stateName: string,
    data: Partial<WaterData>
  ): Promise<void> => {
    if (!isAdmin) {
      throw new Error("Only admins can update state data");
    }

    try {
      const stateDocRef = doc(db, "DWLR_state", stateName);

      const updateData = {
        ...data,
        lastUpdated: new Date(),
        status: data.waterLevel ? getWaterStatus(data.waterLevel) : undefined,
      };

      // Remove undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, value]) => value !== undefined)
      );

      await updateDoc(stateDocRef, cleanedData);

      // Update local state
      setStateWaterData((prev) => ({
        ...prev,
        [stateName]: {
          ...prev[stateName],
          ...cleanedData,
        } as WaterData,
      }));
    } catch (err) {
      console.error("Error updating state data:", err);
      throw new Error("Failed to update state data");
    }
  };

  // Refresh data
  const refreshData = async (): Promise<void> => {
    await getAllStatesData();
  };

  // Load data on mount
  useEffect(() => {
    // Load real data from Firebase on component mount
    getAllStatesData();
  }, []);

  // Auto-refresh data every 5 minutes to keep it current
  useEffect(() => {
    const interval = setInterval(() => {
      getAllStatesData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const value: WaterDataContextType = {
    stateWaterData,
    loading,
    error,
    getUserStateData,
    getAllStatesData,
    updateStateData,
    refreshData,
  };

  return (
    <WaterDataContext.Provider value={value}>
      {children}
    </WaterDataContext.Provider>
  );
};
