import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          50: "#fdf5ee",
          100: "#f8e6d2",
          200: "#f0c99f",
          300: "#e6a666",
          400: "#dd8339",
          500: "#c9641f",
          600: "#a84e18",
          700: "#833c17",
          800: "#6a3218",
          900: "#582a17",
        },
        charcoal: {
          900: "#161311",
          800: "#211c19",
          700: "#2c2521",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
