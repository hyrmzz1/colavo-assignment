/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        purple: {
          light: '#a78bfa', // violet-400
          DEFAULT: '#8b5cf6', // violet-500
        },
        gray: {
          light: '#f3f4f6', // gray-100
          DEFAULT: '#6b7280', // gray-500
          sub: '#e5e7eb', // gray-200
        },
        red: {
          light: '#ffe4e6', // rose-100
          DEFAULT: '#f43f5e', // rose-500
        },
        white: '#ffffff',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
