/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // As cores vivem em variaveis CSS (src/index.css). Os canais *-rgb
      // permitem usar modificadores de opacidade: border-gold/25, bg-black/70...
      colors: {
        background: 'rgb(var(--background-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        'surface-light': 'rgb(var(--surface-light-rgb) / <alpha-value>)',
        primary: 'rgb(var(--primary-rgb) / <alpha-value>)',
        'primary-light': 'rgb(var(--primary-light-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        'gold-light': 'rgb(var(--gold-light-rgb) / <alpha-value>)',
        sand: 'rgb(var(--sand-rgb) / <alpha-value>)',
        text: 'rgb(var(--text-rgb) / <alpha-value>)',
        'text-muted': 'rgb(var(--text-muted-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Cinzel', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Kufi Arabic"', '"Noto Sans Arabic"', 'Tahoma', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      screens: {
        '3xl': '1800px',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        driftSand: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s ease-in-out',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'drift-sand': 'driftSand 60s linear infinite',
        'glow-pulse': 'glowPulse 5s ease-in-out infinite',
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(212,175,55,0.35), 0 24px 60px -24px rgba(212,175,55,0.35)',
        deep: '0 40px 90px -40px rgba(0,0,0,0.9)',
      },
    },
  },
  plugins: [],
};
