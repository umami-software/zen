'use client';

import {
  Column,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Text,
} from '@umami/react-zen';
import { type MouseEvent, useState } from 'react';

const PAGE_COUNT = 10;

/** Returns the page numbers to show, with `null` where an ellipsis goes. */
function getPages(page: number, count: number): (number | null)[] {
  if (count <= 7) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, null, count];
  }
  if (page >= count - 3) {
    return [1, null, count - 4, count - 3, count - 2, count - 1, count];
  }
  return [1, null, page - 1, page, page + 1, null, count];
}

export function PaginationExample() {
  const [page, setPage] = useState(1);

  const go = (next: number) => (event: MouseEvent) => {
    event.preventDefault();
    setPage(Math.min(Math.max(next, 1), PAGE_COUNT));
  };

  return (
    <Column gap="3" alignItems="center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={go(page - 1)}
              aria-disabled={page === 1}
              className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
          {getPages(page, PAGE_COUNT).map((value, index) =>
            value === null ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: ellipses have no stable identity
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={value}>
                <PaginationLink href="#" isActive={value === page} onClick={go(value)}>
                  {value}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={go(page + 1)}
              aria-disabled={page === PAGE_COUNT}
              className={page === PAGE_COUNT ? 'pointer-events-none opacity-50' : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <Text size="sm" color="muted">
        Page {page} of {PAGE_COUNT}
      </Text>
    </Column>
  );
}
