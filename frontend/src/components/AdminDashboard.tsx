import React from "react";
import { useWaterData } from "../contexts/WaterDataContext";
import {
  Droplets,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  Shield,
  Waves,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { stateWaterData, loading, refreshData } = useWaterData();

  const handleRefreshData = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

  // Calculate national overview from all state data
  const nationalOverview = React.useMemo(() => {
    const allStates = Object.values(stateWaterData);
    const totalStates = allStates.length;

    const criticalStates = allStates.filter(
      (state) => state.status === "critical"
    ).length;
    const warningStates = allStates.filter(
      (state) => state.status === "warning"
    ).length;
    const normalStates = allStates.filter(
      (state) => state.status === "normal"
    ).length;
    const goodStates = allStates.filter(
      (state) => state.status === "good"
    ).length;

    const averageLevel =
      totalStates > 0
        ? allStates.reduce((sum, state) => sum + state.waterLevel, 0) /
          totalStates
        : 0;

    const overallTrend =
      averageLevel > 60
        ? "stable"
        : averageLevel > 40
        ? "decreasing"
        : "critical";

    return {
      totalStates,
      criticalStates,
      warningStates,
      normalStates,
      goodStates,
      averageLevel: Math.round(averageLevel),
      overallTrend,
      lastUpdated: new Date(),
    };
  }, [stateWaterData]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Waves className="h-12 w-12 text-water-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-500 dark:text-gray-400">
            Loading national water data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-orange-100 text-lg">
              National Water Crisis Monitoring & Management
            </p>
            <p className="text-orange-200 text-sm mt-1">
              Comprehensive overview of all states' water levels
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleRefreshData}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2 transition-colors"
              >
                <svg
                  className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <p className="text-sm text-orange-200">Last Updated</p>
            <p className="text-lg font-semibold">
              {nationalOverview.lastUpdated.toLocaleTimeString()}
            </p>
            <p className="text-xs text-orange-300">
              {nationalOverview.lastUpdated.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* National Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Droplets className="h-7 w-7 text-water-500" />
            National Water Crisis Overview
          </h2>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              {getTrendIcon(nationalOverview.overallTrend)}
              <span className="capitalize font-medium">
                {nationalOverview.overallTrend} Trend
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Monitoring {nationalOverview.totalStates} states
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Critical States
                </p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {nationalOverview.criticalStates}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  Warning States
                </p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {nationalOverview.warningStates}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Normal States
                </p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {nationalOverview.normalStates}
                </p>
              </div>
              <Droplets className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Good States
                </p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {nationalOverview.goodStates}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* National Average */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              National Average Water Level
            </h3>
            <span className="text-2xl font-bold text-water-600 dark:text-water-400">
              {nationalOverview.averageLevel}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                nationalOverview.averageLevel < 30
                  ? "bg-red-500"
                  : nationalOverview.averageLevel < 50
                  ? "bg-orange-500"
                  : nationalOverview.averageLevel < 80
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${nationalOverview.averageLevel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* State-wise Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
          <Activity className="h-7 w-7 text-orange-500" />
          State-wise Water Levels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(stateWaterData).map((state, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                state.status === "critical"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : state.status === "warning"
                  ? "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                  : state.status === "normal"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {state.state}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    state.status === "critical"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      : state.status === "warning"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300"
                      : state.status === "normal"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  }`}
                >
                  {state.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Water Level:
                  </span>
                  <span className="font-medium">{state.waterLevel}%</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      state.waterLevel < 30
                        ? "bg-red-500"
                        : state.waterLevel < 50
                        ? "bg-orange-500"
                        : state.waterLevel < 80
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${state.waterLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
