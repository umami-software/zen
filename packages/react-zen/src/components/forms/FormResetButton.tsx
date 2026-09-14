import type { ReactNode } from 'react';
import { type FieldValues, useFormContext } from 'react-hook-form';
import { Button, type ButtonProps } from '../Button';

export interface FormResetButtonProps extends ButtonProps {
  children?: ReactNode;
  values?: FieldValues | { [p: string]: any };
}

export function FormResetButton({
  values,
  children,
  onPress,
  onClick,
  ...props
}: FormResetButtonProps) {
  const { reset } = useFormContext();

  const handleClick = (e: any) => {
    onClick?.(e);

    if (e.defaultPrevented) {
      return;
    }

    // reset() with no values restores the form's defaultValues
    reset(values);
    onPress?.(e);
  };

  return (
    <Button {...props} type="reset" onClick={handleClick}>
      {children}
    </Button>
  );
}
