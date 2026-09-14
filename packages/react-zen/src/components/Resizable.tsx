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

export interface ResizablePanelGroupProps extends Omit<GroupProps, 'orientation'> {
  direction?: 'horizontal' | 'vertical';
}

export function ResizablePanelGroup({
  direction = 'horizontal',
  className,
  ...props
}: ResizablePanelGroupProps) {
  return (
    <Group
      {...props}
      data-slot="resizable-panel-group"
      orientation={direction}
      className={cn('flex size-full', direction === 'vertical' && 'flex-col', className)}
    />
  );
}

export interface ResizablePanelProps extends PanelProps {}

export function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return (
    <Panel {...props} data-slot="resizable-panel" className={cn('overflow-hidden', className)} />
  );
}

export interface ResizableHandleProps extends SeparatorProps {
  withHandle?: boolean;
}

export function ResizableHandle({ withHandle, className, ...props }: ResizableHandleProps) {
  return (
    <Separator
      {...props}
      data-slot="resizable-handle"
      className={cn(
        // The orientation is read from the `aria-orientation` attribute set by
        // react-resizable-panels instead of a React context.
        'relative flex w-px shrink-0 items-center justify-center bg-edge outline-none',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-2 after:-translate-x-1/2',
        'aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full',
        'aria-[orientation=horizontal]:after:inset-x-0 aria-[orientation=horizontal]:after:left-0',
        'aria-[orientation=horizontal]:after:h-2 aria-[orientation=horizontal]:after:w-full',
        'aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2',
        'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
        '[&[aria-orientation=horizontal]>div]:rotate-90',
        className,
      )}
    >
      {withHandle && (
        <div
          data-slot="resizable-handle-grip"
          className="z-10 flex h-5 w-3.5 items-center justify-center rounded-sm border border-edge bg-surface-raised"
        >
          <GripVertical className="size-2.5 text-fg-muted" />
        </div>
      )}
    </Separator>
  );
}
