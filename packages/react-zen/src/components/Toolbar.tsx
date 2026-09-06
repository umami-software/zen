import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import { cn } from './lib/tailwind';
import { Separator } from './Separator';

export interface ToolbarProps extends Omit<BaseToolbar.Root.Props, 'disabled'> {
  isDisabled?: boolean;
  children?: ReactNode;
}

export function Toolbar({ isDisabled, orientation, className, children, ...props }: ToolbarProps) {
  return (
    <BaseToolbar.Root
      {...props}
      disabled={isDisabled}
      orientation={orientation}
      className={cn(
        'flex items-center gap-1 p-1 rounded-md border border-edge bg-surface shadow-sm w-fit',
        orientation === 'vertical' && 'flex-col',
        className,
      )}
    >
      {children}
    </BaseToolbar.Root>
  );
}

export interface ToolbarGroupProps extends BaseToolbar.Group.Props {
  children?: ReactNode;
}

export function ToolbarGroup({ className, children, ...props }: ToolbarGroupProps) {
  return (
    <BaseToolbar.Group {...props} className={cn('flex items-center gap-1', className)}>
      {children}
    </BaseToolbar.Group>
  );
}

export interface ToolbarButtonProps extends ButtonProps {
  isDisabled?: boolean;
}

export function ToolbarButton({ isDisabled, variant = 'quiet', ...props }: ToolbarButtonProps) {
  return (
    <BaseToolbar.Button disabled={isDisabled} render={<Button variant={variant} {...props} />} />
  );
}

export function ToolbarSeparator({ className, ...props }: BaseToolbar.Separator.Props) {
  return (
    <BaseToolbar.Separator
      {...props}
      render={
        <Separator orientation="vertical" className={cn('mx-1 h-5 self-center', className)} />
      }
    />
  );
}
