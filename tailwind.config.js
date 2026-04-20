/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        sans:    ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        body:    ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#0d9488',
          dark:    '#0f766e',
          light:   '#ccfbf1',
        },
        dark:  '#1c2b2a',
        muted: '#6b7280',
        bg:    '#f0ede8',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
