/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /grid-cols-\d+/,
      variants: ['sm', 'md', 'lg', 'xl'],
    },
    {
      pattern: /grid-rows-\d+/,
      variants: ['sm', 'md', 'lg', 'xl'],
    },
  ],
  plugins: [],
}