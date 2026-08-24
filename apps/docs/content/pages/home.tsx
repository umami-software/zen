import { Button, Column, Heading, Text } from '@umami/react-zen';

export const frontmatter = {
  title: 'Zen',
  description: 'The design system and React components used by Umami.',
};

// Shiso does not yet expose its router Link; drive its BrowserRouter via the
// history API so the CTA navigates client-side. Swap for shiso's Link once
// @umami/shiso/components exports one.
function navigateClientSide(event: React.MouseEvent<HTMLElement>) {
  const href = event.currentTarget.getAttribute('href');
  if (!href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
  event.preventDefault();
  window.history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export default function HomePage() {
  return (
    <Column alignItems="center" gap="6" paddingY="24" paddingX="6" maxWidth="980px" marginX="auto">
      <Heading as="h1" size="4xl" align="center">
        Build beautiful, consistent UI
      </Heading>
      <Text size="lg" color="muted" align="center" style={{ maxWidth: '600px' }}>
        Zen is the complete design system and component library — accessible components, layout
        primitives, and design tokens.
      </Text>
      <Button variant="primary" href="/docs" onPress={navigateClientSide}>
        Get Started
      </Button>
    </Column>
  );
}
