/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        surface: '#121B2E',
        surface2: '#182541',
        border: '#243352',
        mint: '#2DD4A7',
        coral: '#F2545B',
        gold: '#E8B95C',
        text: '#E8ECF4',
        muted: '#8A93A6',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
