import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { forwardRef, type HTMLAttributes } from 'react';
import { Minus } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Label } from './Label';
import { cn } from './lib/tailwind';

export interface OTPFieldProps
  extends Omit<BaseOTPField.Root.Props, 'length' | 'onValueChange' | 'onValueComplete'> {
  length?: number;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

const slotClasses = [
  'relative flex h-9 w-9 items-center justify-center text-center text-sm',
  'border-y border-r border-edge bg-surface text-fg shadow-xs outline-none',
  'transition-[color,box-shadow,border-color]',
  'first:rounded-l first:border-l last:rounded-r',
  'focus-visible:relative focus-visible:z-10 focus-visible:border-focus-ring',
  'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
  'data-[active]:relative data-[active]:z-10 data-[active]:border-focus-ring',
  'data-[active]:ring-[3px] data-[active]:ring-focus-ring/50',
  'aria-invalid:border-status-error aria-invalid:ring-status-error/20',
  'disabled:cursor-not-allowed',
];

export const OTPFieldSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      role="separator"
      data-slot="otp-field-separator"
      className={cn('flex items-center text-fg-muted [&_svg]:size-4', className)}
    >
      {children ?? <Minus />}
    </div>
  ),
);

OTPFieldSeparator.displayName = 'OTPFieldSeparator';

export const OTPField = forwardRef<HTMLDivElement, OTPFieldProps>(function OTPField(
  {
    length = 6,
    label,
    isDisabled,
    isReadOnly,
    isRequired,
    onChange,
    onComplete,
    className,
    id,
    disabled,
    readOnly,
    required,
    ...props
  },
  ref,
) {
  const fieldId = useFieldId(id);
  const labelId = `${fieldId}-label`;

  return (
    <div data-slot="otp-field" className="flex flex-col gap-2">
      {label && (
        <Label id={labelId} htmlFor={`${fieldId}-0`}>
          {label}
        </Label>
      )}
      <BaseOTPField.Root
        {...props}
        ref={ref}
        id={fieldId}
        length={length}
        disabled={isDisabled ?? disabled}
        readOnly={isReadOnly ?? readOnly}
        required={isRequired ?? required}
        aria-labelledby={label ? labelId : props['aria-labelledby']}
        onValueChange={value => onChange?.(value)}
        onValueComplete={value => onComplete?.(value)}
        className={cn('flex items-center has-disabled:opacity-50', className)}
      >
        {Array.from({ length }, (_, index) => (
          <BaseOTPField.Input
            // biome-ignore lint/suspicious/noArrayIndexKey: slots are positional
            key={index}
            id={`${fieldId}-${index}`}
            data-slot="otp-field-slot"
            className={cn(slotClasses)}
          />
        ))}
      </BaseOTPField.Root>
    </div>
  );
});
