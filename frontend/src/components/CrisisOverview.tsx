import React from "react";
import { AlertTriangle, Droplets, Users, TrendingDown } from "lucide-react";

const stats = [
  {
    title: "States in Crisis",
    value: "18",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "States experiencing severe water shortage",
  },
  {
    title: "Water Availability",
    value: "45%",
    icon: Droplets,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Below normal levels nationwide",
  },
  {
    title: "Population Affected",
    value: "600M",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "People facing water stress",
  },
  {
    title: "Groundwater Depletion",
    value: "2.5cm/yr",
    icon: TrendingDown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Average annual decline rate",
  },
];

export const CrisisOverview: React.FC = () => {
  return (
    <section className="mb-8" aria-labelledby="crisis-overview-title">
      <div className="mb-6">
        <h2
          id="crisis-overview-title"
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          National Water Crisis Overview
        </h2>
        <p className="text-gray-600 dark:text-slate-300 max-w-3xl">
          Real-time monitoring of India's water crisis situation across all
          states and union territories. Critical data updated every 6 hours from
          government and satellite sources.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-dark-surface rounded-xl shadow-lg border border-gray-100 dark:border-dark-border p-6 hover:shadow-xl transition-all duration-300"
              role="article"
              aria-labelledby={`stat-${index}-title`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${stat.bgColor} dark:bg-slate-700`}
                >
                  <Icon
                    className={`h-6 w-6 ${stat.color} dark:text-water-400`}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </div>
              </div>
              <h3
                id={`stat-${index}-title`}
                className="font-semibold text-gray-900 dark:text-white mb-1"
              >
                {stat.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-400 dark:border-red-500 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle
            className="h-6 w-6 text-red-400 mt-1 mr-3 flex-shrink-0"
            aria-hidden="true"
          />
          <div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Critical Alert
            </h3>
            <p className="text-red-700 mb-3">
              Chennai, Bengaluru, Delhi, and Lakshadweep are experiencing severe
              water stress. Immediate intervention required.
            </p>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="View emergency response plan"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("showEmergencyResponse"));
              }}
            >
              View Emergency Response
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
