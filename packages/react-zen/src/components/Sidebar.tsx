import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  isValidElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { PanelLeft } from '@/components/icons';
import { Button, type ButtonProps } from './Button';
import { Input, type InputProps } from './Input';
import { mergeProps, useRender } from './lib/render';
import { cn } from './lib/tailwind';
import { Separator, type SeparatorProps } from './Separator';
import { Sheet, SheetDescription, SheetTitle } from './Sheet';
import { Skeleton } from './Skeleton';
import { Tooltip, type TooltipProps } from './Tooltip';
import { type SidebarMenuButtonVariants, sidebarMenuButton } from './variants';

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
/** Below Tailwind's `md` breakpoint the sidebar renders as a `Sheet`. */
const MOBILE_QUERY = '(max-width: 767px)';

function subscribeMobile(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

export interface SidebarContextValue {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean | ((open: boolean) => boolean)) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean | ((open: boolean) => boolean)) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

export interface SidebarProviderProps extends ComponentProps<'div'> {
  /** Initial desktop open state when uncontrolled. Defaults to `true`. */
  defaultOpen?: boolean;
  /** Controlled desktop open state. */
  open?: boolean;
  /** Compat alias for `open`. */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Key that toggles the sidebar together with Cmd (macOS) or Ctrl. Pass `false` to disable the
   * shortcut, for example when several providers are mounted on one page.
   *
   * @default 'b'
   */
  keyboardShortcut?: string | false;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  isOpen,
  onOpenChange,
  keyboardShortcut = SIDEBAR_KEYBOARD_SHORTCUT,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = useState(false);

  // Internal state, used when the open state is not controlled from outside.
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlledOpen = openProp ?? isOpen;
  const open = controlledOpen ?? uncontrolledOpen;

  const setOpen = useCallback(
    (value: boolean | ((open: boolean) => boolean)) => {
      const nextOpen = typeof value === 'function' ? value(open) : value;

      if (controlledOpen === undefined) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);

      // Persist the state so a server render can restore it on the next visit.
      // biome-ignore lint/suspicious/noDocumentCookie: synchronous write; the Cookie Store API is not available in every browser.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [controlledOpen, onOpenChange, open],
  );

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile(value => !value);
    } else {
      setOpen(value => !value);
    }
  }, [isMobile, setOpen]);

  useEffect(() => {
    if (!keyboardShortcut) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === keyboardShortcut.toLowerCase() &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardShortcut, toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = useMemo<SidebarContextValue>(
    () => ({ state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, open, setOpen, isMobile, openMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            '--sidebar-width': SIDEBAR_WIDTH,
            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
            ...style,
          } as CSSProperties
        }
        className={cn('group/sidebar-wrapper flex min-h-svh w-full', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarProps extends ComponentProps<'div'> {
  side?: 'left' | 'right';
  variant?: 'sidebar' | 'floating' | 'inset';
  /**
   * How the sidebar collapses on desktop: slide off canvas, shrink to icons, or not at all.
   *
   * @default 'offcanvas'
   */
  collapsible?: 'offcanvas' | 'icon' | 'none';
}

export function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        className={cn('flex h-full w-(--sidebar-width) flex-col bg-surface text-fg', className)}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet
        isOpen={openMobile}
        onOpenChange={setOpenMobile}
        side={side}
        size={SIDEBAR_WIDTH_MOBILE}
        showCloseButton={false}
        className="bg-surface p-0 text-fg"
        style={{ '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as CSSProperties}
      >
        <div className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </div>
        {/* `Sheet` forwards extra props to the portal, so the sidebar attributes live here. */}
        <div
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="flex h-full w-full flex-col"
        >
          {children}
        </div>
      </Sheet>
    );
  }

  const isInset = variant === 'floating' || variant === 'inset';

  return (
    <div
      // `order-last` keeps a right-side sidebar on the right while it stays first in the DOM,
      // which the `peer-*` selectors on `SidebarInset` rely on.
      className="group peer hidden text-fg md:block data-[side=right]:order-last"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* Reserves the sidebar's width in the page flow on desktop. */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
          'motion-reduce:transition-none',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[side=right]:rotate-180',
          isInset
            ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
        )}
      />
      <div
        data-slot="sidebar-container"
        data-side={side}
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex',
          'transition-[left,right,width] duration-200 ease-linear motion-reduce:transition-none',
          side === 'left'
            ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          isInset
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'border-edge group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            'flex size-full flex-col bg-surface',
            'group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border',
            'group-data-[variant=floating]:border-edge group-data-[variant=floating]:shadow-sm',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface SidebarTriggerProps extends ButtonProps {}

export function SidebarTrigger({ className, onClick, children, ...props }: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="quiet"
      size="icon-sm"
      className={className}
      aria-label="Toggle Sidebar"
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      {...props}
    >
      {children ?? <PanelLeft />}
    </Button>
  );
}

export interface SidebarRailProps extends ComponentProps<'button'> {}

export function SidebarRail({ className, onClick, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      title="Toggle Sidebar"
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex',
        'group-data-[side=left]:-right-4 group-data-[side=right]:left-0',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-edge',
        'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full',
        'hover:group-data-[collapsible=offcanvas]:bg-surface',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className,
      )}
      {...props}
    />
  );
}

export interface SidebarInsetProps extends ComponentProps<'main'> {}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full flex-1 flex-col bg-surface',
        'md:peer-data-[variant=inset]:m-2',
        'md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:border',
        'md:peer-data-[variant=inset]:border-edge md:peer-data-[variant=inset]:shadow-sm',
        // The expanded sidebar already supplies the gap on the side it sits on.
        'md:peer-data-[variant=inset]:peer-data-[state=expanded]:peer-data-[side=left]:ml-0',
        'md:peer-data-[variant=inset]:peer-data-[state=expanded]:peer-data-[side=right]:mr-0',
        className,
      )}
      {...props}
    />
  );
}

