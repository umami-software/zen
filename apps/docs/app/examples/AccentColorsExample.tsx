import { Box, Column, Text } from '@umami/react-zen';
import { ACCENT_COLORS } from '../../../../packages/react-zen/src/lib/constants';

export function AccentColorsExample() {
  return ACCENT_COLORS.map(color => (
    <Column key={color} gap="2">
      <Box backgroundColor={color} width="50px" height="50px" borderRadius="md" />
      <Text align="center">{color}</Text>
    </Column>
  ));
}
