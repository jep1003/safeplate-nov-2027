/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF5EA',
        card: '#FFFDF8',
        sand: '#EFE6D2',
        line: '#D9CCB2',
        ink: '#2B2118',
        muted: '#5C4E41',
        terra: { DEFAULT: '#9C3F25', dark: '#7A2F1A', tint: '#F4E0D6' },
        olive: { DEFAULT: '#3F5A25', tint: '#E3EBD3' },
        ochre: { DEFAULT: '#6B4A00', tint: '#F7EBC6' },
        stone: { DEFAULT: '#4A4036', tint: '#E9E4DA' },
        alert: { DEFAULT: '#9B1C1C', tint: '#FBE4E1' },
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        body: ['ui-sans-serif', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
