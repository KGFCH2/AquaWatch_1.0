import React from "react";
import { User, Shield, Droplets, Play } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: "user" | "admin") => void;
  onDemoLogin?: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectRole,
  onDemoLogin,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-water-100 dark:from-slate-900 dark:to-blue-950 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-water-500 rounded-full">
              <Droplets className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to AquaWatch
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            Choose your account type to continue
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectRole("user")}
            className="w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 text-left hover:border-water-300 dark:hover:border-water-600 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-water-50 dark:bg-water-900/30 rounded-lg group-hover:bg-water-100 dark:group-hover:bg-water-900/50 transition-colors">
                <User className="h-6 w-6 text-water-600 dark:text-water-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Account
                </h3>
                <p className="text-gray-600 dark:text-slate-300 text-sm">
                  Access water crisis information and solutions for your state
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectRole("admin")}
            className="w-full bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6 text-left hover:border-orange-300 dark:hover:border-orange-600 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Admin Account
                </h3>
                <p className="text-gray-600 dark:text-slate-300 text-sm">
                  Manage system data and oversee water crisis responses
                </p>
              </div>
            </div>
          </button>

          {onDemoLogin && (
            <button
              onClick={onDemoLogin}
              className="w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700 p-6 text-left hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Demo User
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm">
                    Try AquaWatch with a demo account (Maharashtra state)
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Secure • Reliable • Fast
          </p>
        </div>
      </div>
    </div>
  );
};
