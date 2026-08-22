import { ListItem, Row, Select, Text } from '@umami/react-zen';

const items = ['One', 'Two', 'Three', 'Four', 'Five'];

export function SelectValueExample() {
  const renderValue = ({ defaultChildren, isPlaceholder }: any) => {
    return isPlaceholder ? (
      <Text>Choose wisely</Text>
    ) : (
      <Row gap>
        <Text>You selected:</Text>
        <Text weight="bold">{defaultChildren}</Text>
      </Row>
    );
  };

  return (
    <Select label="Select" placeholder="Please select an option" renderValue={renderValue}>
      {items.map(item => (
        <ListItem key={item} id={item}>
          {item}
        </ListItem>
      ))}
    </Select>
  );
}
