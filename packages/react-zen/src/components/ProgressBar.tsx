import type { ProgressRoot } from '@base-ui/react/progress';
import { Progress as BaseProgress } from '@base-ui/react/progress';
import { cn } from './lib/tailwind';

export interface ProgressTrackProps extends BaseProgress.Track.Props {}

export function ProgressTrack({ className, ...props }: ProgressTrackProps) {
  return (
    <BaseProgress.Track
      {...props}
      data-slot="progress-track"
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-interactive', className)}
    />
  );
}

export interface ProgressIndicatorProps extends BaseProgress.Indicator.Props {}

export function ProgressIndicator({ className, ...props }: ProgressIndicatorProps) {
  return (
    <BaseProgress.Indicator
      {...props}
      data-slot="progress-indicator"
      className={cn('h-full rounded-full bg-primary transition-all', className)}
    />
  );
}

export interface ProgressLabelProps extends BaseProgress.Label.Props {}

export function ProgressLabel({ className, ...props }: ProgressLabelProps) {
  return (
    <BaseProgress.Label
      {...props}
      data-slot="progress-label"
      className={cn('text-sm font-semibold text-fg', className)}
    />
  );
}

export interface ProgressValueProps extends BaseProgress.Value.Props {}

export function ProgressValue({ className, ...props }: ProgressValueProps) {
  return (
    <BaseProgress.Value
      {...props}
      data-slot="progress-value"
      className={cn('text-sm tabular-nums text-fg', className)}
    />
  );
}

export interface ProgressBarProps extends ProgressRoot.Props {
  showPercentage?: boolean;
  label?: string;
}

export function ProgressBar({
  className,
  showPercentage,
  label,
  children,
  ...props
}: ProgressBarProps) {
  return (
    <BaseProgress.Root
      {...props}
      data-slot="progress"
      className={cn('flex w-full items-center gap-3', className)}
    >
      {label && <ProgressLabel>{label}</ProgressLabel>}
      {children ?? (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
      {showPercentage && <ProgressValue />}
    </BaseProgress.Root>
  );
}
