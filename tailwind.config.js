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
      backgroundImage: {
        'gradient-app': 'linear-gradient(to bottom right, #f9fafb, #f3f4f6, #e5e7eb)',
        'gradient-app-dark': 'linear-gradient(to bottom right, #111827, #1f2937, #374151)',
      },
    },
  },
  plugins: [],
}