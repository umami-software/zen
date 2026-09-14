import { PreviewCard as BasePreviewCard } from '@base-ui/react/preview-card';
import { forwardRef } from 'react';
import { cn } from './lib/tailwind';
import './Overlay.css';
import './Popover.css';

export const PreviewCard = BasePreviewCard.Root;
export type PreviewCardProps = BasePreviewCard.Root.Props;
export const PreviewCardTrigger = BasePreviewCard.Trigger;
export type PreviewCardTriggerProps = BasePreviewCard.Trigger.Props;

export interface PreviewCardContentProps extends BasePreviewCard.Popup.Props {
  positionerProps?: BasePreviewCard.Positioner.Props;
  portalProps?: BasePreviewCard.Portal.Props;
}

export const PreviewCardContent = forwardRef<HTMLDivElement, PreviewCardContentProps>(
  ({ className, positionerProps, portalProps, ...props }, ref) => (
    <BasePreviewCard.Portal {...portalProps}>
      <BasePreviewCard.Positioner
        sideOffset={4}
        align="center"
        {...positionerProps}
        className={state =>
          cn(
            'zen-layer-floating isolate',
            typeof positionerProps?.className === 'function'
              ? positionerProps.className(state)
              : positionerProps?.className,
          )
        }
      >
        <BasePreviewCard.Popup
          {...props}
          ref={ref}
          data-slot="preview-card-content"
          className={state =>
            cn(
              'w-80 max-w-(--available-width) max-h-(--available-height) overflow-y-auto rounded-md border border-edge bg-surface-overlay p-4 text-sm text-fg shadow-lg outline-none',
              'origin-(--transform-origin) transition-[transform,opacity] duration-200 ease-out',
              'data-starting-style:opacity-0 data-starting-style:scale-95',
              'data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:ease-in',
              'motion-reduce:transition-none',
              typeof className === 'function' ? className(state) : className,
            )
          }
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  ),
);

PreviewCardContent.displayName = 'PreviewCardContent';
