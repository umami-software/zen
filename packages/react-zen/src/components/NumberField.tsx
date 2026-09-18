import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { forwardRef } from 'react';
import { Minus, Plus } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { inputField } from './variants';

export interface NumberFieldProps extends Omit<BaseNumberField.Root.Props, 'onValueChange'> {
  label?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  onChange?: (value: number | null) => void;
  /** Labels announced for the stepper buttons. */
  decrementLabel?: string;
  incrementLabel?: string;
}

const stepperClasses = [
  'flex items-center justify-center self-stretch px-3 shrink-0',
  'cursor-pointer select-none bg-transparent text-fg',
  'hover:bg-interactive active:bg-interactive-hover',
  'data-disabled:text-fg-disabled data-disabled:cursor-default data-disabled:hover:bg-transparent',
  'disabled:text-fg-disabled disabled:cursor-default disabled:hover:bg-transparent',
];

export const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(function NumberField(
  {
    label,
    placeholder,
    minValue,
    maxValue,
    isDisabled,
    isReadOnly,
    isRequired,
    formatOptions,
    onChange,
    decrementLabel = 'Decrease',
    incrementLabel = 'Increase',
    className,
    id,
    min,
    max,
    disabled,
    readOnly,
    required,
    format,
    ...props
  },
  ref,
) {
  const fieldId = useFieldId(id);

  return (
    <BaseNumberField.Root
      {...props}
      ref={ref}
      id={fieldId}
      data-slot="number-field"
      min={minValue ?? min}
      max={maxValue ?? max}
      disabled={isDisabled ?? disabled}
      readOnly={isReadOnly ?? readOnly}
      required={isRequired ?? required}
      format={formatOptions ?? format}
      onValueChange={value => onChange?.(value)}
      className={cn('flex flex-col gap-2', className)}
    >
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <BaseNumberField.Group
        data-slot="number-field-group"
        className={cn(inputField(), 'p-0 px-0 gap-0 overflow-hidden')}
      >
        <BaseNumberField.Decrement
          aria-label={decrementLabel}
          data-slot="number-field-decrement"
          className={cn(stepperClasses, 'border-r border-edge')}
        >
          <Icon size="sm">
            <Minus />
          </Icon>
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          placeholder={placeholder}
          data-slot="number-field-input"
          className="w-full min-w-0 text-sm text-center tabular-nums bg-transparent py-2 px-3 outline-none placeholder:text-fg-muted"
        />
        <BaseNumberField.Increment
          aria-label={incrementLabel}
          data-slot="number-field-increment"
          className={cn(stepperClasses, 'border-l border-edge')}
        >
          <Icon size="sm">
            <Plus />
          </Icon>
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
});
