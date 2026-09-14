import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ReactNode } from 'react';
import { Heading } from './Heading';
import { cn } from './lib/tailwind';
import { type OverlayTarget, useInsideOverlayTrigger } from './OverlayTrigger';
import { Text } from './Text';
import './Overlay.css';
import './Popover.css';

/** Shared enter/exit motion for floating popups (mirrors the old `.zen-popover` CSS). */
const motionClassName = [
  'origin-(--transform-origin) transition-[transform,opacity] duration-200 ease-out',
  'data-starting-style:opacity-0 data-starting-style:scale-95',
  'data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:ease-in',
  'motion-reduce:transition-none motion-reduce:data-starting-style:scale-100 motion-reduce:data-ending-style:scale-100',
].join(' ');

export interface PopoverProps extends Omit<BasePopover.Positioner.Props, 'children' | 'className'> {
  children?: ReactNode;
  isFullscreen?: boolean;
  /** Controlled open state. Only used when the popover is not wrapped in a `DialogTrigger`. */
  isOpen?: boolean;
  /** Initial open state. Only used when the popover is not wrapped in a `DialogTrigger`. */
  defaultOpen?: boolean;
  isNonModal?: boolean;
  triggerRef?: React.RefObject<Element | null>;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

export function Popover({
  children,
  isFullscreen,
  className,
  isOpen,
  defaultOpen,
  isNonModal,
  triggerRef: _triggerRef,
  onOpenChange,
  sideOffset = 4,
  ...props
}: PopoverProps) {
  const isNested = useInsideOverlayTrigger();

  const portal = (
    <BasePopover.Portal>
      <BasePopover.Positioner
        sideOffset={sideOffset}
        {...props}
        className={cn(
          'zen-layer-floating isolate',
          // Base UI positions the element with inline `position/top/left/transform`
          // styles, so fullscreen must override them with `!important`.
          isFullscreen && 'fixed! inset-0! w-auto! h-auto! transform-none!',
        )}
      >
        <BasePopover.Popup
          data-slot="popover"
          className={cn(
            'w-72 max-w-(--available-width) max-h-(--available-height) overflow-y-auto',
            'bg-surface-overlay border border-edge rounded-lg shadow-lg p-4 outline-none',
            motionClassName,
            isFullscreen &&
              'zen-popover-fullscreen block size-full w-auto! h-auto! max-w-none max-h-none border-0 rounded-none overflow-auto bg-surface transition-none',
            className,
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );

  if (isNested) {
    return portal;
  }

  // Standalone usage: own the open state instead of silently discarding it.
  return (
    <BasePopover.Root
      {...(isOpen === undefined ? { defaultOpen } : { open: isOpen })}
      modal={isNonModal === undefined ? undefined : !isNonModal}
      onOpenChange={onOpenChange}
    >
      {portal}
    </BasePopover.Root>
  );
}

(Popover as typeof Popover & OverlayTarget).zenOverlayType = 'popover';

/** Explicit, shadcn-style parts. */
export interface PopoverTriggerProps extends BasePopover.Trigger.Props {}

export function PopoverTrigger(props: PopoverTriggerProps) {
  return <BasePopover.Trigger data-slot="popover-trigger" {...props} />;
}

export interface PopoverCloseProps extends BasePopover.Close.Props {}

export function PopoverClose(props: PopoverCloseProps) {
  return <BasePopover.Close data-slot="popover-close" {...props} />;
}

export interface PopoverTitleProps extends BasePopover.Title.Props {}

export function PopoverTitle({ className, ...props }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      {...props}
      render={props.render ?? <Heading size="lg" />}
      className={className as string}
    />
  );
}

export interface PopoverDescriptionProps extends BasePopover.Description.Props {}

export function PopoverDescription({ className, ...props }: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      {...props}
      render={props.render ?? <Text color="muted" />}
      className={className as string}
    />
  );
}
