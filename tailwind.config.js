/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      keyframes: {
        pop: {
          from: { opacity: 0, transform: 'scale(.96) translateY(14px)' },
          to: { opacity: 1, transform: 'none' },
        },
      },
      animation: { pop: 'pop .5s cubic-bezier(.2,.8,.2,1) both' },
    },
  },
  plugins: [],
};