import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        handwriting: ["'Patrick Hand'", "cursive"],
        body: ["'Quicksand'", "sans-serif"],
      },
      colors: {
        primary: { DEFAULT: "#4A90D9", dark: "#357ABD" },
        accent: { DEFAULT: "#FF6B6B", dark: "#E55A5A" },
        page: "#FFFDF7",
      },
    },
  },
  plugins: [],
};

export default config;
