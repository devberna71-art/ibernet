/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg:          "#FFFFFF",
        bgSection:   "#F8F9FB",
        surface:     "#FFFFFF",
        border:      "#E8E8ED",
        primary:     "#4F5EF7",
        primaryHover:"#3B4AE8",
        primarySoft: "#EEF0FE",
        text:        "#0D0D12",
        textSecondary: "#4A4A5A",
        textMuted:   "#8C8CA1",
        success:     "#16A34A",
        successSoft: "#DCFCE7",
        danger:      "#EF4444",
        dangerSoft:  "#FEE2E2",
        warning:     "#D97706",
        warningSoft: "#FEF3C7",
      },
      borderRadius: {
        xs:  "4px",
        sm:  "8px",
        md:  "12px",
        lg:  "16px",
        xl:  "20px",
      },
      boxShadow: {
        xs:    "0 1px 2px rgba(0,0,0,0.05)",
        sm:    "0 1px 4px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
        float: "0 4px 16px rgba(0,0,0,0.08)",
        lg:    "0 8px 32px rgba(0,0,0,0.10)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      spacing: {
        sidebar: "220px",
        topbar:  "60px",
      },
      fontSize: {
        "2xs":     ["11px", { lineHeight: "1.4" }],
        xs:        ["12px", { lineHeight: "1.4" }],
        sm:        ["13px", { lineHeight: "1.5" }],
        base:      ["14px", { lineHeight: "1.5" }],
        md:        ["15px", { lineHeight: "1.5" }],
        lg:        ["16px", { lineHeight: "1.4" }],
        xl:        ["18px", { lineHeight: "1.4" }],
        "2xl":     ["20px", { lineHeight: "1.3" }],
        "3xl":     ["24px", { lineHeight: "1.25" }],
        "4xl":     ["30px", { lineHeight: "1.2" }],
        "5xl":     ["36px", { lineHeight: "1.15" }],
        "6xl":     ["48px", { lineHeight: "1.1" }],
        "hero":    ["60px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulse2: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up":   "fadeUp 0.4s ease forwards",
        "shimmer":   "shimmer 1.5s infinite linear",
        "pulse2":    "pulse2 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
