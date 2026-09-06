import { type HTMLAttributes, useState } from 'react';
import { ChevronLeft, ChevronRight, Ellipsis } from '@/components/icons';
import { Button } from './Button';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  pageCount?: number;
  totalItems?: number;
  pageSize?: number;
  page?: number;
  defaultPage?: number;
  siblingCount?: number;
  isDisabled?: boolean;
  onChange?: (page: number) => void;
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

  return (
    <nav {...props} aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      <Button
        variant="quiet"
        aria-label="Previous page"
        isDisabled={isDisabled || currentPage <= 1}
        onPress={() => setPage(currentPage - 1)}
      >
        <Icon size="sm">
          <ChevronLeft />
        </Icon>
      </Button>
      {getPageRange(count, currentPage, siblingCount).map((item, index) =>
        item === 'ellipsis' ? (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: ellipsis positions are stable
            key={`ellipsis-${index}`}
            className="flex items-center justify-center size-9 text-fg-muted"
            aria-hidden="true"
          >
            <Icon size="sm">
              <Ellipsis />
            </Icon>
          </span>
        ) : (
          <Button
            key={item}
            variant={item === currentPage ? 'outline' : 'quiet'}
            aria-current={item === currentPage ? 'page' : undefined}
            aria-label={`Page ${item}`}
            isDisabled={isDisabled}
            className="min-w-9 tabular-nums"
            onPress={() => setPage(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        variant="quiet"
        aria-label="Next page"
        isDisabled={isDisabled || currentPage >= count}
        onPress={() => setPage(currentPage + 1)}
      >
        <Icon size="sm">
          <ChevronRight />
        </Icon>
      </Button>
    </nav>
  );
}
