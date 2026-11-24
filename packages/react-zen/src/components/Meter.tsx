import { Meter as BaseMeter } from '@base-ui/react/meter';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface MeterProps extends BaseMeter.Root.Props {
  label?: ReactNode;
  showValue?: boolean;
}

export function Meter({ label, showValue, className, ...props }: MeterProps) {
  return (
    <BaseMeter.Root
      {...props}
      data-slot="meter"
      className={cn('flex w-full flex-col gap-3', className)}
    >
      {(label || showValue) && (
        <div data-slot="meter-header" className="flex items-center justify-between gap-3">
          {label && (
            <BaseMeter.Label data-slot="meter-label" className="text-sm font-medium">
              {label}
            </BaseMeter.Label>
          )}
          {showValue && (
            <BaseMeter.Value
              data-slot="meter-value"
              className="ml-auto text-sm text-muted-foreground tabular-nums"
            />
          )}
        </div>
      )}
      <BaseMeter.Track
        data-slot="meter-track"
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <BaseMeter.Indicator
          data-slot="meter-indicator"
          className="h-full bg-primary transition-all"
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}
