import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './lib/tailwind';
import { type AlertVariants, alert } from './variants';

export interface AlertProps extends HTMLAttributes<HTMLDivElement>, AlertVariants {}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="alert"
      role="alert"
      className={alert({ variant, className })}
    />
  ),
);

Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="alert-title"
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
    />
  ),
);

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] text-foreground-muted [&_p]:leading-relaxed',
        className,
      )}
    />
  ),
);

AlertDescription.displayName = 'AlertDescription';
