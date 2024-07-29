/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Using modern `rgb`
        dominant: 'rgb(var(--color-dominant) / <alpha-value>)',
        complementary: 'rgb(var(--color-complementary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
      }
    },
  },
  plugins: [],
}

