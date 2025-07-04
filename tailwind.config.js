/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        app: 'var(--color-bg)',
        'nav-app': 'var(--color-bg-nav)',
        'card': 'var(--color-bg-card)',
        'text-app': 'var(--color-text)',
      },
    },
  },
  plugins: [],
}