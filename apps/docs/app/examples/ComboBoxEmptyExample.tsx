'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@umami/react-zen';
import { useState } from 'react';

const fruits = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango', 'Orange'];

export function ComboBoxEmptyExample() {
  const [query, setQuery] = useState('');

  return (
    <Combobox items={fruits} inputValue={query} onInputValueChange={setQuery}>
      <ComboboxInput placeholder="Search fruit..." />
      <ComboboxContent>
        <ComboboxEmpty>No fruit matches "{query}".</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
