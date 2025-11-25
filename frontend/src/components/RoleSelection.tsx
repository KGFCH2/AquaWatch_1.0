import React from "react";
import { User, Shield, Droplets } from "lucide-react";

interface RoleSelectionProps {
  onSelectRole: (role: "user" | "admin") => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({
  onSelectRole,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B8D4E8] via-[#D0E8F5] to-[#A8D5E8] dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-[#00D4FF]/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute w-96 h-96 -bottom-48 -right-48 bg-[#003867]/10 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#003867] to-[#00D4FF] dark:from-blue-500 dark:to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-[#003867] to-[#00D4FF] dark:from-blue-500 dark:to-cyan-500 rounded-2xl shadow-2xl">
                <Droplets className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-[#003867] dark:text-white mb-4 tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#003867] to-[#00D4FF] dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AquaWatch
            </span>
          </h1>
          <p className="text-xl text-[#003867]/80 dark:text-slate-300 max-w-2xl mx-auto">
            Real-time water crisis monitoring system for India
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* User Card */}
          <button
            onClick={() => onSelectRole("user")}
            className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-[#00D4FF]/30 dark:border-slate-700/50 p-8 text-left hover:bg-[#E8F0F8] dark:hover:bg-slate-800/70 hover:border-[#00D4FF] dark:hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF]/0 to-[#003867]/0 dark:from-blue-500/0 dark:to-cyan-500/0 group-hover:from-[#00D4FF]/10 group-hover:to-[#003867]/10 dark:group-hover:from-blue-500/10 dark:group-hover:to-cyan-500/10 rounded-2xl transition-all duration-300"></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-[#00D4FF]/20 dark:bg-gradient-to-br dark:from-blue-500/20 dark:to-cyan-500/20 rounded-xl group-hover:bg-[#00D4FF]/30 dark:group-hover:from-blue-500/30 dark:group-hover:to-cyan-500/30 transition-all duration-300">
                  <User className="h-8 w-8 text-[#003867] dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#003867]/60 dark:text-slate-400">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  Active
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#003867] dark:text-white mb-3">
                User Access
              </h3>
              <p className="text-[#003867]/80 dark:text-slate-300 mb-6 leading-relaxed">
                Monitor water crisis data, view real-time statistics, and access
                conservation solutions for your state
              </p>

              <div className="flex items-center text-[#00D4FF] dark:text-blue-400 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                <span>Continue as User</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => onSelectRole("admin")}
            className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 border-orange-400/30 dark:border-slate-700/50 p-8 text-left hover:bg-orange-50 dark:hover:bg-slate-800/70 hover:border-orange-500 dark:hover:border-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 dark:group-hover:from-orange-500/10 dark:group-hover:to-red-500/10 rounded-2xl transition-all duration-300"></div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-orange-500/20 dark:bg-gradient-to-br dark:from-orange-500/20 dark:to-red-500/20 rounded-xl group-hover:bg-orange-500/30 dark:group-hover:from-orange-500/30 dark:group-hover:to-red-500/30 transition-all duration-300">
                  <Shield className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#003867]/60 dark:text-slate-400">
                  <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full animate-pulse"></div>
                  Secure
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#003867] dark:text-white mb-3">
                Admin Access
              </h3>
              <p className="text-[#003867]/80 dark:text-slate-300 mb-6 leading-relaxed">
                Manage system data, oversee national water crisis monitoring,
                and control user database
              </p>

              <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium group-hover:gap-3 gap-2 transition-all duration-300">
                <span>Continue as Admin</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-[#003867]/70 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Secure
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              Fast
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Reliable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
