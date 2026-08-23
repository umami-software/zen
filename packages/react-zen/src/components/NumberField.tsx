import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { Minus, Plus } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { inputField } from './variants';

export interface NumberFieldProps
  extends Omit<
    BaseNumberField.Root.Props,
    'min' | 'max' | 'disabled' | 'readOnly' | 'required' | 'format' | 'onValueChange'
  > {
  label?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  onChange?: (value: number | null) => void;
}

const stepperClasses = [
  'flex items-center justify-center self-stretch px-3 shrink-0',
  'cursor-pointer select-none bg-transparent text-foreground-primary',
  'hover:bg-interactive active:bg-interactive-hover',
  'disabled:text-foreground-disabled disabled:cursor-default disabled:hover:bg-transparent',
];

export function NumberField({
  label,
  placeholder,
  minValue,
  maxValue,
  isDisabled,
  isReadOnly,
  isRequired,
  formatOptions,
  onChange,
  className,
  id,
  ...props
}: NumberFieldProps) {
  const fieldId = useFieldId(id);

  return (
    <BaseNumberField.Root
      {...props}
      id={fieldId}
      min={minValue}
      max={maxValue}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      format={formatOptions}
      onValueChange={value => onChange?.(value)}
      className={cn('flex flex-col gap-1', className)}
    >
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <BaseNumberField.Group className={cn(inputField(), 'p-0 px-0 gap-0 overflow-hidden')}>
        <BaseNumberField.Decrement className={cn(stepperClasses, 'border-r border-edge')}>
          <Icon size="sm">
            <Minus />
          </Icon>
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          placeholder={placeholder}
          className="w-full min-w-0 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] text-center tabular-nums bg-transparent py-2 px-3 outline-none placeholder:text-foreground-muted"
        />
        <BaseNumberField.Increment className={cn(stepperClasses, 'border-l border-edge')}>
          <Icon size="sm">
            <Plus />
          </Icon>
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
