import type { ReactNode } from 'react';
import { type FieldValues, useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from '../Button';
import type { PressEvent } from '../lib/interaction';

export interface FormResetButtonProps extends ButtonProps {
  children?: ReactNode;
  values?: FieldValues | { [p: string]: any };
}

export function FormResetButton({ values, children, onPress, ...props }: FormResetButtonProps) {
  const { reset } = useFormContext();

  const handleReset = (e: PressEvent) => {
    // reset() with no values restores the form's defaultValues
    reset(values);
    onPress?.(e);
  };

  return (
    <Button {...props} type="reset" onPress={handleReset}>
      {children}
    </Button>
  );
}
