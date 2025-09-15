import React, { useState, useEffect, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import {
  Droplets,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Clock,
  Waves,
} from "lucide-react";

interface WaterDataPoint {
  time: string;
  waterLevel: number;
  timestamp: number;
  status: "critical" | "warning" | "normal" | "good";
}

interface RealTimeGraphProps {
  currentLevel: number;
  stateName: string;
  historicalData?: Array<{
    date: Date;
    waterLevel: number;
  }>;
  status: "critical" | "warning" | "normal" | "good";
  isRealTime?: boolean;
}

const RealTimeGraph: React.FC<RealTimeGraphProps> = ({
  currentLevel,
  stateName,
  historicalData = [],
  status,
  isRealTime = true,
}) => {
  const [graphData, setGraphData] = useState<WaterDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  // Color schemes based on water level status
  const getStatusColors = (status: string) => {
    switch (status) {
      case "critical":
        return {
          primary: "#dc2626",
          secondary: "#fca5a5",
          background: "rgba(220, 38, 38, 0.1)",
          gradient: ["#dc2626", "#ef4444"],
        };
      case "warning":
        return {
          primary: "#d97706",
          secondary: "#fcd34d",
          background: "rgba(217, 119, 6, 0.1)",
          gradient: ["#d97706", "#f59e0b"],
        };
      case "normal":
        return {
          primary: "#059669",
          secondary: "#6ee7b7",
          background: "rgba(5, 150, 105, 0.1)",
          gradient: ["#059669", "#10b981"],
        };
      case "good":
        return {
          primary: "#2563eb",
          secondary: "#93c5fd",
          background: "rgba(37, 99, 235, 0.1)",
          gradient: ["#2563eb", "#3b82f6"],
        };
      default:
        return {
          primary: "#6b7280",
          secondary: "#d1d5db",
          background: "rgba(107, 114, 128, 0.1)",
          gradient: ["#6b7280", "#9ca3af"],
        };
    }
  };

  // Initialize graph data from historical data
  useEffect(() => {
    setIsLoading(true);

    if (historicalData && historicalData.length > 0) {
      // Convert historical data to graph format
      const formattedData = historicalData
        .slice(-24) // Last 24 data points
        .map((item) => ({
          time: item.date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          waterLevel: item.waterLevel,
          timestamp: item.date.getTime(),
          status:
            item.waterLevel < 20
              ? ("critical" as const)
              : item.waterLevel < 40
              ? ("warning" as const)
              : item.waterLevel < 70
              ? ("normal" as const)
              : ("good" as const),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setGraphData(formattedData);
    } else {
      // Generate sample real-time data if no historical data
      const now = new Date();
      const sampleData: WaterDataPoint[] = [];

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Every hour
        const variation = (Math.random() - 0.5) * 10; // ±5% variation
        const level = Math.max(0, Math.min(100, currentLevel + variation));

        sampleData.push({
          time: time.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          waterLevel: Math.round(level * 10) / 10,
          timestamp: time.getTime(),
          status:
            level < 20
              ? "critical"
              : level < 40
              ? "warning"
              : level < 70
              ? "normal"
              : "good",
        });
      }

      setGraphData(sampleData);
    }

    setIsLoading(false);
  }, [historicalData, currentLevel]);

  // Real-time updates simulation
  useEffect(() => {
    if (!isRealTime) return;

    intervalRef.current = setInterval(() => {
      setGraphData((prevData) => {
        const now = new Date();
        const variation = (Math.random() - 0.5) * 2; // ±1% variation for real-time
        const newLevel = Math.max(0, Math.min(100, currentLevel + variation));

        const newDataPoint: WaterDataPoint = {
          time: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          waterLevel: Math.round(newLevel * 10) / 10,
          timestamp: now.getTime(),
          status:
            newLevel < 20
              ? "critical"
              : newLevel < 40
              ? "warning"
              : newLevel < 70
              ? "normal"
              : "good",
        };

        // Keep only last 24 data points
        const updatedData = [...prevData.slice(-23), newDataPoint];
        setLastUpdateTime(now);
        return updatedData;
      });
    }, 30000); // Update every 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRealTime, currentLevel]);

  // Calculate trend
  const calculateTrend = () => {
    if (graphData.length < 2) return "stable";
    const recent = graphData.slice(-5);
    const firstLevel = recent[0]?.waterLevel || 0;
    const lastLevel = recent[recent.length - 1]?.waterLevel || 0;
    const change = lastLevel - firstLevel;

    if (change > 2) return "increasing";
    if (change < -2) return "decreasing";
    return "stable";
  };

  const trend = calculateTrend();
  const colors = getStatusColors(status);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Time: {label}
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            Water Level: {payload[0].value}%
          </p>
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium mt-2 ${
              data.status === "critical"
                ? "bg-red-100 text-red-800"
                : data.status === "warning"
                ? "bg-orange-100 text-orange-800"
                : data.status === "normal"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {data.status === "critical" && (
              <AlertTriangle className="h-3 w-3" />
            )}
            {data.status === "warning" && <TrendingDown className="h-3 w-3" />}
            {data.status === "normal" && <Activity className="h-3 w-3" />}
            {data.status === "good" && <TrendingUp className="h-3 w-3" />}
            {data.status.toUpperCase()}
          </div>
        </motion.div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Waves className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500 dark:text-gray-400">
              Loading real-time data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: colors.background }}
          >
            <Droplets className="h-6 w-6" style={{ color: colors.primary }} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Real-Time Water Level - {stateName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Live monitoring dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Current Level */}
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Current Level
            </p>
            <p className="text-2xl font-bold" style={{ color: colors.primary }}>
              {currentLevel}%
            </p>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center gap-2">
            {trend === "increasing" ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : trend === "decreasing" ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : (
              <Activity className="h-5 w-5 text-blue-500" />
            )}
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
              {trend}
            </span>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="mb-4">
        <div
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
            status === "critical"
              ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
              : status === "warning"
              ? "bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300"
              : status === "normal"
              ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
              : "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
          }`}
        >
          {status === "critical" && <AlertTriangle className="h-4 w-4" />}
          {status === "warning" && <TrendingDown className="h-4 w-4" />}
          {status === "normal" && <Activity className="h-4 w-4" />}
          {status === "good" && <TrendingUp className="h-4 w-4" />}
          <span className="font-medium capitalize">{status} Status</span>
          {isRealTime && (
            <div className="flex items-center gap-1 text-xs opacity-75">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              LIVE
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={graphData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorWaterLevel" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={colors.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={colors.primary}
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-gray-600"
            />
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: "#6b7280" }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: "#6b7280" }}
              label={{
                value: "Water Level (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Critical level line */}
            <ReferenceLine
              y={20}
              stroke="#dc2626"
              strokeDasharray="5 5"
              label="Critical"
            />

            {/* Warning level line */}
            <ReferenceLine
              y={40}
              stroke="#d97706"
              strokeDasharray="5 5"
              label="Warning"
            />

            {/* Normal level line */}
            <ReferenceLine
              y={70}
              stroke="#059669"
              strokeDasharray="5 5"
              label="Normal"
            />

            <Area
              type="monotone"
              dataKey="waterLevel"
              stroke={colors.primary}
              strokeWidth={3}
              fill="url(#colorWaterLevel)"
              dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: colors.primary,
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer with last update info */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdateTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Real-time monitoring active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealTimeGraph;
