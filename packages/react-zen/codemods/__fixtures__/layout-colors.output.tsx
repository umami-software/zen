import { Box, Column, Heading, Icon, Row, Text } from '@umami/react-zen';
import { Text as OtherText } from './Text';

export function Layout({ isSelected, hidden, name, color }: any) {
  return (
    <Column backgroundColor="muted" borderColor="input" gap="3">
      <Text color="muted-foreground">Muted</Text>
      <Text color={'foreground'}>Primary</Text>
      <Text color={name ? undefined : 'muted-foreground'}>{name}</Text>
      {/* TODO(zen-1.0): <Text>: color="disabled" has no shadcn token; mapped to "muted-foreground" (consider opacity-50) */}
      <Text color={hidden ? 'muted-foreground' : undefined}>hidden</Text>
      <Heading color="background">Inverted</Heading>
      <Icon color="muted-foreground" size="md">
        <svg />
      </Icon>
      <Row
        backgroundColor={isSelected ? 'muted' : undefined}
        hover={{ backgroundColor: 'muted' }}
        border="bottom"
        borderColor="border"
      >
        row
      </Row>
      <Box backgroundColor="background" borderColor={true} color="red-500">
        palette
      </Box>
      <Box backgroundColor="popover">overlay</Box>
      <Box backgroundColor="foreground" color="background">
        inverted
      </Box>
      {/* TODO(zen-1.0): <Box>: backgroundColor="surface-disabled" has no shadcn token; mapped to "muted" (consider opacity-50) */}
      <Box backgroundColor="muted">disabled</Box>
      <Box backgroundColor="muted" hover={{ backgroundColor: 'accent' }}>
        interactive
      </Box>
      <Box backgroundColor="primary" color={color}>
        primary
      </Box>
      <OtherText color="muted">not zen</OtherText>
    </Column>
  );
}
