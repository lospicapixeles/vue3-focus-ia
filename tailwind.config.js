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
        ink: '#0f1412',
        paper: '#f4f6f5',
        surface: '#ffffff',
        accent: {
          DEFAULT: '#1f6b45',
          dark: '#165435',
          soft: '#e4f2ea',
        },
        muted: {
          DEFAULT: '#5a635e',
          line: '#e1e6e3',
        },
        danger: '#b42318',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 20, 18, 0.04)',
        panel: '0 4px 16px rgba(15, 20, 18, 0.06)',
      },
      borderRadius: {
        ali: '10px',
      },
    },
  },
  plugins: [],
}
