import { Box, type BoxProps } from './Box';
import { Column, type ColumnProps } from './Column';
import { cn } from './lib/tailwind';

export interface SkeletonProps extends BoxProps {}

/**
 * Placeholder block shown while content loads.
 *
 * Sizing can come either from the `width`/`height`/`borderRadius` props or from
 * utility classes passed via `className` (e.g. `className="size-10 rounded-full"`).
 */
export function Skeleton({ borderRadius = 'md', className, ...props }: SkeletonProps) {
  return (
    <Box
      aria-hidden="true"
      {...props}
      data-slot="skeleton"
      borderRadius={borderRadius}
      className={cn('block h-4 w-full animate-pulse bg-interactive', className)}
    />
  );
}

export interface SkeletonTextProps extends ColumnProps {
  lines?: number;
  lastLineWidth?: BoxProps['width'];
  lineHeight?: BoxProps['height'];
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  lineHeight = '0.875rem',
  ...props
}: SkeletonTextProps) {
  const lineKeys = Array.from({ length: lines }, (_, index) => `line-${index}`);

  return (
    <Column gap="2" width="100%" data-slot="skeleton-text" {...props}>
      {lineKeys.map((key, index) => (
        <Skeleton
          key={key}
          height={lineHeight}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </Column>
  );
}

export interface SkeletonAvatarProps
  extends Omit<SkeletonProps, 'width' | 'height' | 'borderRadius'> {
  size?: 'sm' | 'md' | 'lg';
}

const avatarSizeMap = {
  sm: '2rem',
  md: '2.5rem',
  lg: '3rem',
};

export function SkeletonAvatar({ size = 'md', ...props }: SkeletonAvatarProps) {
  return (
    <Skeleton
      width={avatarSizeMap[size]}
      height={avatarSizeMap[size]}
      borderRadius="full"
      {...props}
    />
  );
}
