/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wineRed: "#1a3e2c", // Dark green
        mustard: "#d4af37", // Gold
        // Removed the static "mustard" and "wineRed" definitions
      },
      backgroundImage: {
        // Define mustard as a linear gradient
        mustard: "linear-gradient(90deg, #d4af37, #F7EF8F)", // Gold gradient
        wineRed: "linear-gradient(90deg, #1a3e2c, #1a3e4a)" // Contrasting green gradient
      },
    },
  },
  plugins: [
    require('daisyui'),
    require('tailwind-scrollbar-hide'),
  ],
};
