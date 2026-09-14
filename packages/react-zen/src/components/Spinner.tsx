import type { HTMLAttributes } from 'react';
import { Box } from './Box';
import { cn } from './lib/tailwind';
import './Spinner.css';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  quiet?: boolean;
  isDisabled?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-7 h-7',
  lg: 'w-12 h-12',
};

export function Spinner(props: SpinnerProps) {
  const { size = 'md', quiet, className, isDisabled, color: _color, ...domProps } = props;
  return (
    <Box
      {...domProps}
      role="status"
      aria-label={props['aria-label'] ?? 'Loading'}
      data-slot="spinner"
      className={cn('relative inline-flex justify-center items-center', sizeMap[size], className)}
    >
      <svg viewBox="25 25 50 50" className="zen-spinner-svg w-full h-full">
        {!quiet && (
          <circle className="zen-spinner-track stroke-interactive" cx="50" cy="50" r="20" />
        )}
        <circle
          className={cn(
            'zen-spinner-fill',
            isDisabled ? 'stroke-content-disabled' : 'stroke-primary',
          )}
          cx="50"
          cy="50"
          r="20"
        />
      </svg>
    </Box>
  );
}
