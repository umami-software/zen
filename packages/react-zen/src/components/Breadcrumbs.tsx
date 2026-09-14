import {
  Children,
  type ComponentProps,
  Fragment,
  type HTMLAttributes,
  isValidElement,
  type LiHTMLAttributes,
  type ReactNode,
} from 'react';
import { ChevronRight, Ellipsis } from '@/components/icons';
import { type RenderProp, resolveRender } from './lib/render';
import { cn } from './lib/tailwind';

/* -------------------------------------------------------------------------- */
/*                                   Parts                                     */
/* -------------------------------------------------------------------------- */

export interface BreadcrumbListProps extends HTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return (
    <ol
      {...props}
      data-slot="breadcrumb-list"
      className={cn('flex flex-wrap items-center gap-3 text-sm wrap-break-word', className)}
    />
  );
}

export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return (
    <li
      {...props}
      data-slot="breadcrumb-item"
      className={cn('inline-flex items-center gap-3 list-none', className)}
    />
  );
}

export interface BreadcrumbLinkRenderProps {
  className: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export interface BreadcrumbLinkProps extends ComponentProps<'a'> {
  render?: RenderProp<BreadcrumbLinkRenderProps>;
}

export function BreadcrumbLink({ className, render, children, ...props }: BreadcrumbLinkProps) {
  const classes = cn(
    'font-normal text-fg-muted no-underline transition-colors rounded',
    'hover:text-fg',
    'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50 outline-none',
    className,
  );

  return resolveRender(
    render,
    { ...props, className: classes, children, 'data-slot': 'breadcrumb-link' },
    <a {...props} data-slot="breadcrumb-link" className={classes}>
      {children}
    </a>,
  );
}

export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return (
    <span
      {...props}
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-fg', className)}
    />
  );
}

export interface BreadcrumbSeparatorProps extends LiHTMLAttributes<HTMLLIElement> {}

export function BreadcrumbSeparator({ children, className, ...props }: BreadcrumbSeparatorProps) {
  return (
    <li
      {...props}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "inline-flex items-center text-fg-muted [&>svg:not([class*='size-'])]:size-3",
        className,
      )}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

export interface BreadcrumbEllipsisProps extends HTMLAttributes<HTMLSpanElement> {}

export function BreadcrumbEllipsis({ className, ...props }: BreadcrumbEllipsisProps) {
  return (
    <span
      {...props}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-4 items-center justify-center text-fg-muted [&>svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      <Ellipsis />
      <span className="sr-only">More</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Convenience API                                */
/* -------------------------------------------------------------------------- */

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  isDisabled?: boolean;
  children?: ReactNode;
  /** Content rendered between items. Defaults to a chevron. */
  separator?: ReactNode;
}

export interface BreadcrumbProps extends LiHTMLAttributes<HTMLLIElement> {
  isDisabled?: boolean;
}

/**
 * Convenience wrapper that renders a `<nav>` + `BreadcrumbList` and inserts a
 * `BreadcrumbSeparator` between each child instead of inside of them.
 */
export function Breadcrumbs({
  children,
  className,
  isDisabled,
  separator,
  ...props
}: BreadcrumbsProps) {
  const items = Children.toArray(children).filter(child => isValidElement(child));

  return (
    <nav
      {...props}
      data-slot="breadcrumb"
      aria-label="Breadcrumb"
      aria-disabled={isDisabled || undefined}
      className={cn(className)}
    >
      <BreadcrumbList>
        {items.map((child, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: breadcrumb positions are stable
          <Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
            {child}
          </Fragment>
        ))}
      </BreadcrumbList>
    </nav>
  );
}

export function Breadcrumb({ children, className, isDisabled, ...props }: BreadcrumbProps) {
  return (
    <BreadcrumbItem
      {...props}
      aria-disabled={isDisabled || undefined}
      className={cn(
        'text-sm',
        '[&_a]:text-fg-muted [&_a]:no-underline [&_a]:font-normal',
        '[&_a:hover]:text-fg',
        isDisabled && 'opacity-50',
        className,
      )}
    >
      {children as ReactNode}
    </BreadcrumbItem>
  );
}
