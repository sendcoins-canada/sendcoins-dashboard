import type { Config } from "tailwindcss"
import twColors  from "tailwindcss/colors"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist"], 
        migra: ["Migra", "serif"],
        inter: ["Inter", "sans-serif"],
      },
       colors: {
        ...twColors, 
        primaryblue: "#57B5FF",
        destructive: "#FF4D4F",
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

