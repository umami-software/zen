import type { InputHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';
import { Eye, EyeSlash } from '@/components/svg';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './InputGroup';
import { Label } from './Label';

export interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /** Controls whether the value is visible. Leave undefined for uncontrolled behavior. */
  isRevealed?: boolean;
  defaultRevealed?: boolean;
  onRevealChange?: (revealed: boolean) => void;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      label,
      className,
      isDisabled,
      isReadOnly,
      isRevealed,
      defaultRevealed = false,
      onRevealChange,
      disabled,
      readOnly,
      autoComplete = 'current-password',
      id,
      ...props
    },
    ref,
  ) {
    const fieldId = useFieldId(id);
    const [uncontrolledRevealed, setUncontrolledRevealed] = useState(defaultRevealed);
    const revealed = isRevealed ?? uncontrolledRevealed;
    const isLabelled = Boolean(label || props['aria-label'] || props['aria-labelledby']);

    const toggleRevealed = () => {
      const next = !revealed;

      if (isRevealed === undefined) {
        setUncontrolledRevealed(next);
      }

      onRevealChange?.(next);
    };

    const input = (
      <InputGroup className={className}>
        <InputGroupInput
          {...props}
          ref={ref}
          id={fieldId}
          type={revealed ? 'text' : 'password'}
          autoComplete={autoComplete}
          aria-label={isLabelled ? props['aria-label'] : 'Password'}
          disabled={isDisabled ?? disabled}
          readOnly={isReadOnly ?? readOnly}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            isDisabled={isDisabled ?? disabled}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            onClick={toggleRevealed}
          >
            <Icon>{revealed ? <EyeSlash /> : <Eye />}</Icon>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );

    if (label) {
      return (
        <div data-slot="password-field" className="flex flex-col gap-2">
          <Label htmlFor={fieldId}>{label}</Label>
          {input}
        </div>
      );
    }

    return input;
  },
);
