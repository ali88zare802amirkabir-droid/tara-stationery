import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F4F7FD',
          soft: '#EDF2FB',
          deep: '#E4EBF8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFF',
          sunken: '#F1F5FC',
        },
        line: {
          DEFAULT: '#E6ECF8',
          strong: '#D8E1F3',
          soft: '#EFF3FB',
        },
        brand: {
          50: '#EFF4FF',
          100: '#DEE8FF',
          200: '#C2D5FF',
          300: '#9BB9FB',
          400: '#6D96F3',
          500: '#4A73E8',
          600: '#3459CE',
          700: '#2A46A6',
          800: '#253C82',
          900: '#1E3064',
        },
        ink: {
          900: '#101B33',
          800: '#16233D',
          700: '#1F2D4A',
          600: '#33435F',
          500: '#4A5B78',
          400: '#6B7B96',
          300: '#94A3BC',
          200: '#C2CDDF',
          100: '#E3E9F4',
        },
        success: { DEFAULT: '#0E9F6E', soft: '#E6F7F1', strong: '#077452' },
        warning: { DEFAULT: '#C2740B', soft: '#FDF3E1', strong: '#8E5405' },
        danger: { DEFAULT: '#DC2B45', soft: '#FDECEF', strong: '#A3172C' },
        info: { DEFAULT: '#2F7BE8', soft: '#EAF2FE' },
        accent: { DEFAULT: '#7C4DE8', soft: '#F1EBFE' },
        blush: { DEFAULT: '#E5306A', soft: '#FEECF1' },
      },
      fontFamily: {
        sans: ['var(--font-vazirmatn)', 'Tahoma', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        'display-lg': ['clamp(2.25rem, 1.4rem + 3.2vw, 3.75rem)', { lineHeight: '1.18', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 1.3rem + 2vw, 2.75rem)', { lineHeight: '1.22', letterSpacing: '-0.015em' }],
        'display-sm': ['clamp(1.375rem, 1.15rem + 1.1vw, 1.875rem)', { lineHeight: '1.3' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(16, 27, 51, 0.04)',
        soft: '0 1px 2px rgba(16, 27, 51, 0.04), 0 6px 16px -10px rgba(16, 27, 51, 0.14)',
        card: '0 2px 4px rgba(16, 27, 51, 0.035), 0 14px 30px -20px rgba(16, 27, 51, 0.22)',
        lift: '0 4px 8px rgba(16, 27, 51, 0.05), 0 28px 48px -30px rgba(16, 27, 51, 0.28)',
        panel: '0 30px 70px -35px rgba(16, 27, 51, 0.35)',
        ring: '0 0 0 4px rgba(74, 115, 232, 0.14)',
        'ring-danger': '0 0 0 4px rgba(220, 43, 69, 0.14)',
        'inner-top': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.7)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(-100%)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        shimmer: 'shimmer 1.8s infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        content: '80rem',
      },
      spacing: {
        13: '3.25rem',
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};

export default config;