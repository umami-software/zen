import { Button, Column, Heading, Text } from '@umami/react-zen';
import { Link } from '@umami/shiso/components';

export const frontmatter = {
  title: 'Zen',
  description: 'A complete design system and component library.',
};

export default function HomePage() {
  return (
    <Column alignItems="center" gap="6" paddingY="24" paddingX="6" maxWidth="980px" marginX="auto">
      <Heading as="h1" size="4xl" align="center">
        Build beautiful, consistent UI
      </Heading>
      <Text size="lg" color="muted" align="center" style={{ maxWidth: '600px' }}>
        Zen is a complete design system and component library — accessible components, layout
        primitives, and design tokens.
      </Text>
      <Button variant="primary" render={<Link to="/docs" />}>
        Get Started
      </Button>
    </Column>
  );
}