export interface SidebarInputProps extends InputProps {}

export function SidebarInput({ className, ...props }: SidebarInputProps) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn('h-8 w-full bg-surface shadow-none', className)}
      {...props}
    />
  );
}

export interface SidebarHeaderProps extends ComponentProps<'div'> {}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

export interface SidebarFooterProps extends ComponentProps<'div'> {}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
}

export interface SidebarSeparatorProps extends SeparatorProps {}

export function SidebarSeparator({ className, ...props }: SidebarSeparatorProps) {
  return (
    <Separator
      data-sidebar="separator"
      className={cn('mx-2 bg-edge data-[orientation=horizontal]:w-auto', className)}
      {...props}
    />
  );
}

export interface SidebarContentProps extends ComponentProps<'div'> {}

export function SidebarContent({ className, ...props }: SidebarContentProps) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto',
        'group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

export interface SidebarGroupProps extends ComponentProps<'div'> {}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
}

export interface SidebarGroupLabelProps extends useRender.ComponentProps<'div'> {}

export function SidebarGroupLabel({ className, render, ref, ...props }: SidebarGroupLabelProps) {
  return useRender({
    defaultTagName: 'div',
    ref,
    render,
    props: mergeProps<'div'>(
      {
        className: cn(
          'flex h-8 shrink-0 items-center rounded px-2 text-xs font-medium text-fg-muted outline-none',
          'transition-[margin,opacity] duration-200 ease-linear motion-reduce:transition-none',
          'focus-visible:ring-2 focus-visible:ring-focus-ring',
          '[&>svg]:size-4 [&>svg]:shrink-0',
          'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
          className,
        ),
      },
      props,
    ),
    state: { slot: 'sidebar-group-label', sidebar: 'group-label' },
  });
}

export interface SidebarGroupActionProps extends useRender.ComponentProps<'button'> {}

export function SidebarGroupAction({ className, render, ref, ...props }: SidebarGroupActionProps) {
  return useRender({
    defaultTagName: 'button',
    ref,
    render,
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded p-0',
          'text-fg cursor-pointer outline-none transition-transform',
          'hover:bg-interactive focus-visible:ring-2 focus-visible:ring-focus-ring',
          '[&>svg]:size-4 [&>svg]:shrink-0',
          // Increases the hit area of the button on mobile.
          'after:absolute after:-inset-2 md:after:hidden',
          'group-data-[collapsible=icon]:hidden',
          className,
        ),
      },
      props,
    ),
    state: { slot: 'sidebar-group-action', sidebar: 'group-action' },
  });
}

export interface SidebarGroupContentProps extends ComponentProps<'div'> {}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('w-full text-sm', className)}
      {...props}
    />
  );
}

export interface SidebarMenuProps extends ComponentProps<'ul'> {}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn('flex w-full min-w-0 flex-col gap-1', className)}
      {...props}
    />
  );
}

export interface SidebarMenuItemProps extends ComponentProps<'li'> {}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn('group/menu-item relative', className)}
      {...props}
    />
  );
}

export interface SidebarMenuButtonProps
  extends useRender.ComponentProps<'button'>,
    SidebarMenuButtonVariants {
  /** Marks the button as the current page or selection. Sets `data-active`. */
  isActive?: boolean;
  /**
   * Shown beside the button while the sidebar is collapsed to icons. Pass content, or `Tooltip`
   * props such as `{ children, side }` for more control.
   */
  tooltip?: ReactNode | TooltipProps;
}

function isTooltipProps(value: SidebarMenuButtonProps['tooltip']): value is TooltipProps {
  return (
    typeof value === 'object' && value !== null && !isValidElement(value) && !Array.isArray(value)
  );
}

