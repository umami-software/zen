import { useFormContext } from 'react-hook-form';
import { LoadingButton, type LoadingButtonProps } from '../LoadingButton';

export interface FormSubmitButtonProps extends LoadingButtonProps {
  /**
   * Also disable the button while the form is pristine or invalid. Only useful with
   * `mode="onChange"` / `mode="all"`, since RHF's default `onSubmit` mode reports
   * `isValid: false` until the first submit attempt.
   */
  requireValid?: boolean;
}

export function FormSubmitButton({
  variant = 'primary',
  isDisabled,
  isLoading,
  requireValid = false,
  children,
  ...props
}: FormSubmitButtonProps) {
  const {
    formState: { isDirty, isValid, isSubmitting },
  } = useFormContext();

  return (
    <LoadingButton
      {...props}
      type="submit"
      variant={variant}
      isDisabled={
        isDisabled ?? (requireValid ? !isDirty || !isValid || isSubmitting : isSubmitting)
      }
      isLoading={isLoading ?? isSubmitting}
    >
      {children}
    </LoadingButton>
  );
}
