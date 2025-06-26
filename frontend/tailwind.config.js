/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        tagBlue: "#3B82F6",
        tagGreen: "#10B981",
        tagYellow: "#FBBF24",
        tagRed: "#EF4444",
        tagPurple: "#8B5CF6",
      },
    },
  },
  plugins: [],
}
