/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        attack: 'rgb(var(--color-attack) / <alpha-value>)',
        defense: 'rgb(var(--color-defense) / <alpha-value>)',
        environment: 'rgb(var(--color-environment) / <alpha-value>)',
        erase: 'rgb(var(--color-erase) / <alpha-value>)',
        status: 'rgb(var(--color-status) / <alpha-value>)',
        special: 'rgb(var(--color-special) / <alpha-value>)',
        'skill-white': '#a5a5a5',
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-(attack|defense|environment|erase|status|special)/
    }
  ],
}
