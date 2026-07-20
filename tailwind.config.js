/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#080506', 900: '#100808', 800: '#180d0d', 700: '#221212', 600: '#2e1818', 500: '#3d2020',
        },
        crimson: {
          900: '#5c0a0a', 800: '#7a0d0d', 700: '#921111', 600: '#a81515', 500: '#c01818', 400: '#d93333', 300: '#e86060',
        },
        gold: {
          900: '#5a3e00', 800: '#7a5400', 700: '#9e6e00', 600: '#c08800', 500: '#d4a017', 400: '#e0b030', 300: '#f0c84a', 200: '#f8dc80', 100: '#fdf0c0',
        },
        steel: {
          900: '#111214', 800: '#1c1e21', 700: '#272a2e', 600: '#33373c', 500: '#42474d', 400: '#555b63', 300: '#7a8290',
        },
        lava: {
          700: '#7a2a00', 600: '#a83800', 500: '#cc5500', 400: '#e07020', 300: '#f09040',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"system-ui"', 'sans-serif'],
        display: ['"Cinzel"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
};
