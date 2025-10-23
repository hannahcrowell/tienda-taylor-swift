/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores inspirados en los álbumes de Taylor Swift
        "lover-pink": "#FFC0CB",
        "folklore-gray": "#B8B8B8",
        "evermore-orange": "#D4A574",
        "midnights-purple": "#6B5B93",
        "midnights-blue": "#4A5C7A",
        "red-classic": "#B8252C",
        "1989-blue": "#9CC8E5",
        "reputation-black": "#1A1A1A",
        "speak-now-purple": "#8B5BA8",
        "the-life-of-a-show-girl": "#a8795bff",
        "the-tortured-poets-department": "#525456ff",
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
