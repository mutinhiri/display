/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Graysmoke: "#EBEBFF",
        Sepiagray: "#344563"
      }
    },
  },
  plugins: [],
}