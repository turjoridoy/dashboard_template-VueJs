/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ["Oxygen", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Ubuntu", "Cantarell", "Noto Sans", "Helvetica Neue", "Arial", "sans-serif", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"],
      },
      colors: {
        primary: '#009688',
        secondary: '#28A745',
        danger: '#E91E63',
        dangerDark: '#AA0035',
        info: '#00b4d8',

      },
    },
  },
  plugins: [],
};