export function SidebarMenuButton({
  render,
  ref,
  isActive = false,
  variant = 'default',
  size = 'md',
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar();
  const hasTooltip = tooltip !== undefined && tooltip !== null && tooltip !== false;

  const button = useRender({
    defaultTagName: 'button',
    ref,
    render: hasTooltip ? <BaseTooltip.Trigger render={render} /> : render,
    props: mergeProps<'button'>(
      { className: sidebarMenuButton({ variant, size, className }) },
      props,
    ),
    state: { slot: 'sidebar-menu-button', sidebar: 'menu-button', size, active: isActive },
  });

  if (!hasTooltip) {
    return button;
  }

  const tooltipProps = isTooltipProps(tooltip) ? tooltip : { children: tooltip };

  return (
    <BaseTooltip.Root disabled={state !== 'collapsed' || isMobile}>
      {button}
      <Tooltip side="right" align="center" {...tooltipProps} />
    </BaseTooltip.Root>
  );
}

export interface SidebarMenuActionProps extends useRender.ComponentProps<'button'> {
  /** Only show the action while its menu item is hovered or focused (desktop). */
  showOnHover?: boolean;
}

export function SidebarMenuAction({
  className,
  render,
  ref,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  return useRender({
    defaultTagName: 'button',
    ref,
    render,
    props: mergeProps<'button'>(
      {
        className: cn(
          'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded p-0',
          'text-fg cursor-pointer outline-none transition-transform',
          'hover:bg-interactive focus-visible:ring-2 focus-visible:ring-focus-ring',
          '[&>svg]:size-4 [&>svg]:shrink-0',
          // Increases the hit area of the button on mobile.
          'after:absolute after:-inset-2 md:after:hidden',
          'peer-data-[size=sm]/menu-button:top-1',
          'peer-data-[size=md]/menu-button:top-1.5',
          'peer-data-[size=lg]/menu-button:top-2.5',
          'group-data-[collapsible=icon]:hidden',
          showOnHover &&
            'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-popup-open:opacity-100 aria-expanded:opacity-100 md:opacity-0',
          className,
        ),
      },
      props,
    ),
    state: { slot: 'sidebar-menu-action', sidebar: 'menu-action' },
  });
}

export interface SidebarMenuBadgeProps extends ComponentProps<'div'> {}

export function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded px-1',
        'text-xs font-medium text-fg tabular-nums select-none',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=md]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export interface SidebarMenuSkeletonProps extends ComponentProps<'div'> {
  showIcon?: boolean;
}

export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonProps) {
  // A width between 50% and 90%, derived from the id so server and client render the same value.
  const id = useId();
  const width = useMemo(() => {
    let hash = 0;
    for (const char of id) {
      hash = (hash * 31 + char.charCodeAt(0)) | 0;
    }
    return `${(Math.abs(hash) % 40) + 50}%`;
  }, [id]);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn('flex h-8 items-center gap-2 rounded px-2', className)}
      {...props}
    >
      {showIcon && (
        <Skeleton data-sidebar="menu-skeleton-icon" className="size-4 shrink-0 rounded" />
      )}
      <Skeleton
        data-sidebar="menu-skeleton-text"
        className="h-4 max-w-(--skeleton-width) flex-1"
        style={{ '--skeleton-width': width } as CSSProperties}
      />
    </div>
  );
}

export interface SidebarMenuSubProps extends ComponentProps<'ul'> {}

export function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-edge px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export interface SidebarMenuSubItemProps extends ComponentProps<'li'> {}

export function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn('group/menu-sub-item relative', className)}
      {...props}
    />
  );
}

export interface SidebarMenuSubButtonProps extends useRender.ComponentProps<'a'> {
  size?: 'sm' | 'md';
  /** Marks the link as the current page or selection. Sets `data-active`. */
  isActive?: boolean;
}

export function SidebarMenuSubButton({
  render,
  ref,
  size = 'md',
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  return useRender({
    defaultTagName: 'a',
    ref,
    render,
    props: mergeProps<'a'>(
      {
        className: cn(
          'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded px-2',
          'text-fg cursor-pointer outline-none',
          'hover:bg-interactive active:bg-interactive-hover',
          'focus-visible:ring-2 focus-visible:ring-focus-ring',
          'disabled:pointer-events-none disabled:opacity-50',
          'aria-disabled:pointer-events-none aria-disabled:opacity-50',
          'data-active:bg-interactive data-active:font-medium',
          'data-[size=sm]:text-xs data-[size=md]:text-sm',
          '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
          'group-data-[collapsible=icon]:hidden',
          className,
        ),
      },
      props,
    ),
    state: { slot: 'sidebar-menu-sub-button', sidebar: 'menu-sub-button', size, active: isActive },
  });
}
