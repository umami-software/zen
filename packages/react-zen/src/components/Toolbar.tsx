import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';
import { type ButtonVariants, button } from './variants';

export interface ToolbarProps extends Omit<BaseToolbar.Root.Props, 'disabled'> {
  isDisabled?: boolean;
  children?: ReactNode;
}

export function Toolbar({ isDisabled, orientation, className, children, ...props }: ToolbarProps) {
  return (
    <BaseToolbar.Root
      {...props}
      data-slot="toolbar"
      disabled={isDisabled}
      orientation={orientation}
      className={cn(
        'flex items-center gap-1 p-1 rounded-md border border-edge bg-surface shadow-sm w-fit',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
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
    <BaseToolbar.Group
      {...props}
      data-slot="toolbar-group"
      className={cn(
        'flex items-center gap-1',
        'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
        className,
      )}
    >
      {children}
    </BaseToolbar.Group>
  );
}

export interface ToolbarButtonProps
  extends Omit<BaseToolbar.Button.Props, 'className'>,
    ButtonVariants {
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * A toolbar item styled like a `Button`. The button styles are applied directly
 * to the Base UI toolbar button so no nested interactive element is rendered.
 */
export function ToolbarButton({
  isDisabled,
  disabled,
  variant = 'quiet',
  size = 'md',
  className,
  children,
  ...props
}: ToolbarButtonProps) {
  return (
    <BaseToolbar.Button
      {...props}
      data-slot="toolbar-button"
      data-variant={variant}
      data-size={size}
      disabled={isDisabled ?? disabled}
      className={button({ variant, size, className })}
    >
      {children}
    </BaseToolbar.Button>
  );
}

export interface ToolbarLinkProps extends BaseToolbar.Link.Props {
  children?: ReactNode;
}

export function ToolbarLink({ className, children, ...props }: ToolbarLinkProps) {
  return (
    <BaseToolbar.Link {...props} data-slot="toolbar-link" className={className}>
      {children}
    </BaseToolbar.Link>
  );
}

export interface ToolbarSeparatorProps extends BaseToolbar.Separator.Props {}

/**
 * Separator for a `Toolbar`. The orientation is derived from the toolbar via the
 * `data-orientation` attribute set by Base UI, so it flips automatically inside a
 * vertical toolbar.
 */
export function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  return (
    <BaseToolbar.Separator
      {...props}
      data-slot="toolbar-separator"
      className={cn(
        'shrink-0 bg-edge-muted',
        // Base UI sets `data-orientation` to the separator's own orientation,
        // which is the inverse of the toolbar's.
        'data-[orientation=vertical]:mx-1 data-[orientation=vertical]:h-5 data-[orientation=vertical]:w-px data-[orientation=vertical]:self-center',
        'data-[orientation=horizontal]:my-1 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
        className,
      )}
    />
  );
}
