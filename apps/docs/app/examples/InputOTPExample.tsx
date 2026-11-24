'use client';

import { Column, InputOTP, InputOTPGroup, InputOTPSlot, Text } from '@umami/react-zen';
import { useState } from 'react';

export function InputOTPExample() {
  const [value, setValue] = useState('');

  return (
    <Column alignItems="center" gap="2">
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <Text size="sm" color="muted-foreground">
        {value === '' ? 'Enter your one-time password.' : `You entered: ${value}`}
      </Text>
    </Column>
  );
}
