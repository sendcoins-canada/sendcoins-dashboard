import type { Config } from "tailwindcss"
import twColors  from "tailwindcss/colors"

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist"], 
        migra: ["Migra", "serif"],
      }
    },
  },
  plugins: [],
}

export default config

