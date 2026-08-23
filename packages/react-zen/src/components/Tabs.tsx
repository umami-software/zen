import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';

export interface TabsProps
  extends Omit<BaseTabs.Root.Props, 'value' | 'defaultValue' | 'onValueChange'> {
  children?: ReactNode;
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
}

export interface TabListProps extends BaseTabs.List.Props {
  children?: ReactNode;
}

export interface TabProps extends Omit<BaseTabs.Tab.Props, 'value' | 'disabled'> {
  id?: string;
  value?: string;
  isDisabled?: boolean;
  href?: string;
}

export interface TabPanelProps extends Omit<BaseTabs.Panel.Props, 'value'> {
  id?: string;
  value?: string;
}

export function Tabs({
  children,
  className,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  ...props
}: TabsProps) {
  return (
    <BaseTabs.Root
      {...props}
      value={selectedKey}
      defaultValue={defaultSelectedKey}
      onValueChange={value => onSelectionChange?.(String(value))}
      className={cn('grid relative w-full gap-6', className)}
    >
      {children}
    </BaseTabs.Root>
  );
}

export function TabList({ children, className, ...props }: TabListProps) {
  return (
    <BaseTabs.List
      {...props}
      className={cn(
        'flex items-center border-b border-edge gap-6',
        '[&_a.tab]:font-medium [&_a.tab]:no-underline',
        className,
      )}
    >
      {children}
    </BaseTabs.List>
  );
}

export function Tab({ id, value, isDisabled, href, children, className, ...props }: TabProps) {
  return (
    <BaseTabs.Tab
      {...props}
      value={value ?? id}
      disabled={isDisabled}
      render={href ? <a href={href} /> : undefined}
      nativeButton={!href}
      className={cn(
        'tab flex items-center justify-center text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] text-foreground-muted py-2 border-b-2 border-transparent select-none -mb-[2px] cursor-pointer outline-none',
        'hover:text-foreground-primary',
        'data-[active]:text-foreground-primary data-[active]:border-b-primary',
        'data-[disabled]:text-foreground-disabled data-[disabled]:cursor-default',
        className,
      )}
    >
      {children}
    </BaseTabs.Tab>
  );
}

export function TabPanel({ id, value, children, className, ...props }: TabPanelProps) {
  return (
    <BaseTabs.Panel {...props} value={value ?? id} className={className}>
      {children}
    </BaseTabs.Panel>
  );
}
