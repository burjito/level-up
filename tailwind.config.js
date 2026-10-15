/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { poster: { red: '#dd0000', blue: '#0040ff', violet: '#512dc3', green: '#0cb820', orange: '#ff8a00' }, ink: '#1c1650' },
      // One family everywhere. To try another, change both lines (e.g. 'Fredoka') and the font import in index.css.
      fontFamily: { display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'], sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      keyframes: {
        pop: { from: { opacity: 0, transform: 'scale(.94) translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-26px) rotate(18deg)' } },
      },
      animation: { pop: 'pop .45s cubic-bezier(.2,.8,.2,1) both', float: 'float 8s ease-in-out infinite' },
    },
  },
  plugins: [],
};
