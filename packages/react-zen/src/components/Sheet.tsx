import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Children, type CSSProperties, isValidElement, type ReactNode } from 'react';
import { X } from '@/components/icons';
import { Button } from './Button';
import { Heading } from './Heading';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';
import { type OverlayTarget, useInsideOverlayTrigger } from './OverlayTrigger';
import { Text } from './Text';
import './Modal.css';
import './Overlay.css';

export interface SheetProps extends BaseDialog.Portal.Props {
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: string | number;
  /** Controlled open state. Only used when the sheet is not wrapped in a `DialogTrigger`. */
  isOpen?: boolean;
  /** Initial open state. Only used when the sheet is not wrapped in a `DialogTrigger`. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Renders a close button in the top-right corner. Defaults to `true` unless a `SheetHeader`
   * (which renders its own close button) is present, so there is never more than one.
   */
  showCloseButton?: boolean;
  className?: string;
  style?: CSSProperties;
}

const sideClasses = {
  left: 'zen-modal-left absolute inset-y-0 left-0 h-full border-r',
  right: 'zen-modal-right absolute inset-y-0 right-0 h-full border-l',
  top: 'zen-modal-top absolute inset-x-0 top-0 w-full border-b',
  bottom: 'zen-modal-bottom absolute inset-x-0 bottom-0 w-full border-t',
};

/** Shallow scan for a `SheetHeader` so the sheet does not render a second close button. */
function hasSheetHeader(node: ReactNode, depth = 0): boolean {
  if (depth > 4) {
    return false;
  }

  return Children.toArray(node).some(child => {
    if (!isValidElement(child)) {
      return false;
    }
    if (child.type === SheetHeader) {
      return (child.props as SheetHeaderProps).showClose !== false;
    }
    return hasSheetHeader((child.props as { children?: ReactNode }).children, depth + 1);
  });
}

export function Sheet({
  side = 'right',
  size,
  children,
  className,
  style,
  isOpen,
  defaultOpen,
  onOpenChange,
  showCloseButton,
  ...props
}: SheetProps) {
  const isNested = useInsideOverlayTrigger();
  const isHorizontal = side === 'left' || side === 'right';
  const sheetStyle = {
    ...(isHorizontal
      ? { width: size ?? '24rem', maxWidth: '100dvw' }
      : { height: size, maxHeight: '100dvh' }),
    ...style,
  } as CSSProperties;
  const showClose = showCloseButton ?? !hasSheetHeader(children);

  const portal = (
    <BaseDialog.Portal {...props}>
      <BaseDialog.Backdrop
        data-slot="sheet-backdrop"
        className="zen-modal-overlay zen-layer-backdrop fixed inset-0 bg-black/80"
      />
      <BaseDialog.Viewport className="zen-layer-modal fixed inset-0 isolate">
        <BaseDialog.Popup
          data-slot="sheet"
          data-side={side}
          className={cn(
            'relative p-6 overflow-auto outline-none',
            'bg-surface border-edge shadow-xl',
            sideClasses[side],
            className,
          )}
          style={sheetStyle}
        >
          {showClose && (
            <BaseDialog.Close
              data-slot="sheet-close"
              className="absolute top-4 right-4 z-10"
              render={
                <Button variant="quiet" size="icon-sm" aria-label="Close">
                  <Icon size="sm">
                    <X />
                  </Icon>
                </Button>
              }
            />
          )}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );

  if (isNested) {
    return portal;
  }

  return (
    <BaseDialog.Root
      {...(isOpen === undefined ? { defaultOpen } : { open: isOpen })}
      onOpenChange={onOpenChange}
    >
      {portal}
    </BaseDialog.Root>
  );
}

(Sheet as typeof Sheet & OverlayTarget).zenOverlayType = 'dialog';

export interface SheetHeaderProps {
  title?: ReactNode;
  showClose?: boolean;
  className?: string;
  children?: ReactNode;
}

export function SheetHeader({ title, showClose = true, className, children }: SheetHeaderProps) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex items-start justify-between gap-3 mb-4', className)}
    >
      <div className="flex flex-col gap-1">
        {title && (
          <BaseDialog.Title data-slot="sheet-title" render={<Heading size="xl" />}>
            {title}
          </BaseDialog.Title>
        )}
        {children}
      </div>
      {showClose && (
        <BaseDialog.Close
          data-slot="sheet-close"
          render={
            <Button variant="quiet" size="xs" aria-label="Close">
              <Icon size="sm">
                <X />
              </Icon>
            </Button>
          }
        />
      )}
    </div>
  );
}

/** Explicit, shadcn-style parts. */
export interface SheetTriggerProps extends BaseDialog.Trigger.Props {}

export function SheetTrigger(props: SheetTriggerProps) {
  return <BaseDialog.Trigger data-slot="sheet-trigger" {...props} />;
}

export interface SheetCloseProps extends BaseDialog.Close.Props {}

export function SheetClose(props: SheetCloseProps) {
  return <BaseDialog.Close data-slot="sheet-close" {...props} />;
}

export interface SheetTitleProps extends BaseDialog.Title.Props {}

export function SheetTitle({ className, ...props }: SheetTitleProps) {
  return (
    <BaseDialog.Title
      data-slot="sheet-title"
      {...props}
      render={props.render ?? <Heading size="xl" />}
      className={className as string}
    />
  );
}

export interface SheetDescriptionProps extends BaseDialog.Description.Props {}

export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return (
    <BaseDialog.Description
      data-slot="sheet-description"
      {...props}
      render={props.render ?? <Text color="muted" />}
      className={className as string}
    />
  );
}
