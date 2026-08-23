import { Column, Heading, Text, Button } from '@umami/react-zen';

export const frontmatter = {
  title: 'Zen',
  description: 'The design system and React components used by Umami.',
};

export default function HomePage() {
  return (
    <Column alignItems="center" gap="6" paddingY="24" paddingX="6" maxWidth="980px" marginX="auto">
      <Heading as="h1" size="4xl" align="center">
        Build beautiful, consistent UI
      </Heading>
      <Text size="lg" color="muted" align="center" style={{ maxWidth: '600px' }}>
        Zen is the complete design system and component library — accessible components,
        layout primitives, and design tokens.
      </Text>
      <Button href="/docs" variant="primary">
        Get Started
      </Button>
    </Column>
  );
}
