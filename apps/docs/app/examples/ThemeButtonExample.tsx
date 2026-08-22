'use client';

import { Box, Row, Text, ThemeButton } from '@umami/react-zen';
import { useRef } from 'react';

export function ThemeButtonExample() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={containerRef}
      padding="6"
      border
      borderRadius="lg"
      backgroundColor="surface-base"
      width="100%"
      data-theme="dark"
    >
      <Row alignItems="center" justifyContent="space-between" gap="6">
        <Text color="primary">This container has its own theme</Text>
        <ThemeButton variant="outline" target={containerRef} />
      </Row>
    </Box>
  );
}
