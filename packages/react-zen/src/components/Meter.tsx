import { Meter as BaseMeter } from '@base-ui/react/meter';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { Text } from './Text';

export interface MeterProps extends Omit<BaseMeter.Root.Props, 'min' | 'max' | 'format'> {
  value: number;
  minValue?: number;
  maxValue?: number;
  label?: string;
  showValue?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
}

export function Meter({
  value,
  minValue,
  maxValue,
  label,
  showValue,
  formatOptions,
  className,
  ...props
}: MeterProps) {
  return (
    <BaseMeter.Root
      {...props}
      value={value}
      min={minValue}
      max={maxValue}
      format={formatOptions}
      data-slot="meter"
      className={cn('flex flex-col gap-2 w-full', className)}
    >
      {(label || showValue) && (
        <div data-slot="meter-header" className="flex items-center justify-between gap-3">
          {label && (
            <BaseMeter.Label data-slot="meter-label" render={<Label />}>
              {label}
            </BaseMeter.Label>
          )}
          {showValue && (
            <Text className="tabular-nums">
              <BaseMeter.Value data-slot="meter-value" />
            </Text>
          )}
        </div>
      )}
      <BaseMeter.Track
        data-slot="meter-track"
        className="relative overflow-hidden w-full h-2 rounded-full bg-interactive"
      >
        <BaseMeter.Indicator
          data-slot="meter-indicator"
          className="h-full rounded-full bg-primary transition-all"
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
