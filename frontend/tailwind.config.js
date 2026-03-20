/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: 'rgb(var(--color-primary) / <alpha-value>)',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        accent: {
          violet: '#a78bfa',
          rose:   '#f43f5e',
          amber:  '#f59e0b',
          emerald:'#10b981',
          cyan:   '#06b6d4',
        },
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          subtle:  'rgb(var(--color-surface-subtle) / <alpha-value>)',
          muted:   'rgb(var(--color-surface-muted) / <alpha-value>)',
          elevated:'rgb(var(--color-surface-elevated) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'card':   '0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 16px 0 rgb(0 0 0 / 0.10), 0 1px 4px -1px rgb(0 0 0 / 0.06)',
        'float':  '0 8px 32px -4px rgb(0 0 0 / 0.18), 0 2px 8px -2px rgb(0 0 0 / 0.12)',
        'glow-primary': '0 0 24px 0 rgb(99 102 241 / 0.35)',
        'glow-accent':  '0 0 24px 0 rgb(167 139 250 / 0.35)',
        'inner-subtle': 'inset 0 1px 0 0 rgb(255 255 255 / 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'slide-up':   'slideUp 0.4s ease-out forwards',
        'slide-right':'slideRight 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'glow':       'glow 2s ease-in-out infinite alternate',
        'typing':     'typing 1s steps(3) infinite',
      },
      keyframes: {
        fadeIn:   { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp:  { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        shimmer:  { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float:    { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        glow:     { from: { boxShadow: '0 0 12px rgb(99 102 241 / 0.2)' }, to: { boxShadow: '0 0 28px rgb(99 102 241 / 0.5)' } },
        typing:   { '0%, 100%': { content: '.' }, '33%': { content: '..' }, '66%': { content: '...' } },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-mesh':   'radial-gradient(ellipse at 20% 50%, rgb(99 102 241 / 0.15), transparent 50%), radial-gradient(ellipse at 80% 20%, rgb(167 139 250 / 0.12), transparent 50%)',
        'shimmer-gradient':'linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.06) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
