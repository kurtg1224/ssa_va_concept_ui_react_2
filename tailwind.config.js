/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        ssa: {
          blue: '#105BD8',
          darkBlue: '#0E4FB8',
        }
      },
      boxShadow: {
        'chatbot': '0 4px 20px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'typing': 'typing 1.2s steps(6) infinite',
      },
      keyframes: {
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
};