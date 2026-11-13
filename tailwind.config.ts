import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      mobile: '0px',
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px',
    },
    extend: {
      colors: {
        bg: { primary: 'var(--color-bg-primary)' },
        surface: { primary: 'var(--color-surface-primary)', secondary: 'var(--color-surface-secondary)' },
        text: { primary: 'var(--color-text-primary)', secondary: 'var(--color-text-secondary)', placeholder: 'var(--color-text-placeholder)' },
        border: { default: 'var(--color-border-default)' },
        accent: { primary: 'var(--color-accent-primary)' },
        status: { success: 'var(--color-status-success)', danger: 'var(--color-status-danger)', warning: 'var(--color-status-warning)', info: 'var(--color-status-info)' },
        focus: { ring: 'var(--color-focus-ring)' },
      },
      borderRadius: { none: '0px', sm: '4px', md: '8px', lg: '12px', full: '9999px' },
      boxShadow: {
        'elevation-1': '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px 0 rgba(0,0,0,0.06)',
        'elevation-2': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'elevation-3': '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
      },
    },
  },
  plugins: [],
};

export default config;