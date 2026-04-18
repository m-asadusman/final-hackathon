/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#0d9488',
          dark: '#0f766e',
          light: '#ccfbf1',
        },
        dark: '#1c2b2a',
        card: '#ffffff',
        muted: '#6b7280',
        bg: '#f0ede8',
      },
    },
  },
  plugins: [],
}
