'use client';

import { Checkbox, CheckboxGroup, Column, Text } from '@umami/react-zen';
import { useState } from 'react';

export function CheckboxGroupExample() {
  const [value, setValue] = useState<string[]>(['email']);

  return (
    <Column gap>
      <CheckboxGroup label="Notifications" value={value} onChange={setValue}>
        <Checkbox value="email">Email</Checkbox>
        <Checkbox value="sms">SMS</Checkbox>
        <Checkbox value="push">Push</Checkbox>
      </CheckboxGroup>
      <Text color="muted">Selected: {value.length ? value.join(', ') : '(none)'}</Text>
    </Column>
  );
}
