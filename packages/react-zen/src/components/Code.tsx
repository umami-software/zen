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
      className={cn('rounded-md bg-muted px-[0.3rem] py-[0.2rem] font-mono', className)}
    >
      {children}
    </Text>
  );
}
