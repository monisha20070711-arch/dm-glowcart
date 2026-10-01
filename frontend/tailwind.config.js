/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        glow: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          gold: '#d97706',
          amber: '#f59e0b',
          rose: '#e11d48',
          blush: '#fdf2f8',
          nude: '#fff5f5'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      boxShadow: {
        glow: '0 4px 20px -2px rgba(225, 29, 72, 0.15)',
        card: '0 2px 12px 0 rgba(0, 0, 0, 0.05)'
      }
    }
  },
  plugins: []
};
