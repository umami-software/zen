import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Box } from './Box';
import { cn } from './lib/tailwind';
import { tooltip } from './variants';
import './Overlay.css';

export interface TooltipProps extends Omit<BaseTooltip.Positioner.Props, 'children' | 'className'> {
  children?: ReactNode;
  showArrow?: boolean;
  className?: string;
  /** Positioner class name. Merged with the internal layer/isolation classes. */
  positionerClassName?: string;
  placement?: BaseTooltip.Positioner.Props['side'];
}

export function Tooltip({
  children,
  className,
  positionerClassName,
  placement,
  side,
  sideOffset = 4,
  showArrow,
  ...props
}: TooltipProps) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner
        {...props}
        side={placement ?? side}
        sideOffset={sideOffset}
        className={cn('zen-layer-floating isolate', positionerClassName)}
      >
        <BaseTooltip.Popup
          data-slot="tooltip"
          className={cn(
            'group w-fit max-w-xs outline-none',
            'origin-(--transform-origin) transition-[transform,opacity] duration-200 ease-out',
            'data-starting-style:opacity-0 data-starting-style:scale-95',
            'data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:ease-in',
            'motion-reduce:transition-none',
            tooltip(),
            className,
          )}
        >
          {showArrow && (
            <BaseTooltip.Arrow
              data-slot="tooltip-arrow"
              className={cn(
                'w-3 h-1.5',
                'data-[side=top]:-bottom-1.5 data-[side=top]:rotate-180',
                'data-[side=bottom]:-top-1.5',
                'data-[side=left]:-right-[9px] data-[side=left]:rotate-90',
                'data-[side=right]:-left-[9px] data-[side=right]:-rotate-90',
              )}
            >
              <svg aria-hidden="true" viewBox="0 0 12 6" className="block w-full h-full">
                <path d="M0 6 6 0l6 6Z" className="fill-surface-inverted" />
              </svg>
            </BaseTooltip.Arrow>
          )}
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}

/** Explicit, shadcn-style alias for the positioned tooltip surface. */
export const TooltipContent = Tooltip;
export type TooltipContentProps = TooltipProps;

export interface TooltipBubbleProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  showArrow?: boolean;
}

/** An unpositioned tooltip surface, used by `FloatingTooltip` and for custom positioning. */
export const TooltipBubble = forwardRef<HTMLDivElement, TooltipBubbleProps>(
  ({ children, className, color: _color, showArrow: _showArrow, ...props }, ref) => (
    <Box
      {...props}
      ref={ref}
      data-slot="tooltip-bubble"
      className={cn('w-fit max-w-xs', tooltip(), className)}
    >
      {children}
    </Box>
  ),
);

TooltipBubble.displayName = 'TooltipBubble';
