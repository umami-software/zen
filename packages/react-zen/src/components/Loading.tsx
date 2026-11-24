import { Box, type BoxProps } from '@/components/Box';
import { Dots } from '@/components/Dots';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export interface LoadingProps extends BoxProps {
  size?: 'sm' | 'md' | 'lg';
  icon?: 'dots' | 'spinner';
  placement?: 'absolute' | 'center' | 'inline';
  className?: string;
}

const placementClasses = {
  absolute: 'absolute inset-0 m-auto',
  center: 'm-auto',
  inline: 'inline-flex',
};

const spinnerSizes = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10',
};

export function Loading({
  size = 'md',
  placement = 'inline',
  icon = 'spinner',
  className,
  ...props
}: LoadingProps) {
  return (
    <Box
      {...props}
      role="status"
      aria-label={props['aria-label'] ?? 'Loading'}
      data-slot="loading"
      className={cn(
        'relative flex justify-center items-center flex-1 pointer-events-none text-muted-foreground',
        placementClasses[placement],
        className,
      )}
    >
      {icon === 'dots' && <Dots size={size} />}
      {icon === 'spinner' && (
        <Spinner role={undefined} aria-hidden="true" className={spinnerSizes[size]} />
      )}
    </Box>
  );
}
