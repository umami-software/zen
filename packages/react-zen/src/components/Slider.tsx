import { Slider as BaseSlider } from '@base-ui/react/slider';
import { type ReactNode, useId } from 'react';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { Row } from './Row';

export interface SliderProps
  extends Omit<
    BaseSlider.Root.Props<number>,
    'disabled' | 'onChange' | 'onValueChange' | 'onValueCommitted'
  > {
  label?: ReactNode;
  showValue?: boolean;
  isDisabled?: boolean;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}

export function Slider({
  className,
  showValue = true,
  label,
  isDisabled,
  onChange,
  onChangeEnd,
  ...props
}: SliderProps) {
  const labelId = useId();

  return (
    <BaseSlider.Root
      {...props}
      aria-labelledby={label ? labelId : props['aria-labelledby']}
      disabled={isDisabled}
      onValueChange={onChange}
      onValueCommitted={onChangeEnd}
      className={cn('flex flex-col gap-2 w-full', className)}
    >
      <Row justifyContent="space-between" alignItems="center">
        {label && <Label id={labelId}>{label}</Label>}
        {showValue && (
          <BaseSlider.Value className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] tabular-nums" />
        )}
      </Row>
      <BaseSlider.Control className="relative h-5 w-full touch-none">
        <BaseSlider.Track className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-interactive overflow-hidden">
          <BaseSlider.Indicator className="h-full rounded-full bg-primary" />
        </BaseSlider.Track>
        <BaseSlider.Thumb
          className={cn(
            'w-5 h-5 rounded-full bg-surface-base border-2 border-primary shadow',
            'focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2',
          )}
        />
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
