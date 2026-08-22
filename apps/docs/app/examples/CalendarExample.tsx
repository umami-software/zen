import { Calendar, Column, TextField } from '@umami/react-zen';
import { useState } from 'react';

export function CalendarExample() {
  const [date, setDate] = useState(new Date());

  return (
    <Column width="500px" alignItems="center" gap>
      <Calendar value={date} onChange={setDate} />
      <Column width="100%">
        <TextField value={date.toString()} isReadOnly />
      </Column>
    </Column>
  );
}
