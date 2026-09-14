import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { createContext, forwardRef, type HTMLAttributes, useContext } from 'react';
import { Heading } from './Heading';
import { cn } from './lib/tailwind';
import { Text } from './Text';
import './Overlay.css';
import './Drawer.css';

/** Lets `DrawerContent` know whether the root is modal so it can skip rendering a backdrop. */
const DrawerModalContext = createContext<boolean | 'trap-focus'>(true);

export type DrawerProps = BaseDrawer.Root.Props;

export function Drawer({ modal = true, ...props }: DrawerProps) {
  return (
    <DrawerModalContext.Provider value={modal}>
      <BaseDrawer.Root modal={modal} {...props} />
    </DrawerModalContext.Provider>
  );
}

export const DrawerTrigger = BaseDrawer.Trigger;
export type DrawerTriggerProps = BaseDrawer.Trigger.Props;
export const DrawerClose = BaseDrawer.Close;
export type DrawerCloseProps = BaseDrawer.Close.Props;

export interface DrawerTitleProps extends BaseDrawer.Title.Props {}

export function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <BaseDrawer.Title
      data-slot="drawer-title"
      {...props}
      render={props.render ?? <Heading size="xl" />}
      className={className as string}
    />
  );
}

export interface DrawerDescriptionProps extends BaseDrawer.Description.Props {}

export function DrawerDescription({ className, ...props }: DrawerDescriptionProps) {
  return (
    <BaseDrawer.Description
      data-slot="drawer-description"
      {...props}
      render={props.render ?? <Text color="muted" />}
      className={className as string}
    />
  );
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div {...props} data-slot="drawer-header" className={cn('flex flex-col gap-1', className)} />
  );
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <div
      {...props}
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2', className)}
    />
  );
}

export interface DrawerContentProps extends BaseDrawer.Popup.Props {
  portalProps?: BaseDrawer.Portal.Props;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className, portalProps, ...props }, ref) => {
    const modal = useContext(DrawerModalContext);

    return (
      <BaseDrawer.Portal {...portalProps}>
        {/* A non-modal drawer must not dim or block the rest of the page. */}
        {modal !== false && (
          <BaseDrawer.Backdrop
            data-slot="drawer-backdrop"
            className="zen-drawer-backdrop zen-layer-backdrop fixed inset-0 bg-black/80"
          />
        )}
        <BaseDrawer.Viewport className="zen-layer-modal fixed inset-0 isolate pointer-events-none">
          <BaseDrawer.Popup
            {...props}
            ref={ref}
            data-slot="drawer"
            className={state =>
              cn(
                'zen-drawer pointer-events-auto border border-edge bg-surface text-fg shadow-xl outline-none',
                typeof className === 'function' ? className(state) : className,
              )
            }
          >
            <BaseDrawer.Content className="flex min-h-0 flex-col gap-4 overflow-auto p-6">
              {children}
            </BaseDrawer.Content>
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    );
  },
);

DrawerContent.displayName = 'DrawerContent';
