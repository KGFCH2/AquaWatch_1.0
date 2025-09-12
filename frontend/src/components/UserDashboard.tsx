import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useWaterData } from "../contexts/WaterDataContext";
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
  Waves,
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

  useEffect(() => {
    if (userData && userData.role === "user") {
      // Get water data for user's state
      const stateData = getUserStateData();

      if (stateData) {
        // Create user state data from the context data
        setUserStateData({
          state: userData.state,
          currentLevel: stateData.waterLevel,
          status: stateData.status,
          trend:
            stateData.waterLevel > 60
              ? "stable"
              : stateData.waterLevel > 40
              ? "decreasing"
              : "decreasing",
          lastUpdated: stateData.lastUpdated,
          historicalData: [
            { month: "Jan", level: Math.min(stateData.waterLevel + 15, 100) },
            { month: "Feb", level: Math.min(stateData.waterLevel + 10, 100) },
            { month: "Mar", level: Math.min(stateData.waterLevel + 5, 100) },
            { month: "Apr", level: Math.min(stateData.waterLevel + 2, 100) },
            { month: "May", level: stateData.waterLevel },
          ],
        });
      } else {
        // If no specific data found, check if state exists in stateWaterData
        const stateKey = userData.state.toLowerCase().replace(/\s+/g, "");
        const fallbackData = stateWaterData[stateKey];

        if (fallbackData) {
          setUserStateData({
            state: userData.state,
            currentLevel: fallbackData.waterLevel,
            status: fallbackData.status,
            trend:
              fallbackData.waterLevel > 60
                ? "stable"
                : fallbackData.waterLevel > 40
                ? "decreasing"
                : "decreasing",
            lastUpdated: fallbackData.lastUpdated,
            historicalData: [
              {
                month: "Jan",
                level: Math.min(fallbackData.waterLevel + 15, 100),
              },
              {
                month: "Feb",
                level: Math.min(fallbackData.waterLevel + 10, 100),
              },
              {
                month: "Mar",
                level: Math.min(fallbackData.waterLevel + 5, 100),
              },
              {
                month: "Apr",
                level: Math.min(fallbackData.waterLevel + 2, 100),
              },
              { month: "May", level: fallbackData.waterLevel },
            ],
          });
        }
      }
    }
  }, [userData, stateWaterData, getUserStateData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "normal":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "good":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <TrendingDown className="h-5 w-5 text-orange-500" />;
      case "normal":
        return <Droplets className="h-5 w-5 text-green-500" />;
      case "good":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "decreasing":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Activity className="h-5 w-5 text-blue-500" />;
    }
  };

  if (authLoading || waterLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Waves className="h-12 w-12 text-water-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading water data...
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No user data available. Please log in.
          </p>
        </div>
      </div>
    );
  }

  if (userData.role !== "user") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            Access denied. User dashboard only.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Current role: {userData.role}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-water-500 to-water-600 dark:from-water-600 dark:to-water-700 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome to AquaWatch Dashboard
            </h1>
            <p className="text-water-100 flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5" />
              Monitoring water levels in {userData.state}
            </p>
            <p className="text-water-200 text-sm mt-1">
              Your personalized water crisis monitoring dashboard for{" "}
              {userData.state}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-water-200">Last Updated</p>
            <p className="text-lg font-semibold">
              {userStateData?.lastUpdated?.toLocaleTimeString() || "N/A"}
            </p>
            <p className="text-xs text-water-300">
              {userStateData?.lastUpdated?.toLocaleDateString() || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* State Overview */}
      {userStateData ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Droplets className="h-7 w-7 text-water-500" />
              {userStateData.state} Water Crisis Status
            </h2>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                {getTrendIcon(userStateData.trend)}
                <span className="capitalize font-medium">
                  {userStateData.trend} Trend
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Current Level: {userStateData.currentLevel}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg border ${getStatusColor(
                userStateData.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Current Status</p>
                  <p className="text-2xl font-bold capitalize">
                    {userStateData.status}
                  </p>
                </div>
                {getStatusIcon(userStateData.status)}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Water Level
                  </p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {userStateData.currentLevel}%
                  </p>
                </div>
                <Droplets className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Trend
                  </p>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300 capitalize">
                    {userStateData.trend}
                  </p>
                </div>
                {getTrendIcon(userStateData.trend)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {userStateData.state} Water Level Progress
              </h3>
              <span className="text-2xl font-bold text-water-600 dark:text-water-400">
                {userStateData.currentLevel}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  userStateData.currentLevel < 30
                    ? "bg-red-500"
                    : userStateData.currentLevel < 50
                    ? "bg-orange-500"
                    : userStateData.currentLevel < 80
                    ? "bg-green-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${userStateData.currentLevel}%` }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-center py-8">
            <Droplets className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Data Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Water level data for {userData.state} is currently unavailable.
            </p>
          </div>
        </div>
      )}

      {/* User's State Detailed Information */}
      {userStateData && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <MapPin className="h-7 w-7 text-water-500" />
              {userStateData.state} Water Status
            </h2>
            <div className="flex items-center gap-3">
              {getTrendIcon(userStateData.trend)}
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  userStateData.status
                )}`}
              >
                {userStateData.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Level */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Current Water Level
                </h3>
                <span className="text-3xl font-bold text-water-600 dark:text-water-400">
                  {userStateData.currentLevel}%
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                <div
                  className={`h-6 rounded-full transition-all duration-500 ${
                    userStateData.status === "critical"
                      ? "bg-red-500"
                      : userStateData.status === "warning"
                      ? "bg-orange-500"
                      : userStateData.status === "normal"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${userStateData.currentLevel}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Last Updated
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {userStateData.lastUpdated.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Trend
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                    {userStateData.trend}
                  </p>
                </div>
              </div>
            </div>

            {/* Historical Trend */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                5-Month Trend Analysis
              </h3>
              <div className="space-y-3">
                {userStateData.historicalData.map((data, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                      {data.month}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-water-500 transition-all duration-300"
                          style={{ width: `${data.level}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">
                      {data.level}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* State-specific Alert/Information */}
          <div className="mt-6 p-4 rounded-lg border">
            <div
              className={`${getStatusColor(
                userStateData.status
              )} p-4 rounded-lg border`}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(userStateData.status)}
                <div>
                  <h4 className="font-semibold mb-2">
                    {userStateData.status === "critical"
                      ? "🚨 Critical Water Alert"
                      : userStateData.status === "warning"
                      ? "⚠️ Water Conservation Notice"
                      : userStateData.status === "normal"
                      ? "ℹ️ Normal Water Levels"
                      : "✅ Good Water Levels"}
                  </h4>
                  <p className="text-sm">
                    {userStateData.status === "critical"
                      ? `Water levels in ${userStateData.state} are critically low (${userStateData.currentLevel}%). Immediate conservation measures and emergency protocols are in effect.`
                      : userStateData.status === "warning"
                      ? `Water levels in ${userStateData.state} are below normal (${userStateData.currentLevel}%). Please practice water conservation measures.`
                      : userStateData.status === "normal"
                      ? `Water levels in ${userStateData.state} are currently normal (${userStateData.currentLevel}%). Continue monitoring and moderate usage.`
                      : `Water levels in ${userStateData.state} are good (${userStateData.currentLevel}%). No immediate concerns, but continue responsible usage.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() =>
            window.dispatchEvent(new Event("showEmergencyResponse"))
          }
          className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
        >
          <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
          <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
            Emergency Response
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300">
            Get immediate help and emergency contacts
          </p>
        </button>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("showEmergencyContacts", {
                detail: { state: userData.state },
              })
            )
          }
          className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
        >
          <Users className="h-8 w-8 text-blue-500 mb-3" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            {userData.state} Contacts
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-300">
            Local emergency contacts and authorities
          </p>
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("showDataMethodology"))}
          className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        >
          <Info className="h-8 w-8 text-green-500 mb-3" />
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
            Learn More
          </h3>
          <p className="text-sm text-green-600 dark:text-green-300">
            Data sources and methodology
          </p>
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
