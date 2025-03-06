
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        powerGrotesk: ['var(--font-power-grotesk)', 'sans-serif'],
      },
      
      screens: {
        sm: {
          min: '0px',
          max: '767px',
        },
        md: {
          min: '768px',
          max: '1219px',
        },
        lg: {
          min: '1220px',
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: '0 0',
          },
          to: {
            backgroundPosition: '-200% 0',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
