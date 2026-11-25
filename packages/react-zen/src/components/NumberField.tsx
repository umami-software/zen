import { NumberField as BaseNumberField } from '@base-ui/react/number-field';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { buttonVariants } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

export interface NumberFieldProps extends BaseNumberField.Root.Props {
  label?: ReactNode;
  placeholder?: string;
  /** Labels announced for the stepper buttons. */
  decrementLabel?: string;
  incrementLabel?: string;
}

const stepperClassName = cn(
  buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
  'rounded-[calc(var(--radius)-5px)] text-muted-foreground',
);

export const NumberField = forwardRef<HTMLDivElement, NumberFieldProps>(function NumberField(
  {
    label,
    placeholder,
    decrementLabel = 'Decrease',
    incrementLabel = 'Increase',
    className,
    id,
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
      className={cn(
        'group/field flex w-full flex-col gap-2 data-disabled:[&_[data-slot=field-label]]:opacity-50',
        className,
      )}
    >
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <BaseNumberField.Group
        render={<InputGroup data-disabled={props.disabled ? 'true' : undefined} />}
      >
        <InputGroupAddon align="inline-start">
          <BaseNumberField.Decrement
            aria-label={decrementLabel}
            data-slot="number-field-decrement"
            className={stepperClassName}
          >
            <MinusIcon />
          </BaseNumberField.Decrement>
        </InputGroupAddon>
        <BaseNumberField.Input
          placeholder={placeholder}
          render={<InputGroupInput className="text-center tabular-nums" />}
        />
        <InputGroupAddon align="inline-end">
          <BaseNumberField.Increment
            aria-label={incrementLabel}
            data-slot="number-field-increment"
            className={stepperClassName}
          >
            <PlusIcon />
          </BaseNumberField.Increment>
        </InputGroupAddon>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
});
