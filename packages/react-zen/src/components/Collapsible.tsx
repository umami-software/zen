import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';

export interface CollapsibleProps
  extends Omit<BaseCollapsible.Root.Props, 'open' | 'defaultOpen' | 'onOpenChange' | 'disabled'> {
  isExpanded?: boolean;
  defaultExpanded?: boolean;
  isDisabled?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  children?: ReactNode;
}

export function Collapsible({
  isExpanded,
  defaultExpanded,
  isDisabled,
  onExpandedChange,
  className,
  children,
  ...props
}: CollapsibleProps) {
  return (
    <BaseCollapsible.Root
      {...props}
      open={isExpanded}
      defaultOpen={defaultExpanded}
      disabled={isDisabled}
      onOpenChange={onExpandedChange}
      className={cn('flex flex-col w-full', className)}
    >
      {children}
    </BaseCollapsible.Root>
  );
}

export interface CollapsibleTriggerProps extends BaseCollapsible.Trigger.Props {
  children?: ReactNode;
}

export function CollapsibleTrigger({ className, children, ...props }: CollapsibleTriggerProps) {
  return (
    <BaseCollapsible.Trigger
      {...props}
      className={cn(
        'flex items-center gap-2 cursor-pointer outline-none text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
        'focus-visible:ring-2 focus-visible:ring-focus-ring rounded',
        'disabled:text-foreground-disabled disabled:cursor-default',
        className,
      )}
    >
      {children}
    </BaseCollapsible.Trigger>
  );
}

export interface CollapsiblePanelProps extends BaseCollapsible.Panel.Props {
  children?: ReactNode;
}

export function CollapsiblePanel({ className, children, ...props }: CollapsiblePanelProps) {
  return (
    <BaseCollapsible.Panel
      {...props}
      className={cn(
        'overflow-hidden transition-all duration-300 ease-out',
        'h-[var(--collapsible-panel-height)] data-[starting-style]:h-0 data-[ending-style]:h-0',
        className,
      )}
    >
      {children}
    </BaseCollapsible.Panel>
  );
}
