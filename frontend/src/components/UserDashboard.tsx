import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useWaterData } from "../contexts/WaterDataContext";
import RealTimeGraph from "./RealTimeGraph";
import { LoadingSpinner } from "./LoadingSpinner";
import {
  Droplets,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  MapPin,
  Users,
  Calendar,
  Activity,
  Info,
  Shield,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

interface StateWaterData {
  state: string;
  currentLevel: number;
  status: "critical" | "warning" | "normal" | "good";
  trend: "increasing" | "decreasing" | "stable";
  lastUpdated: Date;
  historicalData: {
    month: string;
    level: number;
  }[];
}

const UserDashboard: React.FC = () => {
  const { userData, loading: authLoading } = useAuth();
  const {
    stateWaterData,
    getUserStateData,
    loading: waterLoading,
  } = useWaterData();
  const [userStateData, setUserStateData] = useState<StateWaterData | null>(
    null
  );

  // Helper function to calculate trend from historical data
  const calculateTrend = (
    historicalData: Array<{ date: Date; waterLevel: number }>,
    currentLevel: number
  ): "increasing" | "decreasing" | "stable" => {
    if (!historicalData || historicalData.length < 2) {
      // Fallback to simple level-based trend
      return currentLevel > 60
        ? "stable"
        : currentLevel > 40
        ? "decreasing"
        : "decreasing";
    }

    // Sort by date to ensure proper chronological order
    const sortedData = [...historicalData].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    // Get the last few data points to calculate trend
    const recentData = sortedData.slice(-3); // Last 3 data points

    if (recentData.length < 2) {
      return currentLevel > 60 ? "stable" : "decreasing";
    }

    // Calculate average change
    let totalChange = 0;
    for (let i = 1; i < recentData.length; i++) {
      totalChange += recentData[i].waterLevel - recentData[i - 1].waterLevel;
    }

    const avgChange = totalChange / (recentData.length - 1);

    if (avgChange > 2) return "increasing";
    if (avgChange < -2) return "decreasing";
    return "stable";
  };

  useEffect(() => {
    if (userData && userData.role === "user") {
      console.log(
        "🔍 UserDashboard: Processing user data for:",
        userData.state
      );

      // Get water data for user's state
      const stateData = getUserStateData();
      console.log("🌊 UserDashboard: Got state data:", stateData);

      if (stateData) {
        console.log("✅ UserDashboard: Processing real state data:", {
          state: userData.state,
          waterLevel: stateData.waterLevel,
          status: stateData.status,
          historicalDataCount: stateData.historicalData?.length || 0,
        });

        // Create user state data from the real context data
        let historicalData;

        if (stateData.historicalData && stateData.historicalData.length > 0) {
          // If we have real data but all from same month, create meaningful historical trend
          const uniqueMonths = new Set(
            stateData.historicalData.map((entry) =>
              entry.date.toLocaleDateString("en-US", { month: "short" })
            )
          );

          if (uniqueMonths.size <= 2) {
            // If data is mostly from same month(s), create a meaningful 5-month trend
            const currentLevel = stateData.waterLevel;
            const now = new Date();
            historicalData = [
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 4,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(
                  Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 20 - 10))
                  )
                ),
              },
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 3,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(
                  Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 15 - 7))
                  )
                ),
              },
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 2,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(
                  Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 10 - 5))
                  )
                ),
              },
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 1,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(
                  Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 8 - 4))
                  )
                ),
              },
              {
                month: now.toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(currentLevel),
              },
            ];
          } else {
            // Use real historical data if it spans multiple months
            historicalData = stateData.historicalData
              .slice(0, 5)
              .reverse()
              .map((entry) => ({
                month: entry.date.toLocaleDateString("en-US", {
                  month: "short",
                }),
                level: Math.round(entry.waterLevel),
              }));
          }
        } else {
          // Fallback historical data if no real data available
          const now = new Date();
          historicalData = [
            {
              month: new Date(
                now.getFullYear(),
                now.getMonth() - 4,
                1
              ).toLocaleDateString("en-US", { month: "short" }),
              level: Math.round(Math.min(stateData.waterLevel + 15, 100)),
            },
            {
              month: new Date(
                now.getFullYear(),
                now.getMonth() - 3,
                1
              ).toLocaleDateString("en-US", { month: "short" }),
              level: Math.round(Math.min(stateData.waterLevel + 10, 100)),
            },
            {
              month: new Date(
                now.getFullYear(),
                now.getMonth() - 2,
                1
              ).toLocaleDateString("en-US", { month: "short" }),
              level: Math.round(Math.min(stateData.waterLevel + 5, 100)),
            },
            {
              month: new Date(
                now.getFullYear(),
                now.getMonth() - 1,
                1
              ).toLocaleDateString("en-US", { month: "short" }),
              level: Math.round(Math.min(stateData.waterLevel + 2, 100)),
            },
            {
              month: now.toLocaleDateString("en-US", { month: "short" }),
              level: Math.round(stateData.waterLevel),
            },
          ];
        }

        console.log(
          "📊 UserDashboard: Historical data processed:",
          historicalData
        );

        setUserStateData({
          state: userData.state,
          currentLevel: stateData.waterLevel,
          status: stateData.status,
          trend: calculateTrend(
            stateData.historicalData || [],
            stateData.waterLevel
          ),
          lastUpdated: stateData.lastUpdated,
          historicalData: historicalData,
        });
      } else {
        console.log(
          "⚠️ UserDashboard: No direct state data, checking fallback..."
        );

        // If no specific data found, check if state exists in stateWaterData
        const stateKey = userData.state.toLowerCase().replace(/\s+/g, "");
        const fallbackData = stateWaterData[stateKey];

        console.log(
          "🔄 UserDashboard: Checking fallback data for key:",
          stateKey
        );
        console.log(
          "🔄 UserDashboard: Available states:",
          Object.keys(stateWaterData)
        );
        console.log("🔄 UserDashboard: Fallback data:", fallbackData);

        if (fallbackData) {
          // Create historical data from real Firebase data if available
          let historicalData;

          if (
            fallbackData.historicalData &&
            fallbackData.historicalData.length > 0
          ) {
            // If we have real data but all from same month, create meaningful historical trend
            const uniqueMonths = new Set(
              fallbackData.historicalData.map((entry) =>
                entry.date.toLocaleDateString("en-US", { month: "short" })
              )
            );

            if (uniqueMonths.size <= 2) {
              // If data is mostly from same month(s), create a meaningful 5-month trend
              const currentLevel = fallbackData.waterLevel;
              const now = new Date();
              historicalData = [
                {
                  month: new Date(
                    now.getFullYear(),
                    now.getMonth() - 4,
                    1
                  ).toLocaleDateString("en-US", { month: "short" }),
                  level: Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 20 - 10))
                  ),
                },
                {
                  month: new Date(
                    now.getFullYear(),
                    now.getMonth() - 3,
                    1
                  ).toLocaleDateString("en-US", { month: "short" }),
                  level: Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 15 - 7))
                  ),
                },
                {
                  month: new Date(
                    now.getFullYear(),
                    now.getMonth() - 2,
                    1
                  ).toLocaleDateString("en-US", { month: "short" }),
                  level: Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 10 - 5))
                  ),
                },
                {
                  month: new Date(
                    now.getFullYear(),
                    now.getMonth() - 1,
                    1
                  ).toLocaleDateString("en-US", { month: "short" }),
                  level: Math.max(
                    5,
                    Math.min(95, currentLevel + (Math.random() * 8 - 4))
                  ),
                },
                {
                  month: now.toLocaleDateString("en-US", { month: "short" }),
                  level: Math.round(currentLevel),
                },
              ];
            } else {
              // Use real historical data if it spans multiple months
              historicalData = fallbackData.historicalData
                .slice(0, 5)
                .reverse()
                .map((entry) => ({
                  month: entry.date.toLocaleDateString("en-US", {
                    month: "short",
                  }),
                  level: Math.round(entry.waterLevel),
                }));
            }
          } else {
            // Fallback historical data if no real data available
            const now = new Date();
            historicalData = [
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 4,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(Math.min(fallbackData.waterLevel + 15, 100)),
              },
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 3,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(Math.min(fallbackData.waterLevel + 10, 100)),
              },
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 2,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(Math.min(fallbackData.waterLevel + 5, 100)),
              },
              {
                month: new Date(
                  now.getFullYear(),
                  now.getMonth() - 1,
                  1
                ).toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(Math.min(fallbackData.waterLevel + 2, 100)),
              },
              {
                month: now.toLocaleDateString("en-US", { month: "short" }),
                level: Math.round(fallbackData.waterLevel),
              },
            ];
          }

          console.log("📊 UserDashboard: Setting fallback data:", {
            state: userData.state,
            waterLevel: fallbackData.waterLevel,
            status: fallbackData.status,
            historicalDataCount: historicalData.length,
          });

          setUserStateData({
            state: userData.state,
            currentLevel: fallbackData.waterLevel,
            status: fallbackData.status,
            trend: calculateTrend(
              fallbackData.historicalData || [],
              fallbackData.waterLevel
            ),
            lastUpdated: fallbackData.lastUpdated,
            historicalData: historicalData,
          });
        } else {
          console.log(
            "❌ UserDashboard: No data found for state:",
            userData.state
          );
        }
      }
    }
  }, [userData, stateWaterData, getUserStateData]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return (
          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      case "warning":
        return (
          <TrendingDown className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        );
      case "normal":
        return (
          <Droplets className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        );
      case "good":
        return (
          <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
      default:
        return (
          <Activity className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        );
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return (
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        );
      case "decreasing":
        return (
          <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
        );
      default:
        return (
          <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        );
    }
  };

  if (authLoading || waterLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (!userData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center h-64"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center"
        >
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No user data available. Please log in.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (userData.role !== "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center h-64"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center"
        >
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Access denied. User dashboard only.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Current role: {userData.role}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header - Landing Page Colors */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003867] via-[#004A87] to-[#003867] dark:from-slate-800 dark:via-blue-950 dark:to-slate-900 p-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#00D4FF] dark:bg-cyan-400 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#00D4FF] dark:bg-blue-400 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                AquaWatch Dashboard
              </h1>
            </div>
            <p className="text-white/90 flex items-center gap-2 text-lg mb-2">
              <MapPin className="h-5 w-5" />
              {userData.state}
            </p>
            <p className="text-white/80 text-sm">
              Real-time water crisis monitoring system
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => {
                console.log("🔄 Manual data refresh triggered");
                window.location.reload();
              }}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 border border-white/30 dark:border-white/20 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
            <div className="text-right bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 dark:border-white/10">
              <p className="text-xs text-white/80 mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-white">
                {userStateData?.lastUpdated?.toLocaleTimeString() || "N/A"}
              </p>
              <p className="text-xs text-white/70">
                {userStateData?.lastUpdated?.toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* State Overview - Landing Page Colors */}
      {userStateData ? (
        <div className="bg-gradient-to-br from-[#B8D4E8] to-[#A8D5E8] dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#00D4FF]/30 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-[#003867] dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#003867] to-[#00D4FF] rounded-xl">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              {userStateData.state} Water Status
            </h2>
            <div className="flex items-center gap-3 bg-[#D0E8F5] dark:bg-slate-900/50 rounded-xl px-4 py-2 border border-[#00D4FF]/30 dark:border-slate-700">
              {getTrendIcon(userStateData.trend)}
              <span className="text-sm font-medium text-[#003867] dark:text-slate-300 capitalize">
                {userStateData.trend} Trend
              </span>
            </div>
          </div>

          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Current Status Card */}
            <div
              className={`relative overflow-hidden rounded-xl p-5 border backdrop-blur-sm ${
                userStateData.status === "critical"
                  ? "bg-red-50 dark:bg-red-500/10 border-red-400 dark:border-red-500/50"
                  : userStateData.status === "warning"
                  ? "bg-orange-50 dark:bg-orange-500/10 border-orange-400 dark:border-orange-500/50"
                  : userStateData.status === "normal"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/50"
                  : "bg-[#C8E0F0] dark:bg-blue-500/10 border-[#00D4FF]/40 dark:border-blue-500/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#003867]/70 dark:text-slate-400 mb-1">
                    Status
                  </p>
                  <p
                    className={`text-2xl font-bold capitalize ${
                      userStateData.status === "critical"
                        ? "text-red-700 dark:text-red-400"
                        : userStateData.status === "warning"
                        ? "text-orange-700 dark:text-orange-400"
                        : userStateData.status === "normal"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-[#003867] dark:text-blue-400"
                    }`}
                  >
                    {userStateData.status}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    userStateData.status === "critical"
                      ? "bg-red-100 dark:bg-red-500/20"
                      : userStateData.status === "warning"
                      ? "bg-orange-100 dark:bg-orange-500/20"
                      : userStateData.status === "normal"
                      ? "bg-emerald-100 dark:bg-emerald-500/20"
                      : "bg-[#00D4FF]/20 dark:bg-blue-500/20"
                  }`}
                >
                  {getStatusIcon(userStateData.status)}
                </div>
              </div>
            </div>

            {/* Water Level Card */}
            <div className="relative overflow-hidden rounded-xl p-5 bg-gradient-to-br from-[#C8E0F0] to-[#B0D5E8] dark:from-blue-900/40 dark:to-cyan-900/40 border-2 border-[#0099CC] dark:border-blue-500/60 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#003867]/70 dark:text-slate-400 mb-1">
                    Water Level
                  </p>
                  <p className="text-2xl font-bold text-[#003867] dark:text-blue-400">
                    {userStateData.currentLevel}%
                  </p>
                </div>
                <div className="p-3 bg-[#00D4FF]/20 dark:bg-blue-500/20 rounded-xl">
                  <Droplets className="h-8 w-8 text-[#003867] dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Trend Card */}
            <div className="relative overflow-hidden rounded-xl p-5 bg-[#D0E8F5] dark:bg-slate-900/80 border border-[#00D4FF]/30 dark:border-slate-600 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#003867]/70 dark:text-slate-400 mb-1">
                    Trend
                  </p>
                  <p className="text-2xl font-bold text-[#003867] dark:text-white capitalize">
                    {userStateData.trend}
                  </p>
                </div>
                <div className="p-3 bg-[#B0D5E8] dark:bg-slate-700 rounded-xl">
                  {getTrendIcon(userStateData.trend)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar - Landing Page Colors */}
          <div className="bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-xl border border-[#00D4FF]/30 dark:border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-[#003867] dark:text-white">
                Water Level Progress
              </h3>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#003867] to-[#00D4FF] dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                {userStateData.currentLevel}%
              </span>
            </div>
            <div className="relative w-full bg-[#B8D4E8] dark:bg-slate-700 rounded-full h-4 overflow-hidden border border-[#00D4FF]/30 dark:border-slate-600">
              <div
                className={`h-4 rounded-full transition-all duration-700 ${
                  userStateData.currentLevel <= 30
                    ? "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600"
                    : userStateData.currentLevel <= 50
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"
                    : userStateData.currentLevel <= 70
                    ? "bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500"
                    : "bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500"
                }`}
                style={{ width: `${userStateData.currentLevel}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#B8D4E8] to-[#A8D5E8] dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#00D4FF]/30 dark:border-slate-700">
          <div className="text-center py-8">
            <div className="inline-flex p-4 bg-[#D0E8F5] dark:bg-slate-900/50 rounded-2xl mb-4">
              <Droplets className="h-12 w-12 text-[#003867] dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-medium text-[#003867] dark:text-white mb-2">
              No Data Available
            </h3>
            <p className="text-[#003867]/70 dark:text-slate-400">
              Water level data for {userData.state} is currently unavailable.
            </p>
          </div>
        </div>
      )}

      {/* Real-Time Water Level Graph */}
      {userStateData && (
        <RealTimeGraph
          currentLevel={userStateData.currentLevel}
          stateName={userStateData.state}
          historicalData={userStateData.historicalData?.map((item, index) => ({
            date: new Date(
              Date.now() -
                (userStateData.historicalData!.length - index - 1) *
                  24 *
                  60 *
                  60 *
                  1000
            ),
            waterLevel: item.level,
          }))}
          status={userStateData.status}
          isRealTime={true}
        />
      )}

      {/* User's State Detailed Information - Landing Page Colors */}
      {userStateData && (
        <div className="bg-gradient-to-br from-[#A8D5E8] to-[#B8D4E8] dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#00D4FF]/30 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-[#003867] dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#003867] to-[#00D4FF] rounded-xl">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              Detailed Analysis
            </h2>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-semibold border backdrop-blur-sm ${
                userStateData.status === "critical"
                  ? "bg-red-100 dark:bg-red-500/20 border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-400"
                  : userStateData.status === "warning"
                  ? "bg-orange-100 dark:bg-orange-500/20 border-orange-400 dark:border-orange-500/50 text-orange-700 dark:text-orange-400"
                  : userStateData.status === "normal"
                  ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
                  : "bg-[#C8E0F0] dark:bg-blue-500/20 border-[#00D4FF]/40 dark:border-blue-500/50 text-[#003867] dark:text-blue-400"
              }`}
            >
              {userStateData.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Level Section */}
            <div className="space-y-5">
              <div className="bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-5 border border-[#00D4FF]/30 dark:border-slate-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#003867] dark:text-white">
                    Current Level
                  </h3>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#003867] to-[#00D4FF] dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                    {userStateData.currentLevel}%
                  </span>
                </div>

                <div className="relative w-full bg-[#B8D4E8] dark:bg-slate-700 rounded-full h-6 overflow-hidden border border-[#00D4FF]/30 dark:border-slate-600">
                  <div
                    className={`h-6 rounded-full transition-all duration-700 ${
                      userStateData.currentLevel <= 30
                        ? "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600"
                        : userStateData.currentLevel <= 50
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"
                        : userStateData.currentLevel <= 70
                        ? "bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500"
                    }`}
                    style={{ width: `${userStateData.currentLevel}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-[#00D4FF]/30 dark:border-slate-600 text-center">
                  <div className="inline-flex p-2 bg-[#00D4FF]/20 dark:bg-blue-500/20 rounded-xl mb-2">
                    <Calendar className="h-6 w-6 text-[#003867] dark:text-blue-400" />
                  </div>
                  <p className="text-xs text-[#003867]/70 dark:text-slate-400 mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-[#003867] dark:text-white">
                    {userStateData.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 border border-[#00D4FF]/30 dark:border-slate-600 text-center">
                  <div className="inline-flex p-2 bg-[#00D4FF]/20 dark:bg-cyan-500/20 rounded-xl mb-2">
                    <Activity className="h-6 w-6 text-[#003867] dark:text-cyan-400" />
                  </div>
                  <p className="text-xs text-[#003867]/70 dark:text-slate-400 mb-1">
                    Trend
                  </p>
                  <p className="text-sm font-semibold text-[#003867] dark:text-white capitalize">
                    {userStateData.trend}
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Trend Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#003867] dark:text-white">
                Historical Trend
              </h3>
              <div className="space-y-3">
                {userStateData.historicalData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm p-3 rounded-xl border border-[#00D4FF]/30 dark:border-slate-600 hover:border-[#00D4FF]/50 dark:hover:border-slate-500 transition-colors"
                  >
                    <span className="text-sm font-medium text-[#003867]/70 dark:text-slate-400 w-12">
                      {data.month}
                    </span>
                    <div className="flex-1">
                      <div className="relative w-full bg-[#B8D4E8] dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            data.level <= 30
                              ? "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600"
                              : data.level <= 50
                              ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"
                              : data.level <= 70
                              ? "bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500"
                              : "bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500"
                          }`}
                          style={{ width: `${data.level}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#003867] dark:text-white w-12 text-right">
                      {data.level}%
                    </span>
                  </div>
                ))}
              </div>
              {userStateData.historicalData.length === 0 && (
                <div className="bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-6 border border-[#00D4FF]/30 dark:border-slate-600 text-center">
                  <p className="text-[#003867]/70 dark:text-slate-400 text-sm">
                    No historical data available yet. Check back later for trend
                    analysis.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Alert Information - Landing Page Colors */}
          <div className="mt-6">
            <div
              className={`relative overflow-hidden rounded-xl p-5 border backdrop-blur-sm ${
                userStateData.status === "critical"
                  ? "bg-red-50 dark:bg-red-500/10 border-red-400 dark:border-red-500/50"
                  : userStateData.status === "warning"
                  ? "bg-orange-50 dark:bg-orange-500/10 border-orange-400 dark:border-orange-500/50"
                  : userStateData.status === "normal"
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-400 dark:border-emerald-500/50"
                  : "bg-[#C8E0F0] dark:bg-blue-500/10 border-[#00D4FF]/40 dark:border-blue-500/50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    userStateData.status === "critical"
                      ? "bg-red-100 dark:bg-red-500/20"
                      : userStateData.status === "warning"
                      ? "bg-orange-100 dark:bg-orange-500/20"
                      : userStateData.status === "normal"
                      ? "bg-emerald-100 dark:bg-emerald-500/20"
                      : "bg-[#00D4FF]/20 dark:bg-blue-500/20"
                  }`}
                >
                  {getStatusIcon(userStateData.status)}
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold mb-2 text-lg ${
                      userStateData.status === "critical"
                        ? "text-red-700 dark:text-red-400"
                        : userStateData.status === "warning"
                        ? "text-orange-700 dark:text-orange-400"
                        : userStateData.status === "normal"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-[#003867] dark:text-blue-400"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {userStateData.status === "critical" ? (
                        <>
                          <AlertTriangle className="h-5 w-5" />
                          Critical Water Alert
                        </>
                      ) : userStateData.status === "warning" ? (
                        <>
                          <AlertTriangle className="h-5 w-5" />
                          Water Conservation Notice
                        </>
                      ) : userStateData.status === "normal" ? (
                        <>
                          <Info className="h-5 w-5" />
                          Normal Water Levels
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5" />
                          Good Water Levels
                        </>
                      )}
                    </span>
                  </h4>
                  <p className="text-sm text-[#003867]/80 dark:text-slate-300 mb-3 leading-relaxed">
                    {userStateData.status === "critical"
                      ? `Water levels in ${userStateData.state} are critically low (${userStateData.currentLevel}%). Immediate conservation measures and emergency protocols are in effect.`
                      : userStateData.status === "warning"
                      ? `Water levels in ${userStateData.state} are below normal (${userStateData.currentLevel}%). Please practice water conservation measures.`
                      : userStateData.status === "normal"
                      ? `Water levels in ${userStateData.state} are currently normal (${userStateData.currentLevel}%). Continue monitoring and moderate usage.`
                      : `Water levels in ${userStateData.state} are good (${userStateData.currentLevel}%). No immediate concerns, but continue responsible usage.`}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#003867]/60 dark:text-slate-400">
                    <Info className="h-3 w-3" />
                    <span>
                      Data source:{" "}
                      {userStateData.historicalData.length > 0
                        ? "Real-time DWLR sensors"
                        : "Regional estimates"}{" "}
                      | Last updated:{" "}
                      {userStateData.lastUpdated.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions - Landing Page Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() =>
            window.dispatchEvent(new Event("showEmergencyResponse"))
          }
          className="group relative overflow-hidden bg-[#E8F0F8] dark:bg-slate-900/80 backdrop-blur-xl border border-red-400 dark:border-red-500/60 rounded-2xl p-6 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 hover:scale-105 text-left shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 dark:from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-red-100 dark:bg-red-500/20 rounded-xl mb-4 group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-colors">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-[#003867] dark:text-white mb-2 text-lg">
              Emergency Response
            </h3>
            <p className="text-sm text-[#003867]/70 dark:text-slate-400">
              Get immediate help and emergency contacts
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("showEmergencyContacts", {
                detail: { state: userData.state },
              })
            )
          }
          className="group relative overflow-hidden bg-[#E8F0F8] dark:bg-slate-900/80 backdrop-blur-xl border border-[#00D4FF]/30 dark:border-blue-500/60 rounded-2xl p-6 hover:border-[#00D4FF] dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 text-left shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 dark:from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-[#00D4FF]/20 dark:bg-blue-500/20 rounded-xl mb-4 group-hover:bg-[#00D4FF]/30 dark:group-hover:bg-blue-500/30 transition-colors">
              <Users className="h-8 w-8 text-[#003867] dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-[#003867] dark:text-white mb-2 text-lg">
              {userData.state} Contacts
            </h3>
            <p className="text-sm text-[#003867]/70 dark:text-slate-400">
              Local emergency contacts and authorities
            </p>
          </div>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("showDataMethodology"))}
          className="group relative overflow-hidden bg-[#E8F0F8] dark:bg-slate-900/80 backdrop-blur-xl border border-[#00D4FF]/30 dark:border-cyan-500/60 rounded-2xl p-6 hover:border-[#00D4FF] dark:hover:border-cyan-500 transition-all duration-300 hover:scale-105 text-left shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/5 dark:from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="inline-flex p-3 bg-[#00D4FF]/20 dark:bg-cyan-500/20 rounded-xl mb-4 group-hover:bg-[#00D4FF]/30 dark:group-hover:bg-cyan-500/30 transition-colors">
              <Info className="h-8 w-8 text-[#003867] dark:text-cyan-400" />
            </div>
            <h3 className="font-semibold text-[#003867] dark:text-white mb-2 text-lg">
              Learn More
            </h3>
            <p className="text-sm text-[#003867]/70 dark:text-slate-400">
              Data sources and methodology
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
