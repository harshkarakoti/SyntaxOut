/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        navy: {
          950: '#020810',
          900: '#050a14',
          800: '#0a1628',
          700: '#0f2040',
          600: '#162a52',
          500: '#1e3a6e',
        },
        cyan: {
          DEFAULT: '#00d4ff',
          50:  '#e0faff',
          100: '#b3f3ff',
          200: '#80ebff',
          300: '#4de3ff',
          400: '#26dbff',
          500: '#00d4ff',
          600: '#00aacf',
          700: '#0080a0',
          800: '#005570',
          900: '#002b40',
        },
        pink: {
          DEFAULT: '#ff0080',
          400: '#ff4da6',
          500: '#ff0080',
          600: '#cc0066',
        },
        emerald: {
          DEFAULT: '#00ff88',
          400: '#33ffaa',
          500: '#00ff88',
          600: '#00cc6e',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      backgroundImage: {
        'dot-grid': 'radial-gradient(circle, rgba(0,212,255,0.08) 1px, transparent 1px)',
        'glow-cyan': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.15), transparent)',
        'glow-pink': 'radial-gradient(ellipse 40% 30% at 80% 50%, rgba(255,0,128,0.08), transparent)',
        'glow-purple': 'radial-gradient(ellipse 50% 40% at 20% 60%, rgba(121,40,202,0.1), transparent)',
        'gradient-border': 'linear-gradient(135deg, rgba(0,212,255,0.5), rgba(121,40,202,0.5), rgba(255,0,128,0.3))',
        'btn-glow': 'linear-gradient(135deg, #00d4ff, #0080a0)',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,212,255,0.25), 0 0 60px rgba(0,212,255,0.1)',
        'glow-cyan-sm': '0 0 10px rgba(0,212,255,0.3)',
        'glow-pink': '0 0 20px rgba(255,0,128,0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 8s ease-in-out infinite 2s',
        'float-slow': 'float 10s ease-in-out infinite 4s',
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'border-spin': 'borderSpin 4s linear infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,212,255,0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0,212,255,0.6), 0 0 50px rgba(0,212,255,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};
