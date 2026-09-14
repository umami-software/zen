import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Command as CommandPrimitive } from 'cmdk';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { Search } from '@/components/icons';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';
import { Modal } from './Modal';
import { ScrollArea } from './ScrollArea';

export interface CommandProps extends ComponentProps<typeof CommandPrimitive> {}

export function Command({ className, children, ...props }: CommandProps) {
  return (
    <CommandPrimitive
      {...props}
      data-slot="command"
      className={cn(
        'flex size-full flex-col overflow-hidden rounded-md bg-surface-overlay text-fg',
        className,
      )}
    >
      {children}
    </CommandPrimitive>
  );
}

export interface CommandInputProps extends ComponentProps<typeof CommandPrimitive.Input> {}

export function CommandInput({ className, ...props }: CommandInputProps) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-3 border-b border-edge px-3"
    >
      <Icon size="sm" className="shrink-0 text-fg-muted">
        <Search />
      </Icon>
      <CommandPrimitive.Input
        {...props}
        data-slot="command-input"
        className={cn(
          'flex h-full w-full bg-transparent py-3 text-sm outline-none',
          'placeholder:text-fg-muted',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:text-fg-disabled',
          className,
        )}
      />
    </div>
  );
}

export interface CommandListProps extends ComponentProps<typeof CommandPrimitive.List> {
  /** When set, the list is wrapped in a `ScrollArea` capped at this height. */
  maxHeight?: string | number;
}

export function CommandList({ maxHeight, className, ...props }: CommandListProps) {
  const list = (
    <CommandPrimitive.List
      {...props}
      data-slot="command-list"
      className={cn(
        'p-2 overflow-x-hidden',
        maxHeight === undefined && 'max-h-[300px] overflow-y-auto',
        className,
      )}
    />
  );

  if (maxHeight === undefined) {
    return list;
  }

  return <ScrollArea maxHeight={maxHeight}>{list}</ScrollArea>;
}

export interface CommandEmptyProps extends ComponentProps<typeof CommandPrimitive.Empty> {}

export function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  return (
    <CommandPrimitive.Empty
      {...props}
      data-slot="command-empty"
      className={cn('py-6 text-center text-sm text-fg-muted', className)}
    />
  );
}

export interface CommandGroupProps extends ComponentProps<typeof CommandPrimitive.Group> {}

export function CommandGroup({ className, ...props }: CommandGroupProps) {
  return (
    <CommandPrimitive.Group
      {...props}
      data-slot="command-group"
      className={cn(
        'overflow-hidden [&:not(:last-child)]:mb-2',
        '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5',
        '[&_[cmdk-group-heading]]:text-sm [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-fg-muted',
        className,
      )}
    />
  );
}

export interface CommandItemProps extends ComponentProps<typeof CommandPrimitive.Item> {
  icon?: ReactNode;
  /** Compat alias for the native `disabled` prop. */
  isDisabled?: boolean;
}

export function CommandItem({
  icon,
  isDisabled,
  disabled,
  className,
  children,
  ...props
}: CommandItemProps) {
  return (
    <CommandPrimitive.Item
      {...props}
      data-slot="command-item"
      disabled={isDisabled ?? disabled}
      className={cn(
        'flex items-center gap-3 px-2 py-1.5 rounded cursor-pointer outline-none text-sm',
        'data-[selected=true]:bg-interactive',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:text-fg-disabled data-[disabled=true]:opacity-50 data-[disabled=true]:cursor-default',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
    >
      {icon && <Icon size="sm">{icon}</Icon>}
      {children}
    </CommandPrimitive.Item>
  );
}

export interface CommandSeparatorProps extends ComponentProps<typeof CommandPrimitive.Separator> {}

export function CommandSeparator({ className, ...props }: CommandSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      {...props}
      data-slot="command-separator"
      className={cn('h-px bg-edge-muted my-2 -mx-2', className)}
    />
  );
}

export interface CommandShortcutProps extends HTMLAttributes<HTMLSpanElement> {}

export function CommandShortcut({ className, ...props }: CommandShortcutProps) {
  return (
    <span
      {...props}
      data-slot="command-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-fg-muted', className)}
    />
  );
}

export interface CommandDialogProps extends Omit<CommandProps, 'title'> {
  /** Compat alias for `open`. */
  isOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  description?: ReactNode;
}

export function CommandDialog({
  isOpen,
  open,
  onOpenChange,
  title = 'Command Palette',
  description = 'Search for a command to run.',
  children,
  ...props
}: CommandDialogProps) {
  return (
    <BaseDialog.Root open={open ?? isOpen} onOpenChange={onOpenChange}>
      <Modal>
        <div className="sr-only">
          <BaseDialog.Title>{title}</BaseDialog.Title>
          <BaseDialog.Description>{description}</BaseDialog.Description>
        </div>
        <Command
          {...props}
          className={cn(
            'w-[32rem] max-w-[calc(100dvw-2rem)] border border-edge shadow-xl',
            '**:data-[slot=command-input-wrapper]:h-12',
            props.className,
          )}
        >
          {children}
        </Command>
      </Modal>
    </BaseDialog.Root>
  );
}
