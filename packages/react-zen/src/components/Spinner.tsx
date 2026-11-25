import type { ComponentProps } from 'react';
import { cn } from './lib/tailwind';
import './Spinner.css';

export interface SpinnerProps extends ComponentProps<'svg'> {
  /** Hides the faint track behind the spinning arc. */
  quiet?: boolean;
}

/**
 * Zen's spinner: an arc that grows and shrinks as it rotates, over a faint track. A drop-in
 * replacement for shadcn's Spinner: an `svg` sized with `size-*` (default `size-4`) and drawn in
 * the current text color, so it works inside Button (`data-icon`) and InputGroup.
 */
export function Spinner({ quiet, className, ...props }: SpinnerProps) {
  return (
    <svg
      viewBox="25 25 50 50"
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      {...props}
      className={cn('zen-spinner size-4', className)}
    >
      {!quiet && <circle className="zen-spinner-track" cx="50" cy="50" r="20" />}
      <circle className="zen-spinner-fill" cx="50" cy="50" r="20" />
    </svg>
  );
}
