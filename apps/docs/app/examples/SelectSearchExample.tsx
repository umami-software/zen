import { ListItem, Select } from '@umami/react-zen';
import { useState } from 'react';

const valuesPredefined = [
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

export function SelectSearchExample({
  isLoading,
  values = valuesPredefined,
}: {
  isLoading?: boolean;
  values?: string[];
}) {
  const [items, setItems] = useState<string[]>(values);
  const [search, setSearch] = useState<string>('');

  const handleSearch = (search: string) => {
    setSearch(search);
    setItems(
      search ? values.filter(item => item.toLowerCase().includes(search.toLowerCase())) : values,
    );
  };

  const handleOpen = (isOpen: boolean) => {
    if (!isOpen) {
      setSearch('');
      setItems(values);
    }
  };

  return (
    <Select
      label="Select"
      placeholder="Please select an option"
      maxHeight="300px"
      allowSearch
      searchValue={search}
      onSearch={handleSearch}
      onOpenChange={handleOpen}
      isLoading={isLoading}
    >
      {items.map(item => (
        <ListItem key={item} id={item}>
          {item}
        </ListItem>
      ))}
    </Select>
  );
}
