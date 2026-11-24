'use client';

import { Box, Column, Row, Text } from '@umami/react-zen';

const TOKENS = [
  'background',
  'muted',
  'border',
  'ring',
  'muted-foreground',
  'primary',
  'foreground',
] as const;

/** The current palette's neutral tokens. Updates live when the palette or theme changes. */
export function PaletteSwatchesExample() {
  return (
    <Row gap="3" wrap="wrap" justifyContent="center">
      {TOKENS.map(token => (
        <Column key={token} gap="1" alignItems="center">
          <Box
            width="12"
            height="12"
            borderRadius="md"
            border
            style={{ backgroundColor: `var(--${token})` }}
          />
          <Text size="xs" color="muted-foreground">
            {token}
          </Text>
        </Column>
      ))}
    </Row>
  );
}
