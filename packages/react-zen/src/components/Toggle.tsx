import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from '@base-ui/react/toggle';
import { useId } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Label } from './Label';

export const toggleVariants = tv({
  base: [
    'inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap',
    'rounded text-sm font-medium cursor-pointer outline-none',
    'transition-[color,background-color,box-shadow,border-color]',
    'hover:bg-interactive-hover',
    'data-pressed:bg-interactive data-pressed:text-fg',
    'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    'aria-invalid:border-status-error aria-invalid:ring-status-error/20',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  variants: {
    variant: {
      default: 'bg-transparent border border-transparent',
      outline: 'bg-surface border border-edge shadow-xs',
      /** @deprecated Kept for backward compatibility with `<ToggleGroup variant="primary" />`. */
      primary: [
        'bg-transparent border border-transparent',
        'data-pressed:bg-primary data-pressed:text-primary-fg',
      ],
    },
    size: {
      sm: 'h-8 min-w-8 px-1.5',
      md: 'h-9 min-w-9 px-2',
      lg: 'h-10 min-w-10 px-2.5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type ToggleVariants = VariantProps<typeof toggleVariants>;

export interface ToggleProps
  extends Omit<BaseToggleProps<string>, 'defaultValue' | 'onChange'>,
    ToggleVariants {
  className?: string;
  label?: string;
  value?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (selected: boolean) => void;
}

export function Toggle({
  label,
  children,
  className,
  variant,
  size,
  pressed,
  defaultPressed,
  disabled,
  isSelected,
  defaultSelected,
  isDisabled,
  onChange,
  onPressedChange,
  ...props
}: ToggleProps) {
  const labelId = useId();

  const toggle = (
    <BaseToggle
      {...props}
      data-slot="toggle"
      aria-labelledby={label ? labelId : props['aria-labelledby']}
      pressed={pressed ?? isSelected}
      defaultPressed={defaultPressed ?? defaultSelected}
      disabled={disabled ?? isDisabled}
      onPressedChange={(nextPressed, event) => {
        onPressedChange?.(nextPressed, event);
        onChange?.(nextPressed);
      }}
      className={toggleVariants({ variant, size, className })}
    >
      {children}
    </BaseToggle>
  );

  if (label) {
    return (
      <div className="inline-flex flex-col gap-1">
        <Label id={labelId}>{label}</Label>
        {toggle}
      </div>
    );
  }

  return toggle;
}
