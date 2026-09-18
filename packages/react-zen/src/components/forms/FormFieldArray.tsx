import type { HTMLAttributes, ReactNode } from 'react';
import {
  type FieldValues,
  type RegisterOptions,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Column } from '../Column';
import { Label } from '../Label';
import { Text } from '../Text';

export interface FormFieldArrayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  description?: string;
  label?: string;
  rules?: RegisterOptions<FieldValues, string>;
  children: (props: any) => ReactNode;
}

export function FormFieldArray({
  id,
  name,
  description,
  label,
  rules,
  className,
  children,
  color: _color,
  ...props
}: FormFieldArrayProps) {
  const fieldId = useFieldId(id);
  const context = useFormContext();
  const { formState, control, register } = context;

  const fieldProps = useFieldArray({
    control,
    name,
  });

  register(name, rules);

  const errors = formState?.errors || {};
  const errorMessage = errors[name]?.message as string;

  return (
    <Column {...props} gap="2" className={className}>
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      {description && <Text color="muted">{description}</Text>}
      {errorMessage && (
        <Text role="alert" className="text-status-error">
          {errorMessage}
        </Text>
      )}
      {children({ ...context, ...fieldProps })}
    </Column>
  );
}
