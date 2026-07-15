import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B1512",
        "ink-soft": "#2A211C",
        cream: "#FAF5EC",
        "cream-deep": "#F1E8D8",
        gold: {
          light: "#F1D98B",
          DEFAULT: "#C9A227",
          deep: "#8A6A1E",
        },
        plum: {
          DEFAULT: "#5C2A3A",
          light: "#7A3B4E",
        },
      },
      fontFamily: {
        script: ["var(--font-script)"],
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      keyframes: {
        drip: {
          "0%": { transform: "scaleY(0)", opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { transform: "scaleY(1)", opacity: "1" },
        },
        rise: {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
      animation: {
        drip: "drip 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        rise: "rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        shimmer: "shimmer 3s linear infinite",
        wobble: "wobble 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
