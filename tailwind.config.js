/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1a1a4e',
          800: '#252561',
          100: '#e8e8f3',
        },
        orange: {
          500: '#f06937',
          600: '#d85a2e',
        },
      },
    },
  },
  plugins: [],
}
