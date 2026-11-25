import { Box, Column, Heading, Icon, Row, Text } from '@umami/react-zen';
import { Text as OtherText } from './Text';

export function Layout({ isSelected, hidden, name, color }: any) {
  return (
    <Column backgroundColor="surface-raised" borderColor="strong" gap="3">
      <Text color="muted">Muted</Text>
      <Text color="muted-foreground">Already migrated</Text>
      <Text color={'primary'}>Primary</Text>
      <Text color={name ? undefined : 'muted'}>{name}</Text>
      <Text color={hidden ? 'disabled' : undefined}>hidden</Text>
      <Heading color="inverted">Inverted</Heading>
      <Icon color="muted" size="md">
        <svg />
      </Icon>
      <Row
        backgroundColor={isSelected ? 'surface-sunken' : undefined}
        hover={{ backgroundColor: 'surface-sunken' }}
        border="bottom"
        borderColor="muted"
      >
        row
      </Row>
      <Box backgroundColor="surface" borderColor={true} color="red-500">
        palette
      </Box>
      <Box backgroundColor="surface-overlay">overlay</Box>
      <Box backgroundColor="surface-inverted" color="inverted">
        inverted
      </Box>
      <Box backgroundColor="surface-disabled">disabled</Box>
      <Box backgroundColor="interactive" hover={{ backgroundColor: 'interactive-hover' }}>
        interactive
      </Box>
      <Box backgroundColor="primary" color={color}>
        primary
      </Box>
      <OtherText color="muted">not zen</OtherText>
    </Column>
  );
}
