const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'table-footer': '175px 1fr 140px',
        'map-chart': '2fr 3fr'
      },
      boxShadow: {
        'slider': 'inset 1em 1em rgba(0, 0, 0, 0.3)',
      }
    }
  },
  plugins: [],
}