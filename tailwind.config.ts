import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        atlas: {
          bg: '#F7F3EE',
          ink: '#1E1C1A',
          accent: '#7B4D2A',
          muted: '#D8CCBE'
        }
      }
    }
  },
  plugins: []
} satisfies Config;
