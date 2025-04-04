/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        primary: '#3490dc',  // Blue 
        secondary: '#ffed4a',  // Yellow
        accent: '#38b2ac',  // Teal
        danger: '#e3342f',  // Red
        success: '#38c172',  // Green
        dark: '#1a202c',  // Dark gray
        light: '#f7fafc',  // Light gray
        brand: {
          100: '#ffdbd8', 
          200: '#ffb8b1', 
          300: '#ff9291', 
          400: '#ff6c6a',
        }
      }
    },
  },
  plugins: [],
}