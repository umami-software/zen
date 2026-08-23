import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import type { ReactElement, ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';
import { Text } from './Text';

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
      multiple={type === 'multiple' || allowsMultipleExpanded}
      value={expandedKeys ? Array.from(expandedKeys) : undefined}
      defaultValue={defaultExpandedKeys ? Array.from(defaultExpandedKeys) : undefined}
      onValueChange={value => onExpandedChange?.(new Set(value))}
      className={cn(
        'flex flex-col items-start w-full gap-2 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
        className,
      )}
    >
      {children}
    </BaseAccordion.Root>
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
  const [trigger, panel] = children as ReactElement[];

  return (
    <BaseAccordion.Item
      {...props}
      value={value || id}
      disabled={isDisabled}
      className={cn('w-full cursor-pointer group', className)}
    >
      <BaseAccordion.Header>
        <BaseAccordion.Trigger className="w-full flex items-center justify-between font-bold py-2 px-0">
          <Text>{trigger}</Text>
          <Icon className="transition-transform duration-200 group-data-[open]:rotate-90" size="sm">
            <ChevronRight />
          </Icon>
        </BaseAccordion.Trigger>
      </BaseAccordion.Header>
      <BaseAccordion.Panel className="overflow-hidden transition-all duration-300 ease-out h-[var(--accordion-panel-height)] data-[ending-style]:h-0 data-[starting-style]:h-0">
        {panel}
      </BaseAccordion.Panel>
    </BaseAccordion.Item>
  );
}
