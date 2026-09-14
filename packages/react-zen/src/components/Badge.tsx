import type { HTMLAttributes, ReactNode } from 'react';
import { type RenderProp, resolveRender } from './lib/render';
import { cn } from './lib/tailwind';
import { type BadgeVariants, badge } from './variants';

export interface BadgeRenderProps {
  className: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariants['variant'];
  size?: BadgeVariants['size'];
  /** Replace the rendered element, e.g. `render={<a href="/x" />}`. */
  render?: RenderProp<BadgeRenderProps>;
}

export function Badge({ variant, size, render, className, children, ...props }: BadgeProps) {
  const classes = cn(
    badge({ variant, size }),
    'w-fit shrink-0 justify-center overflow-hidden whitespace-nowrap',
    'outline-none transition-[color,box-shadow]',
    '[&>svg]:size-3 [&>svg]:pointer-events-none',
    'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
    'aria-invalid:border-status-error aria-invalid:ring-status-error/20',
    '[a&]:cursor-pointer [a&]:no-underline [a&]:hover:opacity-90',
    className,
  );

  return resolveRender(
    render,
    { ...props, className: classes, children, 'data-slot': 'badge' },
    <span {...props} data-slot="badge" data-variant={variant ?? 'default'} className={classes}>
      {children}
    </span>,
  );
}
