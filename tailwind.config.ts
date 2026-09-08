import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./game/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prime: {
          blue: "#2563EB",
          "blue-deep": "#1E3A8A",
          "blue-light": "#60A5FA",
          "blue-glow": "#38BDF8",
          cyber: "#00F0FF",
          bg: "#07111F",
          "bg-card": "#0F1B2D",
          "bg-elevated": "#14253E",
          surface: "#0F1B2D",
          border: "#1E3A5F",
          "border-bright": "#3B82F6",
          text: "#F8FAFC",
          muted: "#94A3B8",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
        },
      },
      boxShadow: {
        "neon-blue": "0 0 15px rgba(37, 99, 235, 0.5), 0 0 30px rgba(56, 189, 248, 0.3)",
        "neon-cyan": "0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.3)",
        "neon-danger": "0 0 15px rgba(239, 68, 68, 0.6), 0 0 30px rgba(239, 68, 68, 0.3)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "target-ping": "target-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "target-ping": {
          "75%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
