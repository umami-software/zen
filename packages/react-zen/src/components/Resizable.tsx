import { createContext, useContext } from 'react';
import {
  Group,
  type GroupProps,
  Panel,
  type PanelProps,
  Separator,
  type SeparatorProps,
} from 'react-resizable-panels';
import { GripVertical } from '@/components/icons';
import { cn } from './lib/tailwind';

const ResizableOrientationContext = createContext<'horizontal' | 'vertical'>('horizontal');

export interface ResizablePanelGroupProps extends Omit<GroupProps, 'orientation'> {
  direction?: 'horizontal' | 'vertical';
}

export function ResizablePanelGroup({
  direction = 'horizontal',
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <ResizableOrientationContext.Provider value={direction}>
      <Group
        {...props}
        orientation={direction}
        className={cn('flex size-full', direction === 'vertical' && 'flex-col', className)}
      />
    </ResizableOrientationContext.Provider>
  );
}

export interface ResizablePanelProps extends PanelProps {}

export function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return <Panel {...props} className={cn('overflow-hidden', className)} />;
}

export interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean;
}

export function ResizableHandle({ withHandle, className, ...props }: ResizableHandleProps) {
  const direction = useContext(ResizableOrientationContext);
  const isVertical = direction === 'vertical';

  return (
    <Separator
      {...props}
      className={cn(
        'relative flex items-center justify-center bg-edge shrink-0',
        isVertical ? 'h-px w-full' : 'w-px',
        isVertical
          ? 'after:absolute after:inset-x-0 after:-top-1 after:h-2'
          : 'after:absolute after:inset-y-0 after:-left-1 after:w-2',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
        className,
      )}
    >
      {withHandle && (
        <div
          className={cn(
            'z-10 flex h-5 w-3.5 items-center justify-center rounded-sm border border-edge bg-surface-raised',
            isVertical && 'rotate-90',
          )}
        >
          <GripVertical className="size-2.5 text-fg-muted" />
        </div>
      )}
    </Separator>
  );
}
