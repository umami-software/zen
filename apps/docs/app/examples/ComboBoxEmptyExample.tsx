'use client';

import { ComboBox, Text } from '@umami/react-zen';

export function ComboBoxEmptyExample() {
  return (
    <ComboBox
      placeholder="Type something else"
      items={['One', 'Two', 'Three']}
      renderEmptyState={() => <Text color="muted">Nothing matched your search.</Text>}
    />
  );
}
