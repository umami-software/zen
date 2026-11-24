'use client';

import { Column, DatePicker, TextField } from '@umami/react-zen';
import { useState } from 'react';

export function DatePickerExample() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Column width="300px" gap>
      <DatePicker label="Date" value={date} onValueChange={setDate} />
      <TextField
        label="Selected"
        value={date ? date.toDateString() : 'No date selected'}
        readOnly
      />
    </Column>
  );
}
