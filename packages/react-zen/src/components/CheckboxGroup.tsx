import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui/react/checkbox-group';
import { Fieldset } from '@base-ui/react/fieldset';
import type { ReactNode } from 'react';
import { useFieldId } from './hooks/useFieldId';
import { cn } from './lib/tailwind';

export interface CheckboxGroupProps
  extends Omit<BaseCheckboxGroup.Props, 'disabled' | 'onValueChange' | 'onChange'> {
  className?: string;
  label?: string;
  isDisabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  onChange?: (value: string[]) => void;
  children?: ReactNode;
}

export function CheckboxGroup({
  id,
  label,
  isDisabled,
  orientation = 'vertical',
  onChange,
  className,
  children,
  ...props
}: CheckboxGroupProps) {
  const labelId = useFieldId(id);

  return (
    <Fieldset.Root
      data-slot="checkbox-group"
      data-orientation={orientation}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      className={cn('flex flex-col gap-2 border-0 m-0 p-0 min-w-0', className)}
    >
      {label && (
        <Fieldset.Legend
          id={labelId}
          data-slot="checkbox-group-label"
          className="text-sm font-semibold text-fg"
        >
          {label}
        </Fieldset.Legend>
      )}
      <BaseCheckboxGroup
        {...props}
        data-slot="checkbox-group-items"
        data-orientation={orientation}
        aria-labelledby={label ? labelId : props['aria-labelledby']}
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        onValueChange={value => onChange?.(value)}
        className={cn('flex gap-3', orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}
      >
        {children}
      </BaseCheckboxGroup>
    </Fieldset.Root>
  );
}
