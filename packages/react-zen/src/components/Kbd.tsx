import type { HTMLAttributes } from 'react';
import { cn } from './lib/tailwind';

export type KbdProps = HTMLAttributes<HTMLElement>;

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      data-slot="kbd"
      className={cn(
        'pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1',
        'rounded-sm bg-interactive px-1 font-sans text-xs font-medium text-fg-muted',
        "[&_svg:not([class*='size-'])]:size-3",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export type KbdGroupProps = HTMLAttributes<HTMLElement>;

export function KbdGroup({ className, children, ...props }: KbdGroupProps) {
  return (
    <kbd
      {...props}
      data-slot="kbd-group"
      className={cn('inline-flex items-center gap-1', className)}
    >
      {children}
    </kbd>
  );
}
