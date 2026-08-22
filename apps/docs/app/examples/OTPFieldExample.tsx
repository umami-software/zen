'use client';

import { Column, OTPField, Text } from '@umami/react-zen';
import { useState } from 'react';

export function OTPFieldExample() {
  const [value, setValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = (nextValue: string) => {
    setValue(nextValue);
    setIsComplete(false);
  };

  return (
    <Column alignItems="center" gap>
      <OTPField
        label="Verification code"
        value={value}
        onChange={handleChange}
        onComplete={() => setIsComplete(true)}
      />
      <Text color="muted">
        {isComplete ? `Code entered: ${value}` : `Value: ${value || '(empty)'}`}
      </Text>
    </Column>
  );
}
