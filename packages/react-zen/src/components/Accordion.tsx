import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { Children, isValidElement, type ReactNode } from 'react';
import { ChevronDown } from '@/components/icons';
import { cn } from './lib/tailwind';

export interface AccordionProps
  extends Omit<
    BaseAccordion.Root.Props<string>,
    'value' | 'defaultValue' | 'multiple' | 'onValueChange'
  > {
  type?: 'single' | 'multiple';
  className?: string;
  children?: ReactNode;
  allowsMultipleExpanded?: boolean;
  expandedKeys?: Iterable<string>;
  defaultExpandedKeys?: Iterable<string>;
  onExpandedChange?: (keys: Set<string>) => void;
}

export interface AccordionItemProps extends Omit<BaseAccordion.Item.Props, 'value' | 'disabled'> {
  id?: string;
  value?: string;
  isDisabled?: boolean;
}

export function Accordion({
  className,
  children,
  type,
  allowsMultipleExpanded,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  ...props
}: AccordionProps) {
  return (
    <BaseAccordion.Root
      {...props}
      data-slot="accordion"
      multiple={type === 'multiple' || allowsMultipleExpanded}
      value={expandedKeys ? Array.from(expandedKeys) : undefined}
      defaultValue={defaultExpandedKeys ? Array.from(defaultExpandedKeys) : undefined}
      onValueChange={value => onExpandedChange?.(new Set(value))}
      className={cn('flex flex-col items-start w-full gap-2 text-sm', className)}
    >
      {children}
    </BaseAccordion.Root>
  );
}

export interface AccordionTriggerProps extends BaseAccordion.Trigger.Props {
  children?: ReactNode;
}

/** Renders an accordion header + trigger with a chevron affordance. */
export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header data-slot="accordion-header" className="m-0 flex text-[length:inherit]">
      <BaseAccordion.Trigger
        {...props}
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 items-start justify-between gap-4 rounded py-4',
          'text-left text-sm font-medium cursor-pointer outline-none transition-all',
          'hover:underline',
          'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
          'disabled:pointer-events-none disabled:opacity-50',
          'data-disabled:pointer-events-none data-disabled:opacity-50',
          "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          '[&[data-panel-open]>svg]:rotate-180',
          className,
        )}
      >
        {children}
        <ChevronDown className="text-fg-muted translate-y-0.5 transition-transform duration-200" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export interface AccordionPanelProps extends BaseAccordion.Panel.Props {
  children?: ReactNode;
}

export function AccordionPanel({ className, children, ...props }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel
      {...props}
      data-slot="accordion-panel"
      className={cn(
        'overflow-hidden transition-all duration-300 ease-out',
        'h-(--accordion-panel-height) data-[ending-style]:h-0 data-[starting-style]:h-0',
        className,
      )}
    >
      {children}
    </BaseAccordion.Panel>
  );
}

/** Alias of `AccordionPanel` matching the shadcn naming. */
export const AccordionContent = AccordionPanel;

function isAccordionPart(child: ReactNode) {
  return (
    isValidElement(child) &&
    (child.type === AccordionTrigger ||
      child.type === AccordionPanel ||
      child.type === AccordionContent)
  );
}

export function AccordionItem({
  id,
  value,
  isDisabled,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const items = Children.toArray(children);
  // Backwards compatible positional form: <AccordionItem>{trigger}{panel}</AccordionItem>
  const usesParts = items.some(isAccordionPart);
  const [trigger, ...rest] = items;

  return (
    <BaseAccordion.Item
      {...props}
      data-slot="accordion-item"
      value={value || id}
      disabled={isDisabled}
      className={cn('w-full cursor-pointer group', className)}
    >
      {usesParts ? (
        children
      ) : (
        <>
          <AccordionTrigger className="py-2 font-bold hover:no-underline">
            {trigger}
          </AccordionTrigger>
          <AccordionPanel>{rest}</AccordionPanel>
        </>
      )}
    </BaseAccordion.Item>
  );
}
