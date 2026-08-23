import type { HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLOListElement> {
  isDisabled?: boolean;
}

export interface BreadcrumbProps extends LiHTMLAttributes<HTMLLIElement> {
  isDisabled?: boolean;
}

export function Breadcrumbs({ children, className, isDisabled, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        {...props}
        aria-disabled={isDisabled || undefined}
        className={cn('flex items-center gap-3', className)}
      >
        {children}
      </ol>
    </nav>
  );
}

export function Breadcrumb({ children, className, isDisabled, ...props }: BreadcrumbProps) {
  return (
    <li
      {...props}
      aria-disabled={isDisabled || undefined}
      className={cn(
        'flex items-center text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] gap-3 list-none',
        '[&_a]:text-foreground-muted [&_a]:no-underline [&_a]:font-normal',
        '[&_a:hover]:text-foreground-primary',
        'last:[&>span]:hidden',
        className,
      )}
    >
      {children as ReactNode}
      <Icon className="text-foreground-muted" size="xs">
        <ChevronRight />
      </Icon>
    </li>
  );
}
