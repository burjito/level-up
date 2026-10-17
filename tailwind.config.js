/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { poster: { red: '#dd0000', blue: '#0040ff', violet: '#512dc3', green: '#0cb820', orange: '#ff8a00' }, ink: '#1c1650' },
      fontFamily: { display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'], sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      keyframes: {
        pop: { from: { opacity: 0, transform: 'scale(.94) translateY(16px)' }, to: { opacity: 1, transform: 'none' } },
        blink: { '0%,100%': { opacity: 0 }, '50%': { opacity: 1 } },
        'bonus-in': { '0%': { opacity: 0, transform: 'scale(.3) rotate(-10deg)' }, '60%': { opacity: 1, transform: 'scale(1.12) rotate(2deg)' }, '100%': { opacity: 1, transform: 'none' } },
        fade: { from: { opacity: 0 }, to: { opacity: 1 } },
        float: { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '50%': { transform: 'translateY(-26px) rotate(18deg)' } },
      },
      animation: { blink: 'blink .4s ease-in-out 3 both', 'bonus-in': 'bonus-in .55s cubic-bezier(.2,.9,.3,1.2) both', fade: 'fade .4s ease both', pop: 'pop .45s cubic-bezier(.2,.8,.2,1) both', float: 'float 8s ease-in-out infinite' },
    },
  },
  plugins: [],
};
