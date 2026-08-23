import { Box, Column, Heading, Row, Text, ThemeButton } from '@umami/react-zen';
import { PaletteSwitcher } from '../../app/components/PaletteSwitcher';
import { PlaygroundExample } from '../../app/examples';

export const frontmatter = {
  title: 'Playground',
  description: 'Experiment with CSS variables to customize the look and feel of Zen components.',
};

export default function PlaygroundPage() {
  return (
    <Box paddingY="8">
      <Column gap="6" maxWidth="980px" marginX="auto">
        <Column gap="2">
          <Heading as="h1" size="6xl" weight="bold">
            Playground
          </Heading>
          <Text color="muted">
            Experiment with CSS variables to customize the look and feel of Zen components. Changes
            are applied in real-time to the preview panel.
          </Text>
        </Column>
        <Row justifyContent="flex-end" alignItems="center" gap="4">
          <Row alignItems="center" gap="2">
            <Text size="sm" color="muted">
              Palette
            </Text>
            <PaletteSwitcher />
          </Row>
          <Row alignItems="center" gap="2">
            <Text size="sm" color="muted">
              Theme
            </Text>
            <ThemeButton variant="outline" />
          </Row>
        </Row>
        <PlaygroundExample />
      </Column>
    </Box>
  );
}
