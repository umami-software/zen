import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Menubar as BaseMenubar } from '@base-ui/react/menubar';
import type { ReactNode } from 'react';
import { Button } from './Button';
import { cn } from './lib/tailwind';
import { MenubarContext, MenuPrimitiveContext } from './OverlayTrigger';

export interface MenubarProps extends Omit<BaseMenubar.Props, 'disabled'> {
  isDisabled?: boolean;
  children?: ReactNode;
}

export function Menubar({ isDisabled, className, children, ...props }: MenubarProps) {
  return (
    <BaseMenubar
      {...props}
      data-slot="menubar"
      disabled={isDisabled}
      className={cn('flex items-center gap-1 w-fit isolate', className)}
    >
      {children}
    </BaseMenubar>
  );
}

export interface MenubarMenuProps extends Omit<BaseMenu.Root.Props, 'children' | 'disabled'> {
  label: ReactNode;
  isDisabled?: boolean;
  children?: ReactNode;
}

export function MenubarMenu({ label, isDisabled, children, ...props }: MenubarMenuProps) {
  return (
    <BaseMenu.Root {...props} disabled={isDisabled}>
      <BaseMenu.Trigger
        data-slot="menubar-trigger"
        render={
          <Button variant="quiet" size="sm" className="data-popup-open:bg-interactive">
            {label}
          </Button>
        }
      />
      <MenuPrimitiveContext.Provider value="menu">
        <MenubarContext.Provider value={true}>{children}</MenubarContext.Provider>
      </MenuPrimitiveContext.Provider>
    </BaseMenu.Root>
  );
}
