'use client';

import { Box, type BoxProps, Column, Grid, Text } from '@umami/react-zen';

type BackgroundColor = BoxProps['backgroundColor'];
type FontColor = BoxProps['color'];

const TOKENS: { background: BackgroundColor; foreground?: FontColor }[] = [
  { background: 'background', foreground: 'foreground' },
  { background: 'page', foreground: 'foreground' },
  { background: 'card', foreground: 'card-foreground' },
  { background: 'popover', foreground: 'popover-foreground' },
  { background: 'primary', foreground: 'primary-foreground' },
  { background: 'secondary', foreground: 'secondary-foreground' },
  { background: 'muted', foreground: 'muted' },
  { background: 'accent', foreground: 'accent-foreground' },
  { background: 'destructive' },
  { background: 'success' },
  { background: 'warning' },
  { background: 'info' },
  { background: 'foreground', foreground: 'background' },
];

export function ThemeTokensExample() {
  return (
    <Grid columns={{ base: '2', md: '4' }} gap="4" width="100%">
      {TOKENS.map(({ background, foreground }) => (
        <Column key={String(background)} gap="2">
          <Box
            backgroundColor={background}
            color={foreground}
            border
            borderRadius="md"
            height="16"
            display="block"
            padding="3"
          >
            {foreground && (
              <Text size="lg" weight="semibold" color={foreground}>
                Aa
              </Text>
            )}
          </Box>
          <Column>
            <Text size="xs" weight="medium">
              {String(background)}
            </Text>
            {foreground && (
              <Text size="xs" color="muted">
                {String(foreground)}
              </Text>
            )}
          </Column>
        </Column>
      ))}
    </Grid>
  );
}
