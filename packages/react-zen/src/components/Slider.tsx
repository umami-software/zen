import { Slider as BaseSlider } from '@base-ui/react/slider';
import { type ReactNode, useId } from 'react';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { Row } from './Row';

type SliderValue = number | number[];

export interface SliderProps
  extends Omit<
    BaseSlider.Root.Props<SliderValue>,
    'disabled' | 'onChange' | 'onValueChange' | 'onValueCommitted'
  > {
  className?: string;
  label?: ReactNode;
  showValue?: boolean;
  isDisabled?: boolean;
  onChange?: (value: SliderValue) => void;
  onChangeEnd?: (value: SliderValue) => void;
}

export function Slider({
  className,
  showValue = true,
  label,
  isDisabled,
  onChange,
  onChangeEnd,
  value,
  defaultValue,
  min = 0,
  max = 100,
  orientation = 'horizontal',
  ...props
}: SliderProps) {
  const labelId = useId();
  const thumbValues = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min];

  return (
    <BaseSlider.Root
      {...props}
      data-slot="slider"
      aria-labelledby={label ? labelId : props['aria-labelledby']}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      orientation={orientation}
      thumbAlignment="edge"
      disabled={isDisabled}
      onValueChange={onChange}
      onValueCommitted={onChangeEnd}
      className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-row h-full' : 'flex-col w-full',
        className,
      )}
    >
      {(label || showValue) && (
        <Row justifyContent="space-between" alignItems="center">
          {label && <Label id={labelId}>{label}</Label>}
          {showValue && <BaseSlider.Value className="text-sm tabular-nums" />}
        </Row>
      )}
      <BaseSlider.Control
        data-slot="slider-control"
        className={cn(
          'relative flex touch-none select-none items-center',
          'data-disabled:opacity-50',
          'data-[orientation=horizontal]:h-5 data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-5 data-[orientation=vertical]:flex-col',
        )}
      >
        <BaseSlider.Track
          data-slot="slider-track"
          className={cn(
            'relative grow overflow-hidden rounded-full bg-interactive',
            'data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full',
            'data-[orientation=vertical]:w-2 data-[orientation=vertical]:h-full',
          )}
        >
          <BaseSlider.Indicator
            data-slot="slider-indicator"
            className={cn(
              'rounded-full bg-primary',
              'data-[orientation=horizontal]:h-full',
              'data-[orientation=vertical]:w-full',
            )}
          />
        </BaseSlider.Track>
        {thumbValues.map((_, index) => (
          <BaseSlider.Thumb
            // biome-ignore lint/suspicious/noArrayIndexKey: thumbs are positional
            key={index}
            index={index}
            data-slot="slider-thumb"
            className={cn(
              'block size-4 shrink-0 rounded-full bg-surface border-2 border-primary shadow',
              'cursor-pointer outline-none transition-[box-shadow]',
              'ring-focus-ring/50 hover:ring-4 focus-visible:ring-4 has-[:focus-visible]:ring-4',
              'disabled:pointer-events-none disabled:opacity-50',
              'data-disabled:pointer-events-none data-disabled:opacity-50',
            )}
          />
        ))}
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
