import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import type { ReactNode } from 'react';
import { FieldDescription, FieldLegend, FieldSet } from '@/components/ui/field';
import { cn } from '@/lib/utils';

export interface CheckboxGroupProps extends Omit<BaseCheckboxGroup.Props, 'className'> {
  className?: string;
  label?: ReactNode;
  description?: ReactNode;
  orientation?: 'vertical' | 'horizontal';
}

export function CheckboxGroup({
  label,
  description,
  disabled,
  orientation = 'vertical',
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  return (
    <FieldSet
      data-slot="checkbox-group-fieldset"
      data-disabled={disabled || undefined}
      disabled={disabled}
      className={className}
    >
      {label && <FieldLegend variant="label">{label}</FieldLegend>}
      {description && <FieldDescription>{description}</FieldDescription>}
      <BaseCheckboxGroup
        {...props}
        data-slot="checkbox-group"
        data-orientation={orientation}
        disabled={disabled}
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap gap-x-6',
        )}
      >
        {children}
      </BaseCheckboxGroup>
    </FieldSet>
  );
}
