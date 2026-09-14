import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import type { ReactNode } from 'react';
import { cn } from './lib/tailwind';

export type TabListVariant = 'line' | 'default';

export interface TabsProps
  extends Omit<BaseTabs.Root.Props, 'value' | 'defaultValue' | 'onValueChange'> {
  children?: ReactNode;
  /** Controlled value. Alias of `value`. */
  selectedKey?: string;
  value?: string;
  /** Uncontrolled value. Alias of `defaultValue`. */
  defaultSelectedKey?: string;
  defaultValue?: string;
  onSelectionChange?: (key: string) => void;
  onValueChange?: BaseTabs.Root.Props['onValueChange'];
}

export interface TabListProps extends BaseTabs.List.Props {
  children?: ReactNode;
  /**
   * `line` renders an underlined tab list with an animated indicator.
   * `default` renders a pill-style segmented control.
   *
   * @default 'line'
   */
  variant?: TabListVariant;
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
  value,
  defaultSelectedKey,
  defaultValue,
  orientation = 'horizontal',
  onSelectionChange,
  onValueChange,
  ...props
}: TabsProps) {
  return (
    <BaseTabs.Root
      {...props}
      data-slot="tabs"
      orientation={orientation}
      value={value ?? selectedKey}
      defaultValue={defaultValue ?? defaultSelectedKey}
      onValueChange={(next, eventDetails) => {
        onValueChange?.(next, eventDetails);
        if (next !== null && next !== undefined) {
          onSelectionChange?.(String(next));
        }
      }}
      className={cn(
        'relative w-full gap-6',
        'flex data-[orientation=horizontal]:flex-col',
        className,
      )}
    >
      {children}
    </BaseTabs.Root>
  );
}

export function TabList({ children, className, variant = 'line', ...props }: TabListProps) {
  return (
    <BaseTabs.List
      {...props}
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'group/tabs-list relative flex items-center',
        '[&_a.tab]:font-medium [&_a.tab]:no-underline',
        variant === 'line' && [
          'gap-6 border-b border-edge',
          'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
          'data-[orientation=vertical]:border-b-0 data-[orientation=vertical]:border-r',
        ],
        variant === 'default' && [
          'w-fit gap-1 rounded bg-interactive p-[3px]',
          'data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch',
        ],
        className,
      )}
    >
      {children}
      {variant === 'line' && <TabIndicator />}
    </BaseTabs.List>
  );
}

export interface TabIndicatorProps extends BaseTabs.Indicator.Props {}

export function TabIndicator({ className, ...props }: TabIndicatorProps) {
  return (
    <BaseTabs.Indicator
      {...props}
      data-slot="tabs-indicator"
      className={cn(
        'absolute bg-primary transition-[width,height,translate] duration-200',
        'bottom-0 h-0.5 w-(--active-tab-width) translate-x-(--active-tab-left)',
        'data-[orientation=vertical]:bottom-auto data-[orientation=vertical]:right-0',
        'data-[orientation=vertical]:h-(--active-tab-height) data-[orientation=vertical]:w-0.5',
        'data-[orientation=vertical]:translate-x-0 data-[orientation=vertical]:translate-y-(--active-tab-top)',
        className,
      )}
    />
  );
}

export function Tab({ id, value, isDisabled, href, children, className, ...props }: TabProps) {
  return (
    <BaseTabs.Tab
      {...props}
      data-slot="tabs-trigger"
      value={value ?? id}
      disabled={isDisabled}
      render={href ? <a href={href} /> : undefined}
      nativeButton={!href}
      className={cn(
        'tab relative flex items-center justify-center gap-2 whitespace-nowrap',
        'cursor-pointer select-none text-sm text-fg-muted outline-none transition-colors',
        'hover:text-fg',
        'data-active:text-fg',
        'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
        'disabled:cursor-default disabled:text-fg-disabled',
        'data-disabled:cursor-default data-disabled:text-fg-disabled',
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // `line` variant — the active underline is drawn by <TabIndicator />.
        'group-data-[variant=line]/tabs-list:py-2',
        // `default` (pill) variant
        'group-data-[variant=default]/tabs-list:flex-1 group-data-[variant=default]/tabs-list:rounded',
        'group-data-[variant=default]/tabs-list:px-3 group-data-[variant=default]/tabs-list:py-1',
        'group-data-[variant=default]/tabs-list:data-active:bg-surface',
        'group-data-[variant=default]/tabs-list:data-active:shadow-sm',
        className,
      )}
    >
      {children}
    </BaseTabs.Tab>
  );
}

export function TabPanel({ id, value, children, className, ...props }: TabPanelProps) {
  return (
    <BaseTabs.Panel
      {...props}
      data-slot="tabs-panel"
      value={value ?? id}
      className={cn('flex-1 outline-none', className)}
    >
      {children}
    </BaseTabs.Panel>
  );
}
