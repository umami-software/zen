import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu';
import { createContext, type HTMLAttributes, type ReactNode, useContext } from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from '@/lib/utils';

interface NavbarContextValue {
  showArrow: boolean;
}

const NavbarContext = createContext<NavbarContextValue>({ showArrow: true });

/** True inside a `NavbarItem` dropdown, so `NavbarLink` renders as a menu row. */
const NavbarContentContext = createContext(false);

const triggerClassName = cn(
  'inline-flex h-9 w-max items-center justify-center gap-1 rounded-lg bg-background px-2.5 py-1.5 text-sm font-medium transition-all outline-none select-none',
  'hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
  'disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted',
);

const linkClassName = cn(
  'inline-flex h-9 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium no-underline transition-all outline-none select-none',
  'hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
  'data-active:bg-muted/50',
);

const contentLinkClassName = cn(
  'flex items-center gap-2 rounded-md px-1.5 py-1 text-sm no-underline transition-all outline-none select-none',
  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50',
  'data-active:bg-muted/50 [&_svg:not([class*=size-])]:size-(--icon-size)',
);

const contentClassName = cn(
  'flex w-max min-w-40 flex-col gap-0.5 p-1',
  'transition-[opacity,transform,translate] duration-(--duration) ease-(--easing)',
  'data-starting-style:opacity-0 data-ending-style:opacity-0',
  'data-starting-style:data-[activation-direction=left]:translate-x-[-50%]',
  'data-starting-style:data-[activation-direction=right]:translate-x-[50%]',
  'data-ending-style:data-[activation-direction=left]:translate-x-[50%]',
  'data-ending-style:data-[activation-direction=right]:translate-x-[-50%]',
);

const positionerClassName = cn(
  'isolate z-50 box-border h-(--positioner-height) w-(--positioner-width) max-w-(--available-width)',
  'transition-[top,left,right,bottom] duration-(--duration) ease-(--easing)',
  'data-instant:transition-none',
  // Invisible bridge so the pointer can travel from trigger to popup without closing.
  'before:absolute before:content-[""]',
  'data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0 data-[side=bottom]:before:h-2.5',
  'data-[side=top]:before:bottom-[-10px] data-[side=top]:before:right-0 data-[side=top]:before:left-0 data-[side=top]:before:h-2.5',
);

const popupClassName = cn(
  'relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) overflow-hidden',
  'rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none',
  'transition-[opacity,transform,width,height,scale,translate] duration-(--duration) ease-(--easing)',
  'data-starting-style:scale-95 data-starting-style:opacity-0',
  'data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-ending-style:ease-[ease]',
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
      <BaseNavigationMenu.Root
        data-slot="navbar"
        className={cn('relative isolate', className)}
        {...props}
      >
        <BaseNavigationMenu.List data-slot="navbar-list" className="flex items-center gap-1">
          {children}
        </BaseNavigationMenu.List>
        <BaseNavigationMenu.Portal>
          <BaseNavigationMenu.Positioner
            className={positionerClassName}
            sideOffset={8}
            collisionPadding={16}
            style={{
              ['--duration' as string]: '0.35s',
              ['--easing' as string]: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <BaseNavigationMenu.Popup data-slot="navbar-popup" className={popupClassName}>
              <BaseNavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
            </BaseNavigationMenu.Popup>
          </BaseNavigationMenu.Positioner>
        </BaseNavigationMenu.Portal>
      </BaseNavigationMenu.Root>
    </NavbarContext.Provider>
  );
}

export interface NavbarItemProps extends HTMLAttributes<HTMLElement> {
  /**
   * Item label. When provided, the item becomes a trigger with a dropdown built from
   * `children` (typically `NavbarLink`s).
   */
  label?: ReactNode;
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
      <BaseNavigationMenu.Item data-slot="navbar-item" {...props}>
        <BaseNavigationMenu.Trigger
          data-slot="navbar-trigger"
          className={cn(triggerClassName, className)}
        >
          {label}
          {showArrow && (
            <BaseNavigationMenu.Icon className="flex text-muted-foreground transition-transform duration-200 ease-in-out data-popup-open:rotate-180">
              <ChevronDown className="size-3.5" />
            </BaseNavigationMenu.Icon>
          )}
        </BaseNavigationMenu.Trigger>
        <BaseNavigationMenu.Content data-slot="navbar-content" className={contentClassName}>
          <NavbarContentContext.Provider value={true}>{children}</NavbarContentContext.Provider>
        </BaseNavigationMenu.Content>
      </BaseNavigationMenu.Item>
    );
  }

  return (
    <BaseNavigationMenu.Item
      data-slot="navbar-item"
      {...props}
      className={cn('flex items-center', className)}
    >
      {children}
    </BaseNavigationMenu.Item>
  );
}

export interface NavbarLinkProps extends BaseNavigationMenu.Link.Props {}

/**
 * A semantic navigation link. Renders an `<a>` element and integrates with keyboard
 * navigation. Inside a `NavbarItem` dropdown it renders as a menu row.
 */
export function NavbarLink({ className, ...props }: NavbarLinkProps) {
  const inContent = useContext(NavbarContentContext);

  return (
    <BaseNavigationMenu.Link
      data-slot="navbar-link"
      className={state =>
        cn(
          inContent ? contentLinkClassName : linkClassName,
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    />
  );
}
