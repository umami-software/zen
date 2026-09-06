import type { HTMLAttributes } from 'react';
import { cn } from './lib/tailwind';

export type KbdProps = HTMLAttributes<HTMLElement>;

export function Kbd({ className, children, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-1',
        'text-sm font-mono text-fg',
        'px-1.5 py-0.5 rounded border border-edge bg-surface-raised shadow-sm',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
