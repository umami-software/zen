import type { ProgressRoot } from '@base-ui/react/progress';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from './lib/tailwind';

export interface ProgressCircleProps extends ProgressRoot.Props {
  showPercentage?: boolean;
}

export function ProgressCircle({
  className,
  showPercentage,
  value = 0,
  min = 0,
  max = 100,
  ...props
}: ProgressCircleProps) {
  const numericValue = value ?? min;
  const percentage = Math.max(0, Math.min(100, ((numericValue - min) / (max - min)) * 100));
  const radius = 45;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <BaseProgress.Root
      {...props}
      value={value}
      min={min}
      max={max}
      className={cn('relative flex justify-center items-center', className)}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-none stroke-[8px] -rotate-90 w-24 h-24"
      >
        <circle className="stroke-interactive" cx="50" cy="50" r={radius} />
        <circle
          className="stroke-primary"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </svg>
      {showPercentage && (
        <BaseProgress.Value className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      )}
    </BaseProgress.Root>
  );
}
