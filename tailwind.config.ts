import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist"], 
        migra: ["Migra", "serif"],
      },
      colors: {
        destructive: "#EF4444",
        primaryblue: "#57B5FF", 
        textgray: "#D2D2D2",
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#111827",
        },
      },
    },
  },
  plugins: [],
}

export default config

