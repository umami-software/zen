import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { CSSProperties, ReactNode } from 'react';
import { X } from '@/components/icons';
import { Button } from './Button';
import { Heading } from './Heading';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';
import type { OverlayTarget } from './OverlayTrigger';
import './Modal.css';
import './Overlay.css';

export interface SheetProps extends BaseDialog.Portal.Props {
  children?: ReactNode;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: string | number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
}

const sideClasses = {
  left: 'zen-modal-left absolute inset-y-0 left-0 h-full border-r',
  right: 'zen-modal-right absolute inset-y-0 right-0 h-full border-l',
  top: 'zen-modal-top absolute inset-x-0 top-0 w-full border-b',
  bottom: 'zen-modal-bottom absolute inset-x-0 bottom-0 w-full border-t',
};

export function Sheet({
  side = 'right',
  size,
  children,
  className,
  style,
  isOpen: _isOpen,
  onOpenChange: _onOpenChange,
  ...props
}: SheetProps) {
  const isHorizontal = side === 'left' || side === 'right';
  const sheetStyle = {
    ...(isHorizontal
      ? { width: size ?? '24rem', maxWidth: '100dvw' }
      : { height: size, maxHeight: '100dvh' }),
    ...style,
  } as CSSProperties;

  return (
    <BaseDialog.Portal {...props}>
      <BaseDialog.Backdrop className="zen-modal-overlay zen-layer-backdrop fixed inset-0 bg-black/80" />
      <BaseDialog.Viewport className="zen-layer-modal fixed inset-0">
        <BaseDialog.Popup
          className={cn(
            'relative p-6 overflow-auto outline-none',
            'bg-surface border-edge shadow-xl',
            sideClasses[side],
            className,
          )}
          style={sheetStyle}
        >
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
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
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="flex flex-col gap-1">
        {title && <BaseDialog.Title render={<Heading size="xl" />}>{title}</BaseDialog.Title>}
        {children}
      </div>
      {showClose && (
        <BaseDialog.Close
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
