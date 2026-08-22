'use client';

import { Box, Column, Row, Text } from '@umami/react-zen';

const SHADES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const;

export function PaletteSwatchesExample() {
  return (
    <Row gap="2" wrap="wrap">
      {SHADES.map(shade => (
        <Column key={shade} gap="1" alignItems="center">
          <Box
            width="12"
            height="12"
            borderRadius="md"
            border
            style={{ backgroundColor: `var(--gray-${shade})` }}
          />
          <Text size="xs" color="muted">
            {shade}
          </Text>
        </Column>
      ))}
    </Row>
  );
}
