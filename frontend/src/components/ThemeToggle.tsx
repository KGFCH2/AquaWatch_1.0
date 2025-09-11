import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <label className="inline-flex items-center relative cursor-pointer">
      <input
        className="peer hidden"
        id="theme-toggle"
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        aria-label="Toggle between light and dark mode"
      />

      {/* Toggle Background with sliding circle */}
      <div
        className={`
          relative w-[80px] h-[40px] rounded-full shadow-sm duration-300 transition-all overflow-hidden
          ${isDark ? "bg-slate-800" : "bg-sky-200"}
          after:absolute after:content-[''] after:w-[32px] after:h-[32px]
          after:rounded-full after:top-[4px] after:shadow-md after:duration-300 after:transition-all after:z-10
          ${
            isDark
              ? "after:left-[4px] after:bg-gradient-to-r after:from-slate-600 after:to-slate-700"
              : "after:left-[44px] after:bg-gradient-to-r after:from-orange-400 after:to-yellow-400"
          }
          hover:after:scale-105 active:after:scale-95
        `}
      ></div>

      {/* Sun Icon - Should be active when light mode (right side) */}
      <svg
        height="16"
        width="16"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`
          absolute w-4 h-4 right-[12px] top-1/2 transform -translate-y-1/2 transition-all duration-300 z-20 pointer-events-none
          ${
            isDark
              ? "fill-slate-400 opacity-40"
              : "fill-white opacity-100 drop-shadow-sm"
          }
        `}
      >
        <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
      </svg>

      {/* Moon Icon - Should be active when dark mode (left side) */}
      <svg
        height="16"
        width="16"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={`
          absolute w-4 h-4 left-[12px] top-1/2 transform -translate-y-1/2 transition-all duration-300 z-20 pointer-events-none
          ${
            isDark
              ? "fill-white opacity-100 drop-shadow-sm"
              : "fill-slate-500 opacity-40"
          }
        `}
      >
        <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Zm.074-22a10.776,10.776,0,0,0-1.675.127,10.1,10.1,0,0,0-8.344,8.8A9.928,9.928,0,0,0,4.581,18.7a10.473,10.473,0,0,0,11.093,2.734.5.5,0,0,0,.138-.856h0C9.883,16.1,9.417,8.087,14.865,3.124a.459.459,0,0,0,.127-.465.491.491,0,0,0-.356-.362A10.68,10.68,0,0,0,12.083,2Z" />
      </svg>
    </label>
  );
};
