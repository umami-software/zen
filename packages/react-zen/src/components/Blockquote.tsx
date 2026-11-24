import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';
import { Text, type TextProps } from './Text';

export interface BlockquoteProps extends Omit<TextProps, 'as'> {
  children?: ReactNode;
}

export function Blockquote({ className, children, ...props }: BlockquoteProps) {
  return (
    <Text
      {...props}
      as="blockquote"
      className={cn('border-l-2 border-border pl-6 italic', className)}
    >
      {children}
    </Text>
  );
}
