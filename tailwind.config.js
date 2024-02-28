/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{vue, js}'
  ],
  theme: {
    fontFamily: {
      'sans': ['Inter var', 'sans-serif'],
      'serif': ['Inter var', 'serif'],
    },
    extend: {},
  },
  plugins: [],
}

