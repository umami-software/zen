import { Column, SearchField, TextField } from '@umami/react-zen';
import { useState } from 'react';

export function SearchDelayExample() {
  const [value, setValue] = useState('abc');

  return (
    <Column gap="4">
      <SearchField delay={1000} onSearch={setValue} />
      <TextField
        name="search"
        label="Search value"
        value={value}
        defaultValue={value}
        isReadOnly={true}
      />
    </Column>
  );
}
