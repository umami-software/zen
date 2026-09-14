import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { CSSProperties, ReactNode } from 'react';
import { X } from '@/components/icons';
import { Button } from './Button';
import { Heading } from './Heading';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';
import { type OverlayTarget, useInsideOverlayTrigger, useOverlayTrigger } from './OverlayTrigger';
import { Text } from './Text';
import './Modal.css';
import './Overlay.css';

export interface ModalProps extends BaseDialog.Portal.Props {
  children?: ReactNode;
  /** Controlled open state. Only used when the modal is not wrapped in a `DialogTrigger`. */
  isOpen?: boolean;
  /** Initial open state. Only used when the modal is not wrapped in a `DialogTrigger`. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: 'center' | 'fullscreen';
  /** Renders a quiet close button in the top-right corner. */
  showCloseButton?: boolean;
  className?: string;
  style?: CSSProperties;
}

const placementClasses = {
  center: 'zen-modal-center max-h-[calc(100dvh-2rem)]',
  fullscreen: 'zen-modal-fullscreen w-dvw h-dvh rounded-none',
};

const viewportClasses = {
  center: 'p-4',
  fullscreen: '',
};

export function Modal({
  placement = 'center',
  children,
  className,
  style,
  isOpen,
  defaultOpen,
  onOpenChange,
  showCloseButton = false,
  ...props
}: ModalProps) {
  const { kind } = useOverlayTrigger();
  const isNested = useInsideOverlayTrigger();
  const isAlert = kind === 'alert-dialog';
  const popupClassName = cn('group/modal relative isolate', placementClasses[placement], className);
  const viewportClassName = cn(
    'zen-layer-modal fixed inset-0 flex items-center justify-center overflow-y-auto',
    viewportClasses[placement],
  );

  const closeButton = showCloseButton ? (
    isAlert ? (
      <BaseAlertDialog.Close
        data-slot="modal-close"
        className="absolute top-3 right-3 z-10"
        render={
          <Button variant="quiet" size="icon-sm" aria-label="Close">
            <Icon size="sm">
              <X />
            </Icon>
          </Button>
        }
      />
    ) : (
      <BaseDialog.Close
        data-slot="modal-close"
        className="absolute top-3 right-3 z-10"
        render={
          <Button variant="quiet" size="icon-sm" aria-label="Close">
            <Icon size="sm">
              <X />
            </Icon>
          </Button>
        }
      />
    )
  ) : null;

  const portal = isAlert ? (
    <BaseAlertDialog.Portal {...props}>
      <BaseAlertDialog.Backdrop
        data-slot="modal-backdrop"
        className="zen-modal-overlay zen-layer-backdrop fixed inset-0 bg-black/80"
      />
      <BaseAlertDialog.Viewport className={viewportClassName}>
        <BaseAlertDialog.Popup
          data-slot="modal"
          data-placement={placement}
          className={popupClassName}
          style={style}
        >
          {closeButton}
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  ) : (
    <BaseDialog.Portal {...props}>
      <BaseDialog.Backdrop
        data-slot="modal-backdrop"
        className="zen-modal-overlay zen-layer-backdrop fixed inset-0 bg-black/80"
      />
      <BaseDialog.Viewport className={viewportClassName}>
        <BaseDialog.Popup
          data-slot="modal"
          data-placement={placement}
          className={popupClassName}
          style={style}
        >
          {closeButton}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );

  if (isNested) {
    return portal;
  }

  // Standalone usage: own the open state instead of silently discarding it.
  return (
    <BaseDialog.Root
      {...(isOpen === undefined ? { defaultOpen } : { open: isOpen })}
      onOpenChange={onOpenChange}
    >
      {portal}
    </BaseDialog.Root>
  );
}

(Modal as typeof Modal & OverlayTarget).zenOverlayType = 'dialog';

/** Explicit, shadcn-style parts for composing a modal without the two-child `DialogTrigger`. */
export interface ModalTriggerProps extends BaseDialog.Trigger.Props {}

export function ModalTrigger(props: ModalTriggerProps) {
  return <BaseDialog.Trigger data-slot="modal-trigger" {...props} />;
}

export interface ModalCloseProps extends BaseDialog.Close.Props {}

export function ModalClose(props: ModalCloseProps) {
  return <BaseDialog.Close data-slot="modal-close" {...props} />;
}

export interface ModalTitleProps extends BaseDialog.Title.Props {}

export function ModalTitle({ className, ...props }: ModalTitleProps) {
  return (
    <BaseDialog.Title
      data-slot="modal-title"
      {...props}
      render={props.render ?? <Heading size="xl" />}
      className={className as string}
    />
  );
}

export interface ModalDescriptionProps extends BaseDialog.Description.Props {}

export function ModalDescription({ className, ...props }: ModalDescriptionProps) {
  return (
    <BaseDialog.Description
      data-slot="modal-description"
      {...props}
      render={props.render ?? <Text color="muted" />}
      className={className as string}
    />
  );
}
