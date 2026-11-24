import { EyeIcon, EyeOffIcon } from 'lucide-react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useState } from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

export interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  label?: ReactNode;
  /** Controls whether the value is visible. Leave undefined for uncontrolled behavior. */
  revealed?: boolean;
  defaultRevealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  /** Called with the new string value. `onChange` is the native input event. */
  onValueChange?: (value: string) => void;
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(
    {
      label,
      className,
      revealed: revealedProp,
      defaultRevealed = false,
      onRevealedChange,
      onChange,
      onValueChange,
      autoComplete = 'current-password',
      id,
      ...props
    },
    ref,
  ) {
    const fieldId = useFieldId(id);
    const [uncontrolledRevealed, setUncontrolledRevealed] = useState(defaultRevealed);
    const revealed = revealedProp ?? uncontrolledRevealed;
    const isLabelled = Boolean(label || props['aria-label'] || props['aria-labelledby']);

    const toggleRevealed = () => {
      const next = !revealed;

      if (revealedProp === undefined) {
        setUncontrolledRevealed(next);
      }

      onRevealedChange?.(next);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(event.target.value);
    };

    const control = (
      <InputGroup
        data-slot="password-field"
        data-disabled={props.disabled ? 'true' : undefined}
        className={className}
      >
        <InputGroupInput
          {...props}
          ref={ref}
          id={fieldId}
          type={revealed ? 'text' : 'password'}
          autoComplete={autoComplete}
          aria-label={isLabelled ? props['aria-label'] : 'Password'}
          onChange={handleChange}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            disabled={props.disabled}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            onClick={toggleRevealed}
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    );

    if (!label) {
      return control;
    }

    return (
      <Field data-disabled={props.disabled ? true : undefined}>
        <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
        {control}
      </Field>
    );
  },
);
