import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#02060f',
          panel: '#091423',
          neon: '#7CFF4D',
          amber: '#ffb347',
        },
      },
      boxShadow: {
        hud: '0 0 20px rgba(124, 255, 77, 0.2)',
      },
      animation: {
        glitch: 'glitch 2.2s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(1px, -1px)' },
          '60%': { transform: 'translate(-1px, -1px)' },
          '80%': { transform: 'translate(1px, 1px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
