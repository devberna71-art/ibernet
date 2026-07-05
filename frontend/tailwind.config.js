/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ─── Eclesia Brand Palette ─────────────────────────── */
        bg:            "#FFFFFF",
        bgSection:     "#F8FAFC",
        surface:       "#FFFFFF",
        border:        "#E2E8F0",

        /* Primary = Eclesia Blue */
        primary:       "#2563EB",
        primaryHover:  "#1D4ED8",
        primarySoft:   "#EFF6FF",
        primaryDark:   "#0F172A",

        /* Text */
        text:          "#0F172A",
        textSecondary: "#475569",
        textMuted:     "#94A3B8",

        /* Semantic */
        success:      "#16A34A",
        successSoft:  "#DCFCE7",
        danger:       "#EF4444",
        dangerSoft:   "#FEE2E2",
        warning:      "#D97706",
        warningSoft:  "#FEF3C7",
        info:         "#2563EB",
        infoSoft:     "#EFF6FF",
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
      },
      boxShadow: {
        xs:    "0 1px 2px rgba(0,0,0,0.04)",
        sm:    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        float: "0 4px 16px rgba(37,99,235,0.08), 0 1px 4px rgba(0,0,0,0.06)",
        lg:    "0 8px 32px rgba(0,0,0,0.10)",
        glow:  "0 0 0 3px rgba(37,99,235,0.15)",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "-apple-system", "sans-serif"],
      },
      spacing: {
        sidebar: "220px",
        topbar:  "60px",
      },
      fontSize: {
        "2xs":      ["11px", { lineHeight: "1.4" }],
        xs:         ["12px", { lineHeight: "1.4" }],
        sm:         ["13px", { lineHeight: "1.5" }],
        base:       ["14px", { lineHeight: "1.5" }],
        md:         ["15px", { lineHeight: "1.5" }],
        lg:         ["16px", { lineHeight: "1.4" }],
        xl:         ["18px", { lineHeight: "1.4" }],
        "2xl":      ["20px", { lineHeight: "1.3" }],
        "3xl":      ["24px", { lineHeight: "1.25" }],
        "4xl":      ["30px", { lineHeight: "1.2" }],
        "5xl":      ["36px", { lineHeight: "1.15" }],
        "6xl":      ["48px", { lineHeight: "1.1" }],
        "hero":     ["60px", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "pageTitle":["20px", { lineHeight: "1.3" }],
        "cardTitle":["15px", { lineHeight: "1.5" }],
        "muted":    ["13px", { lineHeight: "1.5" }],
        "body":     ["14px", { lineHeight: "1.5" }],
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
          "50%":      { opacity: "0.5" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.35s ease forwards",
        "shimmer":  "shimmer 1.5s infinite linear",
        "pulse2":   "pulse2 2s ease-in-out infinite",
        "slide-in": "slideIn 0.25s ease forwards",
      },
    },
  },
  plugins: [],
};
