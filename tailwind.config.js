const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'table-footer': '175px 1fr 140px',
        'map-chart': '500px 1fr'
      }
    }
  },
  plugins: [],
}