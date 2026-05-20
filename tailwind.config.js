/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/app/**/*.{js,jsx,ts,tsx}",
    "./frontend/components/**/*.{js,jsx,ts,tsx}",
    "./frontend/screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}