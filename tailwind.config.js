/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dev: {
          bg: '#F3F3F1', // Updated to the Light Stone color you wanted
          card: '#FFFFFF',
          accent: '#FF5418',
          text: '#1A1A1A',
        },
        des: {
          bg: '#050505',
          accent: '#ff4d00',
        }
      },
      fontFamily: {
        // Ensure double quotes are inside single quotes
        sans: ['"Bricolage Grotesque"', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}