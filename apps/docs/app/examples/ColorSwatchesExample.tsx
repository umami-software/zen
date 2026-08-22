'use client';

import { Box, Column, Row, Text } from '@umami/react-zen';

const COLORS = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
] as const;

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

export function ColorSwatchesExample() {
  return (
    <Column gap="3">
      {COLORS.map(color => (
        <Row key={color} gap="1" alignItems="center">
          <Text style={{ width: 70 }}>{color}</Text>
          <Row gap="1">
            {SHADES.map(shade => (
              <Box
                key={shade}
                width="8"
                height="8"
                borderRadius="md"
                backgroundColor={`${color}-${shade}`}
              />
            ))}
          </Row>
        </Row>
      ))}
    </Column>
  );
}
