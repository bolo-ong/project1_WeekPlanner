/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      margin: {
        '45px': '45px',
        '90vh': '90vh',
        '80vw': '80vw'
      },
      scale: {
        '101': '1.01',
      },
    },
  },
  plugins: [],
}
