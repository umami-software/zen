import { type HTMLAttributes, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const EDGE_PADDING = 8;
const POINTER_OFFSET = 10;

export interface FloatingTooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Set to `false` to hide the tooltip and detach the pointer listener without unmounting. Defaults to `true`. */
  open?: boolean;
}

export function FloatingTooltip({
  className,
  style,
  children,
  open = true,
  ...props
}: FloatingTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!open || typeof window === 'undefined') {
      return;
    }

    let frame = 0;
    let pointer = { x: 0, y: 0 };

    const flush = () => {
      frame = 0;

      const rect = ref.current?.getBoundingClientRect();
      const width = rect?.width ?? 0;
      const height = rect?.height ?? 0;
      const half = width / 2;

      // Clamp to the viewport. The bubble is centered horizontally and sits above the pointer.
      const minX = half + EDGE_PADDING;
      const maxX = Math.max(minX, window.innerWidth - half - EDGE_PADDING);
      const minY = height + POINTER_OFFSET + EDGE_PADDING;
      const maxY = Math.max(minY, window.innerHeight - EDGE_PADDING);

      setPosition({
        x: Math.min(Math.max(pointer.x, minX), maxX),
        y: Math.min(Math.max(pointer.y, minY), maxY),
      });
    };

    // rAF throttling keeps the listener from triggering a render per mousemove event.
    const handler = (event: MouseEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) {
        frame = requestAnimationFrame(flush);
      }
    };

    document.addEventListener('mousemove', handler, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handler);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [open]);

  return (
    <div
      {...props}
      ref={ref}
      role="tooltip"
      data-slot="floating-tooltip"
      hidden={!open}
      className={cn(
        'pointer-events-none fixed z-50 inline-flex w-fit max-w-xs -translate-x-1/2 -translate-y-[calc(100%+10px)] items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background',
        className,
      )}
      style={{ ...style, left: position.x, top: position.y }}
    >
      {children}
    </div>
  );
}
