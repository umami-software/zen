import type { Config } from 'tailwindcss';
import preset from './tailwind.preset';

export default {
  ...preset,
  content: ['./src/components/**/*.{ts,tsx}'],
} satisfies Config;
