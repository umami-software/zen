import type { ComponentProps } from 'react';
import { type FieldValues, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';

export interface FormResetButtonProps extends Omit<ComponentProps<typeof Button>, 'type'> {
  /** Values to reset the form to. Defaults to the form's `defaultValues`. */
  values?: FieldValues;
}

export function FormResetButton({
  values,
  variant = 'outline',
  onClick,
  ...props
}: FormResetButtonProps) {
  const { reset } = useFormContext();

  const handleClick: FormResetButtonProps['onClick'] = event => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    // reset() with no values restores the form's defaultValues
    reset(values);
  };

  return <Button {...props} type="reset" variant={variant} onClick={handleClick} />;
}
