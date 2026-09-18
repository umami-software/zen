import { Radio as BaseRadio, type RadioRoot } from '@base-ui/react/radio';
import {
  RadioGroup as BaseRadioGroup,
  type RadioGroupProps as BaseRadioGroupProps,
} from '@base-ui/react/radio-group';
import { type ReactNode, useId } from 'react';
import { useFieldId } from './hooks/useFieldId';
import { Label } from './Label';
import { cn } from './lib/tailwind';

export interface RadioGroupProps
  extends Omit<BaseRadioGroupProps, 'disabled' | 'readOnly' | 'onChange' | 'onValueChange'> {
  children?: ReactNode;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  onChange?: (value: string) => void;
}

export function RadioGroup({
  label,
  children,
  className,
  isDisabled,
  isReadOnly,
  onChange,
  ...props
}: RadioGroupProps) {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-2">
      {label && <Label id={labelId}>{label}</Label>}
      <BaseRadioGroup
        {...props}
        data-slot="radio-group"
        aria-labelledby={label ? labelId : props['aria-labelledby']}
        disabled={isDisabled}
        readOnly={isReadOnly}
        onValueChange={onChange}
        className={cn('flex flex-col gap-2', className)}
      >
        {children as ReactNode}
      </BaseRadioGroup>
    </div>
  );
}

export interface RadioProps extends Omit<RadioRoot.Props, 'disabled'> {
  isDisabled?: boolean;
}

export function Radio({ children, className, isDisabled, id, ...props }: RadioProps) {
  const fieldId = useFieldId(id);

  return (
    <div className="radio flex items-center gap-3 text-sm">
      <BaseRadio.Root
        {...props}
        id={fieldId}
        data-slot="radio"
        disabled={isDisabled}
        className={cn(
          'peer flex shrink-0 items-center justify-center',
          'size-4 aspect-square rounded-full border border-edge-strong bg-surface shadow-xs',
          'cursor-pointer outline-none transition-[color,box-shadow,border-color]',
          'data-checked:border-primary',
          'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
          'aria-invalid:border-status-error aria-invalid:ring-status-error/20',
          'data-disabled:opacity-50 data-disabled:cursor-not-allowed',
          className,
        )}
      >
        <BaseRadio.Indicator
          data-slot="radio-indicator"
          keepMounted
          className={cn(
            'size-2 rounded-full bg-primary',
            'transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none',
            'data-unchecked:scale-0 data-unchecked:opacity-0',
          )}
        />
      </BaseRadio.Root>
      {children ? (
        <Label
          htmlFor={fieldId}
          className="cursor-pointer font-normal peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
        >
          {children}
        </Label>
      ) : null}
    </div>
  );
}
