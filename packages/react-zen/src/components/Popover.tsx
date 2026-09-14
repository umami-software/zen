import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';
import type { OverlayTarget } from './OverlayTrigger';
import './Overlay.css';
import './Popover.css';

export interface PopoverProps extends Omit<BasePopover.Positioner.Props, 'children' | 'className'> {
  children?: ReactNode;
  isFullscreen?: boolean;
  isOpen?: boolean;
  isNonModal?: boolean;
  triggerRef?: React.RefObject<Element | null>;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  children,
  isFullscreen,
  className,
  isOpen: _isOpen,
  isNonModal: _isNonModal,
  triggerRef: _triggerRef,
  onOpenChange: _onOpenChange,
  sideOffset = 4,
  ...props
}: PopoverProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        sideOffset={sideOffset}
        {...props}
        className={cn(
          'zen-layer-floating',
          // Base UI positions the element with inline `position/top/left/transform`
          // styles, so fullscreen must override them with `!important`.
          isFullscreen && 'fixed! inset-0! w-auto! h-auto! transform-none!',
        )}
      >
        <BasePopover.Popup
          className={cn(
            'zen-popover outline-none',
            isFullscreen &&
              'zen-popover-fullscreen block size-full border-0 rounded-none overflow-auto bg-surface',
            className,
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

(Popover as typeof Popover & OverlayTarget).zenOverlayType = 'popover';
