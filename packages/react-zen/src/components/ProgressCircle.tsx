import type { ProgressRoot } from '@base-ui/react/progress';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from './lib/tailwind';

export interface ProgressCircleProps extends ProgressRoot.Props {
  showPercentage?: boolean;
}

const RADIUS = 45;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

export function ProgressCircle({
  className,
  showPercentage,
  value,
  min = 0,
  max = 100,
  ...props
}: ProgressCircleProps) {
  // `value == null` puts Base UI in the indeterminate state.
  const isIndeterminate = value === null || value === undefined;
  const numericValue = isIndeterminate ? min : value;
  const percentage = Math.max(0, Math.min(100, ((numericValue - min) / (max - min)) * 100));
  const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;

  return (
    <BaseProgress.Root
      {...props}
      data-slot="progress-circle"
      value={value}
      min={min}
      max={max}
      className={cn('relative flex items-center justify-center', className)}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className={cn(
          'h-24 w-24 -rotate-90 fill-none stroke-[8px]',
          isIndeterminate && 'animate-spin',
        )}
      >
        <circle
          data-slot="progress-circle-track"
          className="stroke-interactive"
          cx="50"
          cy="50"
          r={RADIUS}
        />
        <circle
          data-slot="progress-circle-indicator"
          className="stroke-primary transition-[stroke-dashoffset]"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeLinecap={isIndeterminate ? 'round' : undefined}
          strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeDashoffset={isIndeterminate ? CIRCUMFERENCE * 0.75 : offset}
        />
      </svg>
      {showPercentage && !isIndeterminate && (
        <BaseProgress.Value
          data-slot="progress-circle-value"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold"
        />
      )}
    </BaseProgress.Root>
  );
}
