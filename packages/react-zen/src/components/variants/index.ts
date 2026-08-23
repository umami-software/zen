import { tv, type VariantProps } from 'tailwind-variants';

// Button variants
export const button = tv({
  base: [
    'inline-flex items-center justify-center gap-3 whitespace-nowrap',
    'font-medium rounded border border-transparent cursor-pointer',
    'transition-colors leading-normal relative no-underline',
    'outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base',
  ],
  variants: {
    variant: {
      default: [
        'bg-interactive text-foreground-primary',
        'hover:bg-interactive-hover',
        'pressed:bg-interactive-pressed',
        'disabled:text-foreground-disabled',
      ],
      primary: [
        'bg-primary text-primary-foreground',
        'hover:opacity-90',
        'pressed:opacity-80',
        'disabled:opacity-50',
      ],
      outline: [
        'bg-surface-base border-edge shadow-sm text-foreground-primary',
        'hover:border-edge-strong',
        'pressed:bg-surface-raised',
        'disabled:bg-surface-disabled disabled:text-foreground-disabled',
      ],
      quiet: [
        'bg-transparent',
        'hover:bg-interactive',
        'pressed:bg-interactive-hover',
        'disabled:text-foreground-disabled',
      ],
      danger: [
        'bg-status-error text-white',
        'hover:opacity-90',
        'pressed:opacity-80',
        'disabled:opacity-50',
      ],
      zero: [
        'bg-transparent border-0',
        'hover:bg-transparent',
        'pressed:bg-transparent',
        'disabled:text-foreground-disabled',
      ],
    },
    size: {
      xs: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)] py-1 px-2',
      sm: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] py-1.5 px-2.5',
      md: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] py-2 px-3',
      lg: 'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)] py-2.5 px-4',
      xl: 'text-[length:var(--zen-font-size-xl)]/[var(--zen-line-height-xl)] py-3 px-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof button>;

