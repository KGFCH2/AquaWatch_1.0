import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleToggle = () => {
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        relative w-[70px] h-[34px] rounded-full transition-all duration-300 shadow-md hover:shadow-lg
        ${
          isDark
            ? "bg-slate-700 border-2 border-slate-600"
            : "bg-gradient-to-r from-blue-400 to-cyan-400 border-2 border-blue-300"
        }
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sliding Circle */}
      <div
        className={`
          absolute top-[3px] w-[24px] h-[24px] rounded-full transition-all duration-300 transform
          ${
            isDark
              ? "left-[3px] bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg"
              : "left-[39px] bg-white shadow-lg"
          }
          flex items-center justify-center
        `}
      >
        {/* Icon inside the circle */}
        {isDark ? (
          <svg
            height="14"
            width="14"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-cyan-400"
          >
            <path d="M12.009,24A12.067,12.067,0,0,1,.075,10.725,12.121,12.121,0,0,1,10.1.152a13,13,0,0,1,5.03.206,2.5,2.5,0,0,1,1.8,1.8,2.47,2.47,0,0,1-.7,2.425c-4.559,4.168-4.165,10.645.807,14.412h0a2.5,2.5,0,0,1-.7,4.319A13.875,13.875,0,0,1,12.009,24Z" />
          </svg>
        ) : (
          <svg
            height="14"
            width="14"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-yellow-500"
          >
            <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
          </svg>
        )}
      </div>
    </button>
  );
};
