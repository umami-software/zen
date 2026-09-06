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
        sideOffset={8}
        align="start"
        {...positionerProps}
        className={state =>
          cn(
            'zen-layer-floating',
            typeof positionerProps?.className === 'function'
              ? positionerProps.className(state)
              : positionerProps?.className,
          )
        }
      >
        <BasePreviewCard.Popup
          {...props}
          ref={ref}
          className={state =>
            cn(
              'zen-popover w-80 max-w-[var(--available-width)] max-h-[var(--available-height)] overflow-auto rounded-md border border-edge bg-surface-overlay p-4 text-sm text-fg shadow-lg outline-none',
              typeof className === 'function' ? className(state) : className,
            )
          }
        />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  ),
);

PreviewCardContent.displayName = 'PreviewCardContent';
