/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "350px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      body: ["Plus Jakarta Sans", "sans-serif"],
      heading: ["Syne", "sans-serif"],
      mono: ["JetBrains Mono", "monospace"],
      special: ["Syne", "sans-serif"],
    },
    extend: {
      colors: {
        bgDark: "#0B0F17", // Main background
        cardBg: "#0D111A", // Card surface
        bgLighter: "#151B29", // Lighter surface
        gold: "#D4AF37", // Primary Accent
        lightGold: "#E5C158",
        darkGold: "#AA8C2C",
        textMain: "#FFFFFF",
        textMuted: "#94A3B8",
        textLight: "#CBD5E1",
        cyanGlow: "#06b6d4",
      },
      boxShadow: {
        goldShadow: "0px 0px 20px 0px rgba(212, 175, 55, 0.3)",
        goldBigShadow: "0px 0px 100px 50px rgba(212, 175, 55, 0.1)",
        goldMediumShadow: "0px 0px 50px 25px rgba(212, 175, 55, 0.15)",
        glow: "0 0 30px 5px rgba(212, 175, 55, 0.15)",
      },
    },
  },
  plugins: [require("daisyui")],
};
