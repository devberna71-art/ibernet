/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F6F1E9",
        surface: "#FFFFFF",
        surfaceMuted: "#ECE5D8",
        primary: "#D97A4D",
        primarySoft: "#FBE3CF",
        text: "#211D19",
        textMuted: "#8B8378",
        danger: "#B5332C",
        success: "#5C8A5C",
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(33,29,25,0.05)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', "system-ui", "sans-serif"],
      },
      spacing: {
        sidebar: "230px",
      },
      fontSize: {
        pageTitle: ["30px", { lineHeight: "1.2", fontWeight: "700" }],
        cardTitle: ["17px", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        muted: ["13px", { lineHeight: "1.4", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