// Input field variants (TextField, SearchField, PasswordField, etc.)
export const inputField = tv({
  base: [
    'relative flex items-center',
    'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] rounded border border-edge bg-surface-base shadow-sm',
    'leading-6 text-foreground-primary transition-colors',
    'focus-within:border-edge-strong',
    'has-[input:read-only]:bg-surface-raised has-[textarea:read-only]:bg-surface-raised',
    'has-[:disabled]:bg-surface-disabled has-[:disabled]:opacity-50',
  ],
  variants: {
    variant: {
      default: '',
      quiet:
        'rounded-none border-transparent bg-transparent shadow-none focus-within:border-b-edge focus-within:border-x-transparent focus-within:border-t-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type InputFieldVariants = VariantProps<typeof inputField>;

// List item variants (Menu, List, Select items)
export const listItem = tv({
  base: [
    'flex items-center justify-between',
    'gap-3 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] py-2 px-3 min-w-[120px]',
    'cursor-pointer outline-none rounded',
    'text-foreground-primary',
    'hovered:bg-interactive',
    'focused:bg-interactive',
    'focus-visible:bg-interactive',
    'disabled:text-foreground-disabled disabled:cursor-default',
    'selected:font-semibold',
  ],
});

export type ListItemVariants = VariantProps<typeof listItem>;

// Overlay/backdrop variants
export const overlay = tv({
  base: ['zen-layer-modal fixed inset-0', 'bg-black/80 flex items-center justify-center'],
});

// Modal variants
export const modal = tv({
  base: 'relative',
  variants: {
    position: {
      center: '',
      fullscreen: 'w-dvw h-dvh rounded-none',
    },
  },
  defaultVariants: {
    position: 'center',
  },
});

export type ModalVariants = VariantProps<typeof modal>;

// Popover variants
export const popover = tv({
  base: ['bg-surface-overlay border border-edge-muted rounded-lg shadow-lg p-4'],
  variants: {
    placement: {
      top: '[--tw-translate:translateY(8px)]',
      bottom: '[--tw-translate:translateY(-8px)]',
      left: '[--tw-translate:translateX(8px)]',
      right: '[--tw-translate:translateX(-8px)]',
    },
  },
});

export type PopoverVariants = VariantProps<typeof popover>;

// Tooltip variants
export const tooltip = tv({
  base: [
    'bg-surface-inverted text-surface-base text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] px-2 py-1 rounded',
  ],
});

// Checkbox variants
export const checkbox = tv({
  slots: {
    root: [
      'group flex items-center gap-3',
      'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] cursor-pointer',
      'disabled:text-foreground-disabled disabled:cursor-default',
    ],
    box: [
      'flex items-center justify-center',
      'w-5 h-5 rounded border border-edge bg-surface-base',
      'shadow-sm transition-colors',
      'group-data-[checked]:bg-primary group-data-[checked]:border-primary group-data-[checked]:text-primary-foreground',
      'group-indeterminate:bg-surface-base group-indeterminate:text-foreground-primary',
      'group-disabled:bg-surface-disabled',
      'group-focus-visible:ring-2 group-focus-visible:ring-focus-ring group-focus-visible:ring-offset-1',
    ],
    icon: [
      'hidden',
      'group-data-[checked]:flex',
      'group-indeterminate:flex',
      'items-center justify-center',
    ],
  },
});

export type CheckboxVariants = VariantProps<typeof checkbox>;

// Switch variants
export const switchVariant = tv({
  slots: {
    root: [
      'group flex items-center gap-3',
      'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] cursor-pointer',
      'disabled:opacity-50 disabled:cursor-default',
    ],
    track: [
      'flex items-center w-10 h-6 px-1 rounded-full',
      'bg-interactive',
      'transition-colors',
      'group-data-[checked]:bg-primary',
      'group-focus-visible:ring-2 group-focus-visible:ring-focus-ring group-focus-visible:ring-offset-1',
    ],
    thumb: [
      'w-4 h-4 rounded-full',
      'bg-surface-base shadow-sm',
      'transition-transform',
      'group-data-[checked]:translate-x-4',
    ],
  },
});

export type SwitchVariants = VariantProps<typeof switchVariant>;

// Tabs variants
export const tabs = tv({
  slots: {
    root: 'flex flex-col',
    list: ['flex gap-1 border-b border-edge-muted'],
    tab: [
      'px-4 py-2 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-medium cursor-pointer',
      'text-foreground-muted outline-none',
      'border-b-2 border-transparent -mb-px',
      'hovered:text-foreground-primary',
      'selected:text-foreground-primary selected:border-primary',
      'disabled:text-foreground-disabled disabled:cursor-default',
      'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
    ],
    panel: 'py-4',
  },
});

export type TabsVariants = VariantProps<typeof tabs>;

// Text variants
export const text = tv({
  base: 'text-foreground-primary',
  variants: {
    size: {
      xs: 'text-[length:var(--zen-font-size-xs)]/[var(--zen-line-height-xs)]',
      sm: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
      base: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
      lg: 'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)]',
      xl: 'text-[length:var(--zen-font-size-xl)]/[var(--zen-line-height-xl)]',
      '2xl': 'text-[length:var(--zen-font-size-2xl)]/[var(--zen-line-height-2xl)]',
      '3xl': 'text-[length:var(--zen-font-size-3xl)]/[var(--zen-line-height-3xl)]',
      '4xl': 'text-[length:var(--zen-font-size-4xl)]/[var(--zen-line-height-4xl)]',
    },
    color: {
      default: '',
      muted: 'text-foreground-muted',
      disabled: 'text-foreground-disabled',
    },
    weight: {
      thin: 'font-thin',
      extralight: 'font-extralight',
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export type TextVariants = VariantProps<typeof text>;

// Heading variants
export const heading = tv({
  base: 'font-semibold text-foreground-primary',
  variants: {
    size: {
      sm: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
      base: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
      lg: 'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)]',
      xl: 'text-[length:var(--zen-font-size-xl)]/[var(--zen-line-height-xl)]',
      '2xl': 'text-[length:var(--zen-font-size-2xl)]/[var(--zen-line-height-2xl)]',
      '3xl': 'text-[length:var(--zen-font-size-3xl)]/[var(--zen-line-height-3xl)]',
      '4xl': 'text-[length:var(--zen-font-size-4xl)]/[var(--zen-line-height-4xl)]',
      '5xl': 'text-[length:var(--zen-font-size-5xl)]/[var(--zen-line-height-5xl)]',
      '6xl': 'text-[length:var(--zen-font-size-6xl)]/[var(--zen-line-height-6xl)]',
    },
  },
  defaultVariants: {
    size: '2xl',
  },
});

export type HeadingVariants = VariantProps<typeof heading>;

// Alert variants
export const alert = tv({
  base: [
    'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border border-edge-muted px-4 py-3 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
    'has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3',
    '[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  ],
  variants: {
    variant: {
      default: 'bg-surface-base text-foreground-primary',
      danger: [
        'border-status-error bg-surface-base text-status-error',
        '*:data-[slot=alert-description]:text-status-error/90',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type AlertVariants = VariantProps<typeof alert>;

// Empty media variants
export const emptyMedia = tv({
  base: "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-6",
  variants: {
    variant: {
      default: 'bg-transparent',
      icon: "bg-surface-raised text-foreground-primary flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type EmptyMediaVariants = VariantProps<typeof emptyMedia>;

// Status light variants
export const statusLight = tv({
  base: 'inline-flex items-center gap-2',
  slots: {
    dot: 'w-2 h-2 rounded-full',
    label: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
  },
  variants: {
    color: {
      gray: { dot: 'bg-content-muted' },
      green: { dot: 'bg-status-success' },
      yellow: { dot: 'bg-status-warning' },
      red: { dot: 'bg-status-error' },
      blue: { dot: 'bg-status-info' },
    },
  },
  defaultVariants: {
    color: 'gray',
  },
});

export type StatusLightVariants = VariantProps<typeof statusLight>;

// Toast variants
export const toast = tv({
  base: [
    'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
    'bg-surface-overlay',
    'border border-edge-muted',
    'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
  ],
  variants: {
    variant: {
      default: '',
      success: 'bg-status-success-bg text-status-success-text',
      error: 'bg-status-error-bg text-status-error-text',
    },
  },
});

export type ToastVariants = VariantProps<typeof toast>;

// Badge variants
export const badge = tv({
  base: [
    'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
    'border border-transparent',
  ],
  variants: {
    variant: {
      default: 'bg-interactive text-foreground-primary',
      primary: 'bg-primary text-primary-foreground',
      outline: 'bg-transparent border-edge text-foreground-primary',
      success: 'bg-status-success-bg text-status-success-text',
      warning: 'bg-status-warning-bg text-status-warning-text',
      error: 'bg-status-error-bg text-status-error-text',
      info: 'bg-status-info-bg text-status-info-text',
      // Tailwind base color palette (soft tint + readable text, dark-mode aware)
      slate: 'bg-slate-50 text-slate-900 dark:bg-slate-500/20 dark:text-slate-100',
      gray: 'bg-gray-50 text-gray-900 dark:bg-gray-500/20 dark:text-gray-100',
      zinc: 'bg-zinc-50 text-zinc-900 dark:bg-zinc-500/20 dark:text-zinc-100',
      neutral: 'bg-neutral-50 text-neutral-900 dark:bg-neutral-500/20 dark:text-neutral-100',
      stone: 'bg-stone-50 text-stone-900 dark:bg-stone-500/20 dark:text-stone-100',
      red: 'bg-red-50 text-red-900 dark:bg-red-500/20 dark:text-red-100',
      orange: 'bg-orange-50 text-orange-900 dark:bg-orange-500/20 dark:text-orange-100',
      amber: 'bg-amber-50 text-amber-900 dark:bg-amber-500/20 dark:text-amber-100',
      yellow: 'bg-yellow-50 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-100',
      lime: 'bg-lime-50 text-lime-900 dark:bg-lime-500/20 dark:text-lime-100',
      green: 'bg-green-50 text-green-900 dark:bg-green-500/20 dark:text-green-100',
      emerald: 'bg-emerald-50 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-100',
      teal: 'bg-teal-50 text-teal-900 dark:bg-teal-500/20 dark:text-teal-100',
      cyan: 'bg-cyan-50 text-cyan-900 dark:bg-cyan-500/20 dark:text-cyan-100',
      sky: 'bg-sky-50 text-sky-900 dark:bg-sky-500/20 dark:text-sky-100',
      blue: 'bg-blue-50 text-blue-900 dark:bg-blue-500/20 dark:text-blue-100',
      indigo: 'bg-indigo-50 text-indigo-900 dark:bg-indigo-500/20 dark:text-indigo-100',
      violet: 'bg-violet-50 text-violet-900 dark:bg-violet-500/20 dark:text-violet-100',
      purple: 'bg-purple-50 text-purple-900 dark:bg-purple-500/20 dark:text-purple-100',
      fuchsia: 'bg-fuchsia-50 text-fuchsia-900 dark:bg-fuchsia-500/20 dark:text-fuchsia-100',
      pink: 'bg-pink-50 text-pink-900 dark:bg-pink-500/20 dark:text-pink-100',
      rose: 'bg-rose-50 text-rose-900 dark:bg-rose-500/20 dark:text-rose-100',
    },
    size: {
      sm: 'text-[length:var(--zen-font-size-xs)]/[var(--zen-line-height-xs)] px-2 py-0.5',
      md: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)] px-2.5 py-0.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type BadgeVariants = VariantProps<typeof badge>;

// Avatar variants
export const avatar = tv({
  slots: {
    root: [
      'relative inline-flex items-center justify-center shrink-0 select-none',
      'overflow-hidden rounded-full align-middle bg-interactive',
    ],
    image: 'size-full object-cover',
    fallback: [
      'flex size-full items-center justify-center',
      'font-medium text-foreground-primary uppercase',
    ],
  },
  variants: {
    size: {
      xs: {
        root: 'size-6',
        fallback: 'text-[length:var(--zen-font-size-xs)]/[var(--zen-line-height-xs)]',
      },
      sm: {
        root: 'size-8',
        fallback: 'text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
      },
      md: {
        root: 'size-10',
        fallback: 'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
      },
      lg: {
        root: 'size-12',
        fallback: 'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)]',
      },
      xl: {
        root: 'size-16',
        fallback: 'text-[length:var(--zen-font-size-xl)]/[var(--zen-line-height-xl)]',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type AvatarVariants = VariantProps<typeof avatar>;

// Tag variants
export const tag = tv({
  slots: {
    base: [
      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
      'cursor-default outline-none',
      'focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-1',
    ],
    removeButton: [
      'flex items-center justify-center rounded-full p-0.5 -mr-1',
      'cursor-pointer outline-none',
      'hover:bg-black/10 dark:hover:bg-white/10',
      'pressed:bg-black/20 dark:pressed:bg-white/20',
    ],
  },
  variants: {
    variant: {
      default: {
        base: 'bg-interactive text-foreground-primary',
      },
      outline: {
        base: 'bg-transparent border border-edge text-foreground-primary',
      },
      primary: {
        base: 'bg-primary text-primary-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type TagVariants = VariantProps<typeof tag>;
