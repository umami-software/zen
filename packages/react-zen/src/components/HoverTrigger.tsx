import { Popover as BasePopover } from '@base-ui/react/popover';
import { Children, type ReactElement, type ReactNode } from 'react';
import { cn } from './lib/tailwind';
import { OverlayContentProvider, OverlayTriggerNestedContext } from './OverlayTrigger';
import './Overlay.css';

const OPEN_DELAY = 300;
const CLOSE_DELAY = 500;

export interface HoverTriggerProps {
  /** Controlled open state. */
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  /** Delay before opening on hover, in milliseconds. */
  delay?: number;
  /** Delay before closing once the pointer leaves, in milliseconds. */
  closeDelay?: number;
  className?: string;
  children: ReactNode;
}

/** @deprecated Use `HoverTriggerProps`. */
export type HoverButtonProps = HoverTriggerProps;

export function HoverTrigger({
  isOpen,
  defaultOpen,
  onOpenChange,
  onHoverStart,
  onHoverEnd,
  delay = OPEN_DELAY,
  closeDelay = CLOSE_DELAY,
  className,
  children,
}: HoverTriggerProps) {
  const items = Children.toArray(children) as ReactElement[];
  const [triggerElement, popupElement] = items;

  const handleOpenChange = (open: boolean) => {
    onOpenChange?.(open);
    if (open) {
      onHoverStart?.();
    } else {
      onHoverEnd?.();
    }
  };

  return (
    <BasePopover.Root
      {...(isOpen === undefined ? { defaultOpen } : { open: isOpen })}
      onOpenChange={handleOpenChange}
    >
      {/*
        `openOnHover` replaces the old manual mouseenter/mouseleave timers, and `render` keeps the
        child's own semantics (button, link, …) instead of wrapping it in a non-focusable <span>.
      */}
      <BasePopover.Trigger
        data-slot="hover-trigger"
        openOnHover={true}
        delay={delay}
        closeDelay={closeDelay}
        render={triggerElement}
      />
      <BasePopover.Portal>
        <BasePopover.Positioner className="zen-layer-floating isolate" sideOffset={4}>
          <BasePopover.Popup
            data-slot="hover-content"
            className={cn(
              'max-w-(--available-width) max-h-(--available-height) overflow-y-auto outline-none',
              'bg-surface-overlay border border-edge rounded-lg shadow-lg p-4',
              'origin-(--transform-origin) transition-[transform,opacity] duration-200 ease-out',
              'data-starting-style:opacity-0 data-starting-style:scale-95',
              'data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:ease-in',
              'motion-reduce:transition-none',
              className,
            )}
          >
            <OverlayTriggerNestedContext.Provider value={true}>
              <OverlayContentProvider close={() => handleOpenChange(false)} kind="popover">
                {popupElement}
              </OverlayContentProvider>
            </OverlayTriggerNestedContext.Provider>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
