import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"], .dark'],
  content: ['./src/components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        'spinner-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spinner-dash': {
          '0%': { strokeDasharray: '1, 200', strokeDashoffset: '0' },
          '50%': { strokeDasharray: '89, 200', strokeDashoffset: '-35' },
          '100%': { strokeDasharray: '89, 200', strokeDashoffset: '-124' },
        },
        'icon-pop': {
          from: { transform: 'scale(0.5)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        spin: 'spin 1s linear infinite',
        'spinner-rotate': 'spinner-rotate 1.6s linear infinite',
        'spinner-dash': 'spinner-dash 1.2s ease-in-out infinite',
        'icon-pop': 'icon-pop 200ms ease-out',
      },
      fontFamily: {
        sans: 'var(--zen-font-family)',
        mono: 'var(--zen-font-family-mono)',
      },
      colors: {
        // Primary accent/brand color
        primary: {
          DEFAULT: 'var(--zen-primary)',
          foreground: 'var(--zen-primary-foreground)',
        },
        // Surface colors (backgrounds)
        surface: {
          base: 'var(--zen-surface-base)',
          raised: 'var(--zen-surface-raised)',
          sunken: 'var(--zen-surface-sunken)',
          overlay: 'var(--zen-surface-overlay)',
          inverted: 'var(--zen-surface-inverted)',
          disabled: 'var(--zen-surface-disabled)',
        },
        // Text colors
        foreground: {
          DEFAULT: 'var(--zen-text-primary)',
          primary: 'var(--zen-text-primary)',
          muted: 'var(--zen-text-muted)',
          disabled: 'var(--zen-text-disabled)',
        },
        // Border colors
        edge: {
          DEFAULT: 'var(--zen-border-default)',
          muted: 'var(--zen-border-muted)',
          strong: 'var(--zen-border-strong)',
        },
        // Interactive state colors
        interactive: {
          DEFAULT: 'var(--zen-interactive-bg)',
          hover: 'var(--zen-interactive-bg-hover)',
          pressed: 'var(--zen-interactive-bg-pressed)',
        },
        // Focus colors
        focus: {
          ring: 'var(--zen-focus-ring)',
          offset: 'var(--zen-focus-ring-offset)',
        },
        // Status colors
        status: {
          info: 'var(--zen-status-info)',
          'info-bg': 'var(--zen-status-info-bg)',
          'info-text': 'var(--zen-status-info-text)',
          success: 'var(--zen-status-success)',
          'success-bg': 'var(--zen-status-success-bg)',
          'success-text': 'var(--zen-status-success-text)',
          warning: 'var(--zen-status-warning)',
          'warning-bg': 'var(--zen-status-warning-bg)',
          'warning-text': 'var(--zen-status-warning-text)',
          error: 'var(--zen-status-error)',
          'error-bg': 'var(--zen-status-error-bg)',
          'error-text': 'var(--zen-status-error-text)',
        },
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      // Component state variants
      addVariant('pressed', '&[data-pressed]');
      addVariant('selected', '&[data-selected]');
      addVariant('disabled', '&[data-disabled]');
      addVariant('focused', '&[data-focused]');
      addVariant('focus-visible', '&[data-focus-visible]');
      addVariant('hovered', '&[data-hovered]');
      addVariant('indeterminate', '&[data-indeterminate]');
      addVariant('expanded', '&[data-expanded]');
      addVariant('readonly', '&[data-readonly]');
      addVariant('dragging', '&[data-dragging]');
      addVariant('outside-month', '&[data-outside-month]');

      // Placement variants for Popover/Tooltip
      addVariant('placement-top', "&[data-side='top']");
      addVariant('placement-bottom', "&[data-side='bottom']");
      addVariant('placement-left', "&[data-side='left']");
      addVariant('placement-right', "&[data-side='right']");

      // Orientation variants
      addVariant('orientation-horizontal', "&[data-orientation='horizontal']");
      addVariant('orientation-vertical', "&[data-orientation='vertical']");

      // Group variants for nested state selectors
      addVariant('group-pressed', ':merge(.group)[data-pressed] &');
      addVariant('group-selected', ':merge(.group)[data-selected] &');
      addVariant('group-disabled', ':merge(.group)[data-disabled] &');
      addVariant('group-expanded', ':merge(.group)[data-expanded] &');
      addVariant('group-focus-visible', ':merge(.group)[data-focus-visible] &');
      addVariant('group-indeterminate', ':merge(.group)[data-indeterminate] &');
    }),
  ],
};

export default config;
