import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type StatusLightVariant = 'success' | 'warning' | 'destructive' | 'info' | 'muted';

export interface StatusLightProps extends HTMLAttributes<HTMLSpanElement> {
  /** Status color of the dot. Defaults to `muted`. */
  variant?: StatusLightVariant;
  /** Any CSS color for the dot. Overrides `variant`. */
  color?: string;
}

const variantClasses: Record<StatusLightVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  destructive: 'bg-destructive',
  info: 'bg-info',
  muted: 'bg-muted-foreground/50',
};

export function StatusLight({
  variant = 'muted',
  color,
  className,
  children,
  ...props
}: StatusLightProps) {
  return (
    <span
      {...props}
      data-slot="status-light"
      data-variant={variant}
      className={cn('inline-flex items-center gap-2 text-sm', className)}
    >
      <span
        data-slot="status-light-dot"
        aria-hidden="true"
        className={cn('size-2 shrink-0 rounded-full', variantClasses[variant])}
        style={color ? { backgroundColor: color } : undefined}
      />
      {children}
    </span>
  );
}
