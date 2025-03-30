import scrollbarHide from 'tailwind-scrollbar-hide';
import scrollbar from 'tailwind-scrollbar';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)']
      },
      colors: {
        primary: '#d26a4d',
        secondary: '#ec1f1f',
        background: '#0f0f0f',
        foreground: '#eaeaea',
        card: '#18181a',
        success: '#4caf50',
        warning: '#f4a261',
        error: '#e63946',
        info: '#a6773c'
      }
    }
  },
  plugins: [scrollbarHide, scrollbar]
};
