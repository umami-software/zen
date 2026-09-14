import { ScrollArea as BaseScrollArea } from '@base-ui/react/scroll-area';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from './lib/tailwind';

export interface ScrollAreaProps extends BaseScrollArea.Root.Props {
  maxHeight?: string | number;
  orientation?: 'vertical' | 'horizontal' | 'both';
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const scrollbarClasses = [
  'flex touch-none select-none p-px transition-colors',
  'opacity-0 transition-opacity duration-200 delay-300',
  'data-[hovering]:opacity-100 data-[hovering]:delay-0',
  'data-[scrolling]:opacity-100 data-[scrolling]:delay-0',
  'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2.5',
  'data-[orientation=vertical]:border-l data-[orientation=vertical]:border-l-transparent',
  'data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:flex-col',
  'data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-t-transparent',
];

const thumbClasses = 'relative flex-1 rounded-full bg-edge-strong';

export function ScrollArea({
  maxHeight,
  orientation = 'vertical',
  className,
  style,
  children,
  ...props
}: ScrollAreaProps) {
  const showVertical = orientation !== 'horizontal';
  const showHorizontal = orientation !== 'vertical';

  return (
    <BaseScrollArea.Root
      {...props}
      data-slot="scroll-area"
      className={cn('relative overflow-hidden', className)}
      style={style}
    >
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className="size-full overscroll-contain rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        style={{ maxHeight }}
      >
        <BaseScrollArea.Content data-slot="scroll-area-content">{children}</BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {showVertical && (
        <BaseScrollArea.Scrollbar
          orientation="vertical"
          data-slot="scroll-area-scrollbar"
          className={cn(scrollbarClasses)}
        >
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className={thumbClasses} />
        </BaseScrollArea.Scrollbar>
      )}
      {showHorizontal && (
        <BaseScrollArea.Scrollbar
          orientation="horizontal"
          data-slot="scroll-area-scrollbar"
          className={cn(scrollbarClasses)}
        >
          <BaseScrollArea.Thumb data-slot="scroll-area-thumb" className={thumbClasses} />
        </BaseScrollArea.Scrollbar>
      )}
      {orientation === 'both' && <BaseScrollArea.Corner data-slot="scroll-area-corner" />}
    </BaseScrollArea.Root>
  );
}
