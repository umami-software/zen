import {
  type ComponentProps,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from 'react';
import { ChevronLeft, ChevronRight, Ellipsis } from '@/components/icons';
import { Button, type ButtonProps } from './Button';
import { cn } from './lib/tailwind';

/* -------------------------------------------------------------------------- */
/*                                   Parts                                    */
/* -------------------------------------------------------------------------- */

export interface PaginationContentProps extends HTMLAttributes<HTMLUListElement> {}

export function PaginationContent({ className, ...props }: PaginationContentProps) {
  return (
    <ul
      {...props}
      data-slot="pagination-content"
      className={cn('flex list-none items-center gap-1', className)}
    />
  );
}

export interface PaginationItemProps extends HTMLAttributes<HTMLLIElement> {}

export function PaginationItem({ className, ...props }: PaginationItemProps) {
  return <li {...props} data-slot="pagination-item" className={cn('list-none', className)} />;
}

export interface PaginationLinkProps extends Omit<ComponentProps<'a'>, 'color'> {
  isActive?: boolean;
  isDisabled?: boolean;
  size?: ButtonProps['size'];
  children?: ReactNode;
}

/** A pagination control rendered as an anchor but styled as a Button. */
export function PaginationLink({
  className,
  isActive,
  isDisabled,
  size = 'icon',
  children,
  ...props
}: PaginationLinkProps) {
  return (
    <Button
      variant={isActive ? 'outline' : 'quiet'}
      size={size}
      nativeButton={false}
      isDisabled={isDisabled}
      className={cn('tabular-nums no-underline', className)}
      render={
        <a
          data-slot="pagination-link"
          data-active={isActive || undefined}
          aria-current={isActive ? 'page' : undefined}
          {...props}
        />
      }
    >
      {children}
    </Button>
  );
}

export interface PaginationNavProps extends PaginationLinkProps {
  /** Visible label, hidden on small screens. */
  text?: string;
}

export function PaginationPrevious({
  className,
  text = 'Previous',
  size = 'md',
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size={size}
      className={cn('gap-1', className)}
      {...props}
    >
      <ChevronLeft />
      {text ? <span className="hidden sm:block">{text}</span> : null}
    </PaginationLink>
  );
}

export function PaginationNext({
  className,
  text = 'Next',
  size = 'md',
  ...props
}: PaginationNavProps) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size={size}
      className={cn('gap-1', className)}
      {...props}
    >
      {text ? <span className="hidden sm:block">{text}</span> : null}
      <ChevronRight />
    </PaginationLink>
  );
}

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLSpanElement> {}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center text-fg-muted [&>svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      <Ellipsis />
      <span className="sr-only">More pages</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Convenience API                               */
/* -------------------------------------------------------------------------- */

export interface PaginationRenderLinkProps {
  children?: ReactNode;
  'aria-current'?: 'page' | undefined;
  'aria-label'?: string;
  onClick?: (event: MouseEvent) => void;
  [key: string]: unknown;
}

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  pageCount?: number;
  totalItems?: number;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  siblingCount?: number;
  isDisabled?: boolean;
  onChange?: (page: number) => void;
  /**
   * Render each page control with a router aware link. Receives the target page
   * number and the props that must be spread onto the rendered element.
   */
  renderLink?: (page: number, props: PaginationRenderLinkProps) => ReactElement;
}

function getPageRange(
  pageCount: number,
  page: number,
  siblingCount: number,
): (number | 'ellipsis')[] {
  const totalShown = siblingCount * 2 + 5;

  if (pageCount <= totalShown) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const start = Math.max(page - siblingCount, 1);
  const end = Math.min(page + siblingCount, pageCount);
  const showLeftEllipsis = start > 2;
  const showRightEllipsis = end < pageCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', pageCount];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rangeLength = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rangeLength },
      (_, i) => pageCount - rangeLength + i + 1,
    );
    return [1, 'ellipsis', ...rightRange];
  }

  const middleRange = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, 'ellipsis', ...middleRange, 'ellipsis', pageCount];
}

export function Pagination({
  pageCount,
  totalItems,
  pageSize = 10,
  page,
  defaultPage = 1,
  siblingCount = 1,
  isDisabled,
  onChange,
  renderLink,
  className,
  ...props
}: PaginationProps) {
  const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
  const count = Math.max(pageCount ?? Math.ceil((totalItems ?? 0) / pageSize), 1);
  const currentPage = Math.min(Math.max(page ?? uncontrolledPage, 1), count);

  const setPage = (nextPage: number) => {
    const clamped = Math.min(Math.max(nextPage, 1), count);
    if (page === undefined) {
      setUncontrolledPage(clamped);
    }
    onChange?.(clamped);
  };

  const renderPage = (target: number, isActive: boolean, label: string, children: ReactNode) => {
    if (renderLink) {
      return renderLink(target, {
        'aria-current': isActive ? 'page' : undefined,
        'aria-label': label,
        children,
        onClick: () => setPage(target),
      });
    }

    return (
      <PaginationLink
        isActive={isActive}
        isDisabled={isDisabled}
        aria-label={label}
        onClick={() => setPage(target)}
      >
        {children}
      </PaginationLink>
    );
  };

  return (
    <nav
      {...props}
      role="navigation"
      data-slot="pagination"
      aria-label="Pagination"
      className={cn('flex items-center', className)}
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            size="icon"
            text=""
            isDisabled={isDisabled || currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
          />
        </PaginationItem>
        {getPageRange(count, currentPage, siblingCount).map((item, index) =>
          item === 'ellipsis' ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis positions are stable
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              {renderPage(item, item === currentPage, `Page ${item}`, item)}
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            size="icon"
            text=""
            isDisabled={isDisabled || currentPage >= count}
            onClick={() => setPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </nav>
  );
}
