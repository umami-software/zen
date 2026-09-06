import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';
import { Text, type TextProps } from './Text';

export interface CodeProps extends Omit<TextProps, 'as'> {
  children?: ReactNode;
}

export function Code({ className, children, size = 'sm', ...props }: CodeProps) {
  return (
    <Text
      {...props}
      as="code"
      size={size}
      weight="medium"
      className={cn('font-mono bg-surface-sunken rounded p-1', className)}
    >
      {children}
    </Text>
  );
}
