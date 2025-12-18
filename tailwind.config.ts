import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-editorial-900',
    'bg-editorial-800',
    'bg-editorial-700',
    'text-editorial-900',
    'text-editorial-800',
    'text-editorial-700',
    'hover:bg-editorial-800',
    'hover:text-editorial-800',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Forbes-style editorial colors
        editorial: {
          900: '#1a1a1a',
          800: '#2d2d2d',
          700: '#404040',
        },
        rating: {
          excellent: '#10b981',
          'very-good': '#f59e0b',
          good: '#6b7280',
        },
      },
      fontFamily: {
        sans: [
          'EuclidCircularB',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        euclid: ['EuclidCircularB', 'sans-serif'],
      },
      fontSize: {
        editorial: ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'card-title': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
}
export default config

