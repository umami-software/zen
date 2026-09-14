import { type HTMLAttributes, type ReactNode, useEffect, useRef } from 'react';
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

  // `useForm({ values })` already syncs, so only reset when the caller supplies a
  // genuinely new object. Comparing by reference re-ran this on every parent render.
  const lastValues = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (values === undefined) {
      return;
    }

    const serialized = JSON.stringify(values);

    if (lastValues.current === serialized) {
      return;
    }

    lastValues.current = serialized;
    formValues.reset(values);
  }, [formValues, values]);

  useEffect(() => {
    if (formValues.formState.isSubmitted) {
      formValues.reset(undefined, { keepDirty: true, keepValues: true });
    }
  }, [error, formValues]);

  return (
    <FormProvider {...formValues}>
      <form
        {...props}
        autoComplete={autoComplete}
        className={cn('flex flex-col relative text-sm gap-3', className)}
        onSubmit={onSubmit ? handleSubmit(onSubmit) : undefined}
        onKeyDown={onKeyDown}
      >
        {error && (
          <Alert variant="danger">
            <AlertTitle className="justify-self-center">
              {error instanceof Error ? error?.message : error}
            </AlertTitle>
          </Alert>
        )}
        {typeof children === 'function' ? children(formValues) : children}
      </form>
    </FormProvider>
  );
}
