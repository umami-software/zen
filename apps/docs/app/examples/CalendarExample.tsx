'use client';
import { Calendar, Column, Text } from '@umami/react-zen';
import { useState } from 'react';

export function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Column alignItems="center" gap="3">
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-lg border" />
      <Text size="sm" color="muted-foreground">
        {date ? date.toDateString() : 'No date selected'}
      </Text>
    </Column>
  );
}
