'use client';

import { Checkbox, CheckboxGroup, Column, Field, FieldLabel, Text } from '@umami/react-zen';
import { useState } from 'react';

export function CheckboxGroupExample() {
  const [value, setValue] = useState<string[]>(['email']);

  return (
    <Column gap>
      <CheckboxGroup label="Notifications" value={value} onValueChange={setValue}>
        <Field orientation="horizontal">
          <Checkbox id="notify-email" value="email" />
          <FieldLabel htmlFor="notify-email">Email</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="notify-sms" value="sms" />
          <FieldLabel htmlFor="notify-sms">SMS</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="notify-push" value="push" />
          <FieldLabel htmlFor="notify-push">Push</FieldLabel>
        </Field>
      </CheckboxGroup>
      <Text color="muted-foreground">Selected: {value.length ? value.join(', ') : '(none)'}</Text>
    </Column>
  );
}
