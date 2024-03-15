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
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
    },
    extend: {
      width: {
        '25rem': '25rem',
      }
    },
  },
  plugins: [],
}

