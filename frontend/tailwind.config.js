/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Water-themed color palette
        water: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        ground: {
          50: "#faf7f2",
          100: "#f4eddd",
          200: "#e8d9ba",
          300: "#dac08e",
          400: "#caa560",
          500: "#bf8f42",
          600: "#b17c37",
          700: "#936530",
          800: "#78542d",
          900: "#624629",
          950: "#352414",
        },
        // Dark mode specific colors
        dark: {
          bg: "#0f172a",
          surface: "#1e293b",
          border: "#334155",
          text: "#cbd5e1",
          muted: "#64748b",
        },
      },
      animation: {
        "water-flow": "water-flow 3s ease-in-out infinite",
        bubble: "bubble 2s ease-in-out infinite",
      },
      keyframes: {
        "water-flow": {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "50%": { transform: "translateX(2px) rotate(1deg)" },
        },
        bubble: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.7" },
          "50%": { transform: "translateY(-4px) scale(1.1)", opacity: "1" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
