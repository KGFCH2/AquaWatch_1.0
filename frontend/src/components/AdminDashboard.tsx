// src/components/AdminDashboard.tsx

// UPDATED: Import useState and the new popup component
import React, { useState } from "react";
import StateDetailsPopup from "./StateDetailsPopup";
import { AdminLoadingSpinner } from "./AdminLoadingSpinner";

import { useWaterData } from "../contexts/WaterDataContext";
import {
  Droplets,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Activity,
  Shield,
} from "lucide-react";

// UPDATED: Added a type definition for state data
interface StateType {
  state: string;
  waterLevel: number;
  status: "critical" | "warning" | "normal" | "good";
}

const AdminDashboard: React.FC = () => {
  const { stateWaterData, loading, refreshData } = useWaterData();

  // UPDATED: Add state to manage which state is selected for the popup
  const [selectedState, setSelectedState] = useState<StateType | null>(null);

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
        <AdminLoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Admin Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003867] via-[#004A87] to-[#003867] dark:from-slate-800 dark:via-red-950 dark:to-slate-900 p-8 shadow-2xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-400 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-white/90 text-lg mb-2">
              National Water Crisis Monitoring & Management
            </p>
            <p className="text-white/80 text-sm">
              Comprehensive overview of all states' water levels
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={handleRefreshData}
              disabled={loading}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 border border-white/30 dark:border-white/20 disabled:opacity-50 flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
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
            <div className="text-right bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20 dark:border-white/10">
              <p className="text-xs text-white/80 mb-1">Last Updated</p>
              <p className="text-sm font-semibold text-white">
                {nationalOverview.lastUpdated.toLocaleTimeString()}
              </p>
              <p className="text-xs text-white/70">
                {nationalOverview.lastUpdated.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* National Overview */}
      <div className="bg-gradient-to-br from-[#B8D4E8] to-[#A8D5E8] dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#00D4FF]/30 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-[#003867] dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-[#003867] to-[#00D4FF] rounded-xl">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            National Water Crisis Overview
          </h2>
          <div className="flex items-center gap-3 bg-[#D0E8F5] dark:bg-slate-900/50 rounded-xl px-4 py-2 border border-[#00D4FF]/30 dark:border-slate-700">
            {getTrendIcon(nationalOverview.overallTrend)}
            <span className="text-sm font-medium text-[#003867] dark:text-slate-300 capitalize">
              {nationalOverview.overallTrend} Trend
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 dark:bg-red-900/30 p-5 rounded-xl border-2 border-red-300 dark:border-red-800 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                  Critical States
                </p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                  {nationalOverview.criticalStates}
                </p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/30 p-5 rounded-xl border-2 border-orange-300 dark:border-orange-800 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                  Warning States
                </p>
                <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                  {nationalOverview.warningStates}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-500/20 rounded-xl">
                <TrendingDown className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/30 p-5 rounded-xl border-2 border-green-300 dark:border-green-800 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                  Normal States
                </p>
                <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                  {nationalOverview.normalStates}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-500/20 rounded-xl">
                <Droplets className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-xl border-2 border-blue-300 dark:border-blue-800 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Good States
                </p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                  {nationalOverview.goodStates}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#D8E8F5] dark:bg-slate-900/80 backdrop-blur-sm p-5 rounded-xl border border-[#00D4FF]/30 dark:border-slate-600">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-[#003867] dark:text-white">
              National Average Water Level
            </h3>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#003867] to-[#00D4FF] dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {nationalOverview.averageLevel}%
            </span>
          </div>
          <div className="w-full bg-[#B8D4E8] dark:bg-slate-700 rounded-full h-4 overflow-hidden border border-[#00D4FF]/30 dark:border-slate-600">
            <div
              className={`h-4 rounded-full transition-all duration-700 ${
                nationalOverview.averageLevel <= 30
                  ? "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600"
                  : nationalOverview.averageLevel <= 50
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"
                  : nationalOverview.averageLevel <= 70
                  ? "bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500"
              }`}
              style={{ width: `${nationalOverview.averageLevel}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* State-wise Grid */}
      <div className="bg-gradient-to-br from-[#A8D5E8] to-[#B8D4E8] dark:from-slate-800 dark:to-slate-900 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-[#00D4FF]/30 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-[#003867] dark:text-white mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#003867] to-[#00D4FF] rounded-xl">
            <Activity className="h-6 w-6 text-white" />
          </div>
          State-wise Water Levels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(stateWaterData).map((state, index) => (
            <div
              key={index}
              onClick={() => setSelectedState(state as StateType)}
              className={`relative overflow-hidden p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm ${
                state.status === "critical"
                  ? "bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-700 hover:border-red-500 dark:hover:border-red-600"
                  : state.status === "warning"
                  ? "bg-orange-50 dark:bg-orange-900/30 border-orange-400 dark:border-orange-700 hover:border-orange-500 dark:hover:border-orange-600"
                  : state.status === "normal"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-700 hover:border-emerald-500 dark:hover:border-emerald-600"
                  : "bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-600"
              }`}
            >
              <div className="absolute top-2 right-2">
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full ${
                    state.status === "critical"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200"
                      : state.status === "warning"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/80 dark:text-orange-200"
                      : state.status === "normal"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/80 dark:text-blue-200"
                  }`}
                >
                  {state.status.toUpperCase()}
                </span>
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#003867] dark:text-white mb-1">
                  {state.state}
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#003867]/70 dark:text-slate-400">
                    Water Level:
                  </span>
                  <span className="text-2xl font-bold text-[#003867] dark:text-white">
                    {state.waterLevel}%
                  </span>
                </div>

                <div className="w-full bg-[#B8D4E8] dark:bg-slate-700 rounded-full h-3 overflow-hidden border border-[#00D4FF]/30 dark:border-slate-600">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      state.waterLevel <= 30
                        ? "bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600"
                        : state.waterLevel <= 50
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500"
                        : state.waterLevel <= 70
                        ? "bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-amber-500"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-500 dark:to-green-500"
                    }`}
                    style={{ width: `${state.waterLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPDATED: Conditionally render the popup if a state is selected */}
      {selectedState && (
        <StateDetailsPopup
          state={selectedState}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
