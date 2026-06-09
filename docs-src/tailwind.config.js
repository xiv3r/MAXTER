/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#121212',
          surface: '#1A1A1A',
          elevated: '#242424',
        },
        accent: {
          blue: '#2563EB',
          light: '#3B82F6',
        },
        border: {
          subtle: '#2D2D2D',
          active: 'rgba(37, 99, 235, 0.25)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
