import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--bg-base))",
        surface: "rgb(var(--bg-surface))",
        card: "rgb(var(--bg-card))",

        primary: "rgb(var(--text-primary))",
        secondary: "rgb(var(--text-secondary))",
        muted: "rgb(var(--text-muted))",

        accent: "rgb(var(--accent))",
      },
    },
  },
  plugins: [],
};

export default config;

