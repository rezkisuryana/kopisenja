/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Kopi Senja palette ──────────────────────────
        // Primary: deep espresso browns
        espresso: {
          50:  '#F7F2EE',
          100: '#EDE0D4',
          200: '#D9BFA6',
          300: '#C49A76',
          400: '#A97848',
          500: '#7C5430',  // main brown
          600: '#5C3A1E',
          700: '#3E2510',
          800: '#241508',
          900: '#120A03',
        },
        // Accent: warm amber/caramel
        caramel: {
          50:  '#FDF6EC',
          100: '#FAEBD0',
          200: '#F5D09A',
          300: '#EFAF59',
          400: '#E8902A',  // main accent
          500: '#C97820',
          600: '#9E5C16',
          700: '#72420F',
          800: '#472A08',
          900: '#261503',
        },
        // Neutral: warm creams
        cream: {
          50:  '#FDFAF6',
          100: '#F8F2E8',
          200: '#F0E4CE',
          300: '#E5D0B0',
          400: '#D4B88A',
          500: '#BF9C65',
          600: '#9A7B45',
          700: '#725A2F',
          800: '#4A3A1C',
          900: '#261E0C',
        },
        // Muted sage for accents
        sage: {
          50:  '#F2F5F0',
          100: '#E0E9DB',
          200: '#BDD0B4',
          300: '#96B18A',
          400: '#6E8F62',
          500: '#4E6B44',
          600: '#384E30',
          700: '#26351F',
          800: '#161E12',
          900: '#0A0F08',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
