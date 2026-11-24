import { type ComponentProps, type ReactNode, useId } from 'react';
import {
  type FieldValues,
  type RegisterOptions,
  type UseFieldArrayReturn,
  type UseFormReturn,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldTitle } from '@/components/ui/field';

export interface FormFieldArrayProps extends Omit<ComponentProps<typeof Field>, 'children'> {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  rules?: RegisterOptions<FieldValues, string>;
  children: (props: UseFormReturn & UseFieldArrayReturn) => ReactNode;
}

export function FormFieldArray({
  name,
  label,
  description,
  rules,
  children,
  ...props
}: FormFieldArrayProps) {
  const labelId = useId();
  const context = useFormContext();
  const { formState, control, register } = context;

  const fieldArray = useFieldArray({
    control,
    name,
  });

  register(name, rules);

  const fieldError = formState.errors[name];
  const errorMessage = (fieldError?.message ?? fieldError?.root?.message) as string | undefined;

  return (
    <Field aria-labelledby={label ? labelId : undefined} {...props}>
      {label && <FieldTitle id={labelId}>{label}</FieldTitle>}
      {description && <FieldDescription>{description}</FieldDescription>}
      {errorMessage && <FieldError>{errorMessage}</FieldError>}
      {children({ ...context, ...fieldArray })}
    </Field>
  );
}
