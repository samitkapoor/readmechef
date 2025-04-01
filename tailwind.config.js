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
        primary: '#57cb5b',
        secondary: '#198d49',
        background: '#020b05',
        text: '#EAEAEA',
        card: '#161B22',
        success: '#60D666',
        warning: '#F4A261',
        error: '#E63946',
        info: '#A6CC3C'
      }
    }
  },
  plugins: [scrollbarHide, scrollbar]
};
