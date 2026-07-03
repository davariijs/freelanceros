import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        fa: ["var(--font-fa)", "system-ui", "sans-serif"],
      },
    },
  },
};

export default config;
