import type { InputHTMLAttributes } from 'react';
import { useState } from 'react';
import { Eye, EyeSlash } from '@/components/svg';
import { Icon } from './Icon';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './InputGroup';
import { Label } from './Label';

export interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'disabled' | 'readOnly'> {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function PasswordField({
  label,
  className,
  isDisabled,
  isReadOnly,
  ...props
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  const input = (
    <InputGroup className={className}>
      <InputGroupInput
        aria-label="Password"
        {...props}
        type={show ? 'text' : 'password'}
        disabled={isDisabled}
        readOnly={isReadOnly}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          size="icon-xs"
          isDisabled={isDisabled}
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow(state => !state)}
        >
          <Icon>{show ? <EyeSlash /> : <Eye />}</Icon>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );

  if (label) {
    return (
      <div className="flex flex-col gap-1">
        <Label htmlFor={props.id}>{label}</Label>
        {input}
      </div>
    );
  }

  return input;
}
