import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      colors: {
        terminal: {
          bg: '#0a0a0f',
          surface: '#0d1117',
          elevated: '#161b22',
          border: '#21262d',
          'border-strong': '#30363d',
          cyan: '#00f5ff',
          green: '#39ff14',
          amber: '#ffb300',
          red: '#ff4040',
          'text-primary': '#e6edf3',
          'text-secondary': '#8b949e',
          'text-muted': '#484f58',
        },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
