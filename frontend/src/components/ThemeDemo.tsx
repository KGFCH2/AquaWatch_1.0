import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Droplets, Waves, Sun, Moon } from "lucide-react";

export const ThemeDemo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="mt-12 p-6 bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
          {theme === "dark" ? "Deep Water Mode" : "Clear Sky Mode"}
        </h3>
        <p className="text-gray-600 dark:text-slate-300">
          Water-themed color palette adapts beautifully to both light and dark
          environments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Water Colors */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Droplets className="h-4 w-4 text-water-500" />
            Water Palette
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-water-200 dark:bg-water-800 rounded-full border-2 border-water-300 dark:border-water-600"></div>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Primary Water
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-water-400 dark:bg-water-600 rounded-full border-2 border-water-500"></div>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Active Water
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-water-600 dark:bg-water-400 rounded-full border-2 border-water-700 dark:border-water-300"></div>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Deep Water
              </span>
            </div>
          </div>
        </div>

        {/* Ground Colors */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Waves className="h-4 w-4 text-ground-500" />
            Ground Palette
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ground-200 dark:bg-ground-800 rounded-full border-2 border-ground-300 dark:border-ground-600"></div>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Light Earth
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ground-400 dark:bg-ground-600 rounded-full border-2 border-ground-500"></div>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Rich Soil
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-ground-600 dark:bg-ground-400 rounded-full border-2 border-ground-700 dark:border-ground-300"></div>
              <span className="text-sm text-gray-700 dark:text-slate-300">
                Deep Earth
              </span>
            </div>
          </div>
        </div>

        {/* Gradient Examples */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">
            Gradients
          </h4>
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-water-300 to-water-500 dark:from-water-700 dark:to-water-500 rounded-lg border border-water-400 dark:border-water-600"></div>
            <div className="h-8 bg-gradient-to-r from-ground-300 to-ground-500 dark:from-ground-700 dark:to-ground-500 rounded-lg border border-ground-400 dark:border-ground-600"></div>
            <div className="h-8 bg-gradient-to-r from-water-400 via-water-500 to-ground-400 dark:from-water-600 dark:via-water-500 dark:to-ground-600 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Animation Demo */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Interactive Elements
        </h4>
        <div className="flex gap-4 flex-wrap">
          <div className="animate-water-flow">
            <Droplets className="h-8 w-8 text-water-500 dark:text-water-400" />
          </div>
          <div className="animate-bubble">
            <div className="w-4 h-4 bg-water-400 dark:bg-water-500 rounded-full"></div>
          </div>
          <div className="animate-pulse">
            <Waves className="h-8 w-8 text-ground-500 dark:text-ground-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
