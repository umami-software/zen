import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { forwardRef } from 'react';
import { cn } from './lib/tailwind';
import './Overlay.css';
import './Drawer.css';

export const Drawer = BaseDrawer.Root;
export type DrawerProps = BaseDrawer.Root.Props;
export const DrawerTrigger = BaseDrawer.Trigger;
export type DrawerTriggerProps = BaseDrawer.Trigger.Props;
export const DrawerClose = BaseDrawer.Close;
export type DrawerCloseProps = BaseDrawer.Close.Props;
export const DrawerTitle = BaseDrawer.Title;
export type DrawerTitleProps = BaseDrawer.Title.Props;
export const DrawerDescription = BaseDrawer.Description;
export type DrawerDescriptionProps = BaseDrawer.Description.Props;

export interface DrawerContentProps extends BaseDrawer.Popup.Props {
  portalProps?: BaseDrawer.Portal.Props;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className, portalProps, ...props }, ref) => (
    <BaseDrawer.Portal {...portalProps}>
      <BaseDrawer.Backdrop className="zen-drawer-backdrop zen-layer-backdrop fixed inset-0 bg-black/80" />
      <BaseDrawer.Viewport className="zen-layer-modal fixed inset-0 pointer-events-none">
        <BaseDrawer.Popup
          {...props}
          ref={ref}
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
  ),
);

DrawerContent.displayName = 'DrawerContent';
