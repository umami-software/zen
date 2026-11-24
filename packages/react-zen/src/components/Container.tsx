import type { ReactNode } from 'react';
import { Box, type BoxProps } from './Box';
import { cn } from './lib/tailwind';

export interface ContainerProps extends BoxProps {
  children?: ReactNode;
  fluid?: boolean;
  centered?: boolean;
}

export function Container({
  centered = true,
  fluid,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Box
      {...props}
      className={cn(
        'w-full',
        fluid
          ? 'max-w-full'
          : 'px-4 sm:max-w-[500px] md:max-w-[740px] lg:max-w-[1000px] xl:max-w-[1240px] 2xl:max-w-[1600px]',
        centered && 'mx-auto',
        className,
      )}
    >
      {children}
    </Box>
  );
}
