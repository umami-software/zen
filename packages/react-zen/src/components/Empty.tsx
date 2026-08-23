import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from './lib/tailwind';
import { type EmptyMediaVariants, emptyMedia } from './variants';

export const Empty = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12',
        className,
      )}
    />
  ),
);

Empty.displayName = 'Empty';

export const EmptyHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="empty-header"
      className={cn('flex max-w-sm flex-col items-center gap-2 text-center', className)}
    />
  ),
);

EmptyHeader.displayName = 'EmptyHeader';

export interface EmptyMediaProps extends HTMLAttributes<HTMLDivElement>, EmptyMediaVariants {}

export const EmptyMedia = forwardRef<HTMLDivElement, EmptyMediaProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="empty-icon"
      className={emptyMedia({ variant, className })}
    />
  ),
);

EmptyMedia.displayName = 'EmptyMedia';

export const EmptyTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="empty-title"
      className={cn(
        'text-[length:var(--zen-font-size-lg)]/[var(--zen-line-height-lg)] font-medium tracking-tight',
        className,
      )}
    />
  ),
);

EmptyTitle.displayName = 'EmptyTitle';

export const EmptyDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    {...props}
    ref={ref}
    data-slot="empty-description"
    className={cn(
      'text-foreground-muted [&>a:hover]:text-foreground-primary text-[length:var(--zen-font-size-sm)]/relaxed [&>a]:underline [&>a]:underline-offset-4',
      className,
    )}
  />
));

EmptyDescription.displayName = 'EmptyDescription';

export const EmptyContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)] text-balance',
        className,
      )}
    />
  ),
);

EmptyContent.displayName = 'EmptyContent';
