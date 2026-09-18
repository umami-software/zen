import type { CheckboxRoot } from '@base-ui/react/checkbox';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import type { ReactNode } from 'react';
import { tv } from 'tailwind-variants';
import { Check, Minus } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Label } from './Label';
import { cn } from './lib/tailwind';

const checkboxStyles = tv({
  slots: {
    field: 'flex items-center gap-3 text-sm',
    root: [
      'peer flex size-4 shrink-0 items-center justify-center',
      'rounded-[4px] border border-edge bg-surface shadow-xs',
      'cursor-pointer outline-none transition-shadow',
      'data-checked:bg-primary data-checked:border-primary data-checked:text-primary-fg',
      'data-indeterminate:bg-primary data-indeterminate:border-primary data-indeterminate:text-primary-fg',
      'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
      'aria-invalid:border-status-error aria-invalid:ring-status-error/20',
      'disabled:cursor-default disabled:opacity-50 disabled:bg-surface-disabled',
      'data-disabled:cursor-default data-disabled:opacity-50 data-disabled:bg-surface-disabled',
    ],
    indicator: [
      'flex items-center justify-center text-current',
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
    ],
    label: 'cursor-pointer font-normal peer-disabled:cursor-default peer-disabled:opacity-50',
  },
});

export interface CheckboxProps
  extends Omit<
    CheckboxRoot.Props,
    'checked' | 'defaultChecked' | 'disabled' | 'indeterminate' | 'onCheckedChange' | 'value'
  > {
  children?: ReactNode;
  label?: string;
  /** Hide the visible label and expose it as `aria-label` instead. */
  hideLabel?: boolean;
  value?: string | boolean;
  isSelected?: boolean;
  checked?: boolean;
  defaultSelected?: boolean;
  defaultChecked?: boolean;
  isDisabled?: boolean;
  disabled?: boolean;
  isIndeterminate?: boolean;
  indeterminate?: boolean;
  onChange?: (selected: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({
  id,
  label,
  hideLabel,
  className,
  children,
  isSelected,
  checked: checkedProp,
  defaultSelected,
  defaultChecked,
  isDisabled,
  disabled,
  isIndeterminate,
  indeterminate,
  onChange,
  onCheckedChange,
  value,
  ...props
}: CheckboxProps) {
  const styles = checkboxStyles();
  const fieldId = useFieldId(id);
  const checked = checkedProp ?? isSelected ?? (typeof value === 'boolean' ? value : undefined);
  const isIndeterminateValue = isIndeterminate ?? indeterminate;
  const showLabel = !!label && !hideLabel;
  const hasContent = showLabel || children !== undefined;

  const control = (
    <BaseCheckbox.Root
      {...props}
      id={fieldId}
      data-slot="checkbox"
      aria-label={props['aria-label'] ?? (showLabel ? undefined : label)}
      value={typeof value === 'string' ? value : undefined}
      checked={checked}
      defaultChecked={defaultSelected ?? defaultChecked}
      disabled={isDisabled ?? disabled}
      indeterminate={isIndeterminateValue}
      className={cn(styles.root(), !hasContent && className)}
      onCheckedChange={(next, eventDetails) => {
        onCheckedChange?.(next);
        onChange?.(next);
        void eventDetails;
      }}
    >
      <BaseCheckbox.Indicator data-slot="checkbox-indicator" className={styles.indicator()}>
        {isIndeterminateValue ? <Minus /> : <Check />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!hasContent) {
    return control;
  }

  return (
    <div data-slot="checkbox-field" className={cn(styles.field(), className)}>
      {control}
      {showLabel && (
        <Label htmlFor={fieldId} className={styles.label()}>
          {label}
        </Label>
      )}
      {children !== undefined && (
        <label htmlFor={fieldId} className={styles.label()}>
          {children}
        </label>
      )}
    </div>
  );
}
