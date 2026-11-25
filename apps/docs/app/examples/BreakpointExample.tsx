'use client';

import { Column, Text, useBreakpoint } from '@umami/react-zen';

export function BreakpointExample() {
  const breakpoint = useBreakpoint();

  return (
    <Column gap="2">
      <Text>
        Current breakpoint:{' '}
        <Text as="span" weight="bold">
          {breakpoint || 'loading...'}
        </Text>
      </Text>
      <Text size="sm" color="muted">
        Resize the window to see it change.
      </Text>
    </Column>
  );
}
