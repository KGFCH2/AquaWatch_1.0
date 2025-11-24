// src/components/StateDetailsPopup.tsx

import React, { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { X } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { db } from "../firebase/config";
import {
  collection,
  query,
  limit, // REMOVED orderBy
  onSnapshot,
} from "firebase/firestore";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define a type for our state data for better TypeScript support
interface StateType {
  state: string;
  waterLevel: number;
  status: "critical" | "warning" | "normal" | "good";
}

// Define a type for the historical data points
interface HistoryPoint {
  timestamp: Date;
  level: number;
}

interface StateDetailsPopupProps {
  state: StateType;
  onClose: () => void;
}

const StateDetailsPopup: React.FC<StateDetailsPopupProps> = ({
  state,
  onClose,
}) => {
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // MODIFIED: Effect now uses your 'Date' and 'Time' fields
  useEffect(() => {
    setLoading(true);

    const historyCollectionRef = collection(
      db,
      "DWLR_state",
      state.state,
      "data"
    );

    // This query now fetches 15 documents without a specific order
    const q = query(historyCollectionRef, limit(15));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        if (querySnapshot.empty) {
          console.log("No documents found in the 'data' subcollection.");
          setLoading(false);
          return;
        }

        const data: HistoryPoint[] = [];
        querySnapshot.forEach((doc) => {
          const docData = doc.data();

          if (
            docData.Date &&
            docData.Time &&
            docData.Water_Level_m_bgl !== undefined
          ) {
            // Combine Date and Time strings to create a valid Date object
            // This assumes Date is in a format like "YYYY-MM-DD" or "MM/DD/YYYY"
            const dateTimeString = `${docData.Date} ${docData.Time}`;
            const timestamp = new Date(dateTimeString);

            // Check if the created date is valid
            if (!isNaN(timestamp.getTime())) {
              data.push({
                level: docData.Water_Level_m_bgl,
                timestamp: timestamp,
              });
            } else {
              console.warn(`Could not parse date/time: ${dateTimeString}`);
            }
          } else {
            console.warn(
              "Skipping document due to missing fields:",
              doc.id,
              docData
            );
          }
        });

        // Sort the data by the timestamp we created, newest first
        data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        setHistoryData(data); // Set the sorted data
        setLoading(false);
      },
      (error) => {
        console.error("Firebase Error:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [state.state]);

  // Effect for handling "click outside to close" (No changes below this line)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const chartData = {
    labels: historyData.map((d) =>
      d.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    ),
    datasets: [
      {
        label: "Water Level (m bgl)",
        data: historyData.map((d) => d.level),
        borderColor: "rgba(59, 130, 246, 0.8)",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Recent Updates",
        color: document.body.classList.contains("dark") ? "#FFF" : "#333",
      },
    },
    scales: {
      y: {
        ticks: {
          color: document.body.classList.contains("dark") ? "#CCC" : "#666",
        },
      },
      x: {
        ticks: {
          color: document.body.classList.contains("dark") ? "#CCC" : "#666",
        },
      },
    },
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={popupRef}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 transform transition-all duration-300 ease-in-out ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Water Level History: {state.state}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner />
            </div>
          ) : historyData.length > 0 ? (
            <Line options={chartOptions} data={chartData} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No recent data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StateDetailsPopup;
