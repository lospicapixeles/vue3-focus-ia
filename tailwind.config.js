/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#171714',
        paper: '#F3F0E8',
        surface: '#FFFCF6',
        accent: {
          DEFAULT: '#2F7A4B',
          dark: '#24563b',
          soft: '#d7eadc',
        },
        muted: {
          DEFAULT: '#6B665C',
          line: '#D6D0C2',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
