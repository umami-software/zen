import { Button, Column, Heading, Text } from '@umami/react-zen';
import { Link } from '@umami/shiso/components';

export const frontmatter = {
  title: 'Zen',
  description: 'Umami’s design system for building consistent React interfaces.',
};

export default function HomePage() {
  return (
    <Column alignItems="center" gap="6" paddingY="24" paddingX="6" maxWidth="980px" marginX="auto">
      <Heading as="h1" size="4xl" align="center">
        Zen Design System
      </Heading>
      <Text size="lg" color="muted-foreground" align="center" style={{ maxWidth: '600px' }}>
        Umami’s design system for building consistent React interfaces.
      </Text>
      <Button render={<Link to="/docs" />} nativeButton={false}>
        Read the docs
      </Button>
    </Column>
  );
}
