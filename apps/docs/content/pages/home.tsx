import { Column, Heading, Text } from '@umami/react-zen';
import { Button } from '@umami/shiso/components';

export const frontmatter = {
  title: 'Zen',
  description: 'The design system and React components used by Umami.',
};

export default function HomePage() {
  return (
    <Column alignItems="center" gap="6" paddingY="24" paddingX="6">
      <Heading as="h1" size="6xl" align="center">
        Design, at peace.
      </Heading>
      <Text size="lg" color="muted" align="center" style={{ maxWidth: '600px' }}>
        Zen is the design system and React component library behind Umami — accessible components,
        layout primitives, and design tokens that stay out of your way.
      </Text>
      <Button href="/docs" size="lg">
        Get Started
      </Button>
    </Column>
  );
}
