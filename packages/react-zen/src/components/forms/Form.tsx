import { type HTMLAttributes, type ReactNode, useEffect } from 'react';
import {
  FormProvider,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
  useForm,
} from 'react-hook-form';
import { Alert, AlertTitle } from '@/components/Alert';
import { cn } from '../lib/tailwind';

export interface FormProps extends UseFormProps, Omit<HTMLAttributes<HTMLFormElement>, 'children'> {
  autoComplete?: string;
  onSubmit?: SubmitHandler<any>;
  error?: ReactNode | Error;
  preventSubmit?: boolean;
  children?: ReactNode | ((e: UseFormReturn) => ReactNode);
}

export function Form({
  autoComplete,
  onSubmit,
  error,
  preventSubmit = false,
  // useForm props
  mode,
  disabled,
  reValidateMode,
  defaultValues,
  values,
  errors,
  resetOptions,
  resolver,
  context,
  shouldFocusError,
  shouldUnregister,
  shouldUseNativeValidation,
  progressive,
  criteriaMode,
  delayError,
  // Element props
  className,
  children,
  ...props
}: FormProps) {
  const formValues = useForm({
    mode,
    disabled,
    reValidateMode,
    defaultValues,
    values,
    errors,
    resetOptions,
    resolver,
    context,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    progressive,
    criteriaMode,
    delayError,
  });

  const { handleSubmit } = formValues;
  const onKeyDown =
    !onSubmit || preventSubmit
      ? (e: { key: string; preventDefault: () => any }) => e.key === 'Enter' && e.preventDefault()
      : undefined;

  useEffect(() => {
    formValues.reset(values);
  }, [formValues, values]);

  useEffect(() => {
    if (formValues.formState.isSubmitted) {
      formValues.reset(undefined, { keepDirty: true, keepValues: true });
    }
  }, [error, formValues]);

  return (
    <FormProvider {...formValues}>
      {error && (
        <Alert variant="danger">
          <AlertTitle className="justify-self-center">
            {error instanceof Error ? error?.message : error}
          </AlertTitle>
        </Alert>
      )}
      <form
        {...props}
        autoComplete={autoComplete}
        className={cn(
          'flex flex-col relative text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] gap-3',
          className,
        )}
        onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
        onKeyDown={onKeyDown}
      >
        {typeof children === 'function' ? children(formValues) : children}
      </form>
    </FormProvider>
  );
}
