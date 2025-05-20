/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'magazine-primary': '#1a365d',
        'magazine-secondary': '#e53e3e',
        'magazine-light': '#f7fafc',
      },
    },
  },
  plugins: [],
}
