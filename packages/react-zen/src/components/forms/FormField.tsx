import { Children, cloneElement, type HTMLAttributes } from 'react';
import {
  type FieldValues,
  type RegisterOptions,
  type UseFormReturn,
  useFormContext,
} from 'react-hook-form';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Column } from '../Column';
import { Label } from '../Label';
import { Text } from '../Text';
import { FormController } from './FormController';

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement>, Partial<UseFormReturn> {
  name: string;
  description?: string;
  label?: string;
  rules?: RegisterOptions<FieldValues, string>;
  children: any;
}

export function FormField({
  id,
  name,
  description,
  label,
  rules,
  className,
  children,
  color: _color,
  ...props
}: FormFieldProps) {
  const fieldId = useFieldId(id);
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const context = useFormContext();
  const { control } = context;
  const { invalid, error } = context.getFieldState(name);

  const describedBy =
    [description && descriptionId, invalid && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <Column {...props} gap="2" className={className}>
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <FormController name={name} control={control} rules={rules}>
        {({ field }) => {
          return Children.map(
            typeof children === 'function' ? children({ context, field }) : children,
            child => {
              if (!child) {
                return null;
              }
              return cloneElement(child, {
                ...field,
                id: fieldId,
                'aria-invalid': invalid || undefined,
                'aria-describedby':
                  [child.props?.['aria-describedby'], describedBy].filter(Boolean).join(' ') ||
                  undefined,
              });
            },
          );
        }}
      </FormController>
      {description && (
        <Text id={descriptionId} color="muted">
          {description}
        </Text>
      )}
      {invalid && (
        <Text id={errorId} role="alert" className="text-status-error">
          {error?.message}
        </Text>
      )}
    </Column>
  );
}
