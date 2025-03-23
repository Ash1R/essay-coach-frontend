/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: '#f5f0e6',
        charcoal: '#1c1c1c',
      },
      fontFamily: {
        display: ['"Josefin Sans"', 'sans-serif'],
        body: ['Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
