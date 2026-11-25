import type { ComponentProps } from 'react';
import { useFormContext } from 'react-hook-form';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';

export interface FormSubmitButtonProps extends Omit<ComponentProps<typeof Button>, 'type'> {
  /** Overrides the automatic loading state (on while the form is submitting). */
  loading?: boolean;
  /**
   * Also disable the button while the form is pristine or invalid. Only useful with
   * `mode="onChange"` / `mode="all"`, since RHF's default `onSubmit` mode reports
   * `isValid: false` until the first submit attempt.
   */
  requireValid?: boolean;
}

export function FormSubmitButton({
  disabled,
  loading,
  requireValid = false,
  children,
  ...props
}: FormSubmitButtonProps) {
  const {
    formState: { isDirty, isValid, isSubmitting },
  } = useFormContext();

  const isLoading = loading ?? isSubmitting;
  const isDisabled =
    disabled ?? (requireValid ? !isDirty || !isValid || isSubmitting : isSubmitting);

  return (
    <Button
      {...props}
      type="submit"
      data-loading={isLoading || undefined}
      aria-busy={isLoading || undefined}
      disabled={isDisabled || isLoading}
    >
      {isLoading && <Spinner data-icon="inline-start" />}
      {children}
    </Button>
  );
}
