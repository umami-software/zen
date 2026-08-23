import { OTPField as BaseOTPField } from '@base-ui/react/otp-field';
import { useFieldId } from './hooks/useFieldId';
import { Label } from './Label';
import { cn } from './lib/tailwind';

export interface OTPFieldProps
  extends Omit<
    BaseOTPField.Root.Props,
    'length' | 'disabled' | 'readOnly' | 'required' | 'onValueChange' | 'onValueComplete'
  > {
  length?: number;
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export function OTPField({
  length = 6,
  label,
  isDisabled,
  isReadOnly,
  isRequired,
  onChange,
  onComplete,
  className,
  id,
  ...props
}: OTPFieldProps) {
  const fieldId = useFieldId(id);

  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <BaseOTPField.Root
        {...props}
        id={fieldId}
        length={length}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        onValueChange={value => onChange?.(value)}
        onValueComplete={value => onComplete?.(value)}
        className={cn('flex items-center gap-2', className)}
      >
        {Array.from({ length }, (_, index) => (
          <BaseOTPField.Input
            // biome-ignore lint/suspicious/noArrayIndexKey: slots are positional
            key={index}
            className={cn(
              'size-10 text-center text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] rounded border border-edge bg-surface-base shadow-sm',
              'text-foreground-primary outline-none transition-colors',
              'focus:border-edge-strong focus:ring-2 focus:ring-focus-ring focus:ring-offset-1 focus:ring-offset-surface-base',
              'data-[filled]:border-edge-strong',
              'disabled:bg-surface-disabled disabled:text-foreground-disabled',
            )}
          />
        ))}
      </BaseOTPField.Root>
    </div>
  );
}
