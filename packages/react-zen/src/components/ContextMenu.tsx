import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Children, type ReactElement, type ReactNode } from 'react';
import { cn } from './lib/tailwind';
import { Menu, type MenuProps } from './Menu';
import { MenuPrimitiveContext } from './OverlayTrigger';

export interface ContextMenuProps
  extends Omit<BaseContextMenu.Root.Props, 'children' | 'onOpenChange'> {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ContextMenu({ children, isOpen, open, onOpenChange, ...props }: ContextMenuProps) {
  const items = Children.toArray(children) as ReactElement[];

  return (
    <BaseContextMenu.Root {...props} open={isOpen ?? open} onOpenChange={onOpenChange}>
      <ContextMenuTrigger render={items[0]} />
      <MenuPrimitiveContext.Provider value="context-menu">{items[1]}</MenuPrimitiveContext.Provider>
    </BaseContextMenu.Root>
  );
}

/** Explicit, shadcn-style parts. */
export interface ContextMenuTriggerProps extends BaseContextMenu.Trigger.Props {}

export function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return (
    <BaseContextMenu.Trigger
      data-slot="context-menu-trigger"
      {...props}
      className={state =>
        cn(
          'select-none',
          typeof className === 'function' ? className(state) : (className as string),
        )
      }
    />
  );
}

export const ContextMenuRoot = BaseContextMenu.Root;
export type ContextMenuRootProps = BaseContextMenu.Root.Props;

export interface ContextMenuContentProps extends MenuProps {}

/** The context menu popup. Selects the context-menu primitives regardless of how it is composed. */
export function ContextMenuContent(props: ContextMenuContentProps) {
  return (
    <MenuPrimitiveContext.Provider value="context-menu">
      <Menu {...props} />
    </MenuPrimitiveContext.Provider>
  );
}
