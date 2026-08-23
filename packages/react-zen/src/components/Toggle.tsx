import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from '@base-ui/react/toggle';
import { useId } from 'react';
import { Label } from './Label';
import { cn } from './lib/tailwind';

export interface ToggleProps
  extends Omit<
    BaseToggleProps<string>,
    'pressed' | 'defaultPressed' | 'disabled' | 'onChange' | 'onPressedChange'
  > {
  label?: string;
  value?: string;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (selected: boolean) => void;
}

export function Toggle({
  label,
  children,
  className,
  isSelected,
  defaultSelected,
  isDisabled,
  onChange,
  ...props
}: ToggleProps) {
  const labelId = useId();

  const toggle = (
    <BaseToggle
      {...props}
      aria-labelledby={label ? labelId : props['aria-labelledby']}
      pressed={isSelected}
      defaultPressed={defaultSelected}
      disabled={isDisabled}
      onPressedChange={onChange}
      className={cn(
        'flex items-center justify-center whitespace-nowrap gap-3 font-medium bg-interactive border border-transparent rounded p-2 relative cursor-pointer',
        'hover:bg-interactive-hover',
        'data-[pressed]:text-primary-foreground data-[pressed]:bg-primary',
        className,
      )}
    >
      {children}
    </BaseToggle>
  );

  if (label) {
    return (
      <div className="inline-flex flex-col gap-1">
        <Label id={labelId}>{label}</Label>
        {toggle}
      </div>
    );
  }

  return toggle;
}
