import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        clawckie: '#FF6B00',
        coach: '#00CC44',
        kince: '#B388FF',
        tremendous: '#FF1493',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.98' },
          '94%': { opacity: '1' },
          '96%': { opacity: '0.97' },
          '97%': { opacity: '1' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulse_glow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        walk: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      animation: {
        flicker: 'flicker 8s infinite',
        blink: 'blink 1s step-end infinite',
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
        walk: 'walk 3s linear infinite',
        scanline: 'scanline 8s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
