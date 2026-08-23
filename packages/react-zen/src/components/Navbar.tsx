import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { createContext, type HTMLAttributes, type ReactNode, useContext } from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from './lib/tailwind';
import { Text } from './Text';
import './Overlay.css';

interface NavbarContextValue {
  showArrow: boolean;
}

const NavbarContext = createContext<NavbarContextValue>({ showArrow: true });

const triggerClassName = cn(
  'flex items-center gap-1 select-none cursor-pointer rounded-md px-3 py-2',
  'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-medium text-foreground-primary bg-transparent border-0',
  'hover:bg-interactive data-[popup-open]:bg-interactive',
  'outline-none [&:focus-visible]:outline-2 [&:focus-visible]:outline-offset-1 [&:focus-visible]:outline-focus-ring',
);

const itemLinkClassName = cn(
  'flex items-center gap-1 select-none cursor-pointer rounded-md px-3 py-2',
  'hover:bg-interactive',
  'outline-none [&:focus-visible]:outline-2 [&:focus-visible]:outline-offset-1 [&:focus-visible]:outline-focus-ring',
);

const contentClassName = cn(
  'w-max',
  // Menu already provides the popup padding. Let the shared navbar popup own
  // the surface so nested menus do not render a second border and shadow.
  '[&>[role=menu]]:border-0 [&>[role=menu]]:rounded-none [&>[role=menu]]:shadow-none',
  'transition-[opacity,transform,translate] duration-(--duration) ease-(--easing)',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0',
  'data-[starting-style]:data-[activation-direction=left]:translate-x-[-50%]',
  'data-[starting-style]:data-[activation-direction=right]:translate-x-[50%]',
  'data-[ending-style]:data-[activation-direction=left]:translate-x-[50%]',
  'data-[ending-style]:data-[activation-direction=right]:translate-x-[-50%]',
);

const positionerClassName = cn(
  'box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)',
  'transition-[top,left,right,bottom] duration-(--duration) ease-(--easing)',
  'data-[instant]:transition-none',
  // Invisible bridge so the pointer can travel from trigger to popup without closing.
  'before:absolute before:content-[""]',
  'data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5',
  'data-[side=top]:before:bottom-[-10px] data-[side=top]:before:right-0 data-[side=top]:before:left-0 data-[side=top]:before:h-2.5',
);

const popupClassName = cn(
  'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin)',
  // `overflow-hidden` clips the nested menu's square background to the rounded
  // corners so the popup border stays visible all the way around.
  'overflow-hidden rounded-md border border-edge bg-surface-base shadow-lg outline-none',
  'transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing)',
  'data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
  'data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:duration-150 data-[ending-style]:ease-[ease]',
);

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Shows the dropdown arrow on items that have a label. Defaults to `true`. */
  showArrow?: boolean;
}

export function Navbar({
  showArrow = true,
  className,
  children,
  color: _color,
  ...props
}: NavbarProps) {
  return (
    <NavbarContext.Provider value={{ showArrow }}>
      <BaseNavigationMenu.Root className={cn('relative', className)} {...props}>
        <BaseNavigationMenu.List className="flex items-center gap-1">
          {children}
        </BaseNavigationMenu.List>
        <BaseNavigationMenu.Portal>
          <BaseNavigationMenu.Positioner
            className={cn('zen-layer-floating', positionerClassName)}
            sideOffset={10}
            collisionPadding={16}
            style={{
              ['--duration' as string]: '0.35s',
              ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <BaseNavigationMenu.Popup className={popupClassName}>
              <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
            </BaseNavigationMenu.Popup>
          </BaseNavigationMenu.Positioner>
        </BaseNavigationMenu.Portal>
      </BaseNavigationMenu.Root>
    </NavbarContext.Provider>
  );
}

export interface NavbarItemProps extends HTMLAttributes<HTMLElement> {
  /** Item label. When provided, the item becomes a trigger with a dropdown built from `children`. */
  label?: string;
  children?: ReactNode;
}

export function NavbarItem({
  label,
  children,
  className,
  color: _color,
  ...props
}: NavbarItemProps) {
  const { showArrow } = useContext(NavbarContext);

  if (label) {
    return (
      <BaseNavigationMenu.Item {...props}>
        <BaseNavigationMenu.Trigger className={cn(triggerClassName, className)}>
          <Text>{label}</Text>
          {showArrow && (
            <BaseNavigationMenu.Icon className="flex text-foreground-muted transition-transform duration-200 ease-in-out data-[popup-open]:rotate-180">
              <ChevronDown className="size-4" />
            </BaseNavigationMenu.Icon>
          )}
        </BaseNavigationMenu.Trigger>
        <BaseNavigationMenu.Content className={contentClassName}>
          {children}
        </BaseNavigationMenu.Content>
      </BaseNavigationMenu.Item>
    );
  }

  return (
    <BaseNavigationMenu.Item {...props} className={cn(itemLinkClassName, className)}>
      {children}
    </BaseNavigationMenu.Item>
  );
}

export interface NavbarLinkProps extends BaseNavigationMenu.Link.Props {}

/** A semantic navigation link. Renders an `<a>` element and integrates with keyboard navigation. */
export function NavbarLink({ className, ...props }: NavbarLinkProps) {
  return (
    <BaseNavigationMenu.Link
      className={cn(
        'flex items-center gap-1 select-none rounded-md px-3 py-2 no-underline text-foreground-primary',
        'hover:bg-interactive',
        'outline-none [&:focus-visible]:outline-2 [&:focus-visible]:outline-offset-1 [&:focus-visible]:outline-focus-ring',
        className as string,
      )}
      {...props}
    />
  );
}
