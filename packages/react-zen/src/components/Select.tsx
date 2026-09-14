import { Select as BaseSelect } from '@base-ui/react/select';
import { Children, isValidElement, type ReactNode, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { Label } from './Label';
import { List, ListItem, type ListItemProps, ListPrimitiveProvider, type ListProps } from './List';
import { Loading } from './Loading';
import { cn } from './lib/tailwind';
import { ScrollArea } from './ScrollArea';
import { SearchField } from './SearchField';
import { inputField } from './variants';
import './Overlay.css';

export interface SelectValueRenderProps {
  defaultChildren: ReactNode;
  isPlaceholder: boolean;
}

export interface SelectItemOption {
  label: ReactNode;
  value: string | number;
}

/**
 * Collects `{ value, label }` pairs from `<ListItem>` children so that Base UI can
 * resolve the selected label itself (via `Select.Root#items`) instead of the value
 * being looked up on every render.
 */
function collectSelectItems(children: ReactNode, items: SelectItemOption[] = []) {
  Children.forEach(children, child => {
    if (!isValidElement(child)) {
      return;
    }

    if (child.type === ListItem) {
      const props = child.props as ListItemProps;
      const value =
        props.value ?? props.id ?? (typeof props.children === 'string' ? props.children : '');

      items.push({ value, label: props.children });
      return;
    }

    collectSelectItems((child.props as { children?: ReactNode }).children, items);
  });

  return items;
}

export interface SelectProps
  extends Omit<
    BaseSelect.Root.Props<string | number>,
    'children' | 'value' | 'defaultValue' | 'items' | 'disabled' | 'onValueChange'
  > {
  children?: ReactNode;
  items?: ReadonlyArray<string | number | SelectItemOption>;
  value?: string | number;
  defaultValue?: string | number;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  /** Compat alias for the Base UI `disabled` prop. */
  isDisabled?: boolean;
  disabled?: boolean;
  /** Size of the trigger. Emits `data-size` on the trigger element. */
  size?: 'sm' | 'md';
  allowSearch?: boolean;
  searchValue?: string;
  searchDelay?: number;
  isFullscreen?: boolean;
  /** When set, the list is wrapped in a `ScrollArea` capped at this height. */
  maxHeight?: string | number;
  showIcon?: boolean;
  alignItemWithTrigger?: boolean;
  onSearch?: (value: string) => void;
  onChange?: (value: string | number | null) => void;
  onValueChange?: BaseSelect.Root.Props<string | number>['onValueChange'];
  triggerProps?: BaseSelect.Trigger.Props;
  /** @deprecated Use `triggerProps` instead. */
  buttonProps?: BaseSelect.Trigger.Props;
  listProps?: ListProps;
  popoverProps?: BaseSelect.Positioner.Props;
  renderValue?: ReactNode | ((values: SelectValueRenderProps) => ReactNode);
  className?: string;
}

export function Select({
  value,
  defaultValue,
  label,
  placeholder,
  isLoading,
  isDisabled,
  disabled,
  size = 'md',
  allowSearch,
  searchValue,
  searchDelay,
  isFullscreen,
  maxHeight,
  showIcon = true,
  alignItemWithTrigger = false,
  onSearch,
  onChange,
  onValueChange,
  triggerProps,
  buttonProps,
  listProps,
  popoverProps,
  renderValue,
  className,
  children,
  items,
  onOpenChange,
  id,
  ...props
}: SelectProps) {
  const fieldId = useFieldId(id);
  const [search, setSearch] = useState('');

  const normalizedItems = useMemo(
    () =>
      items?.map(item => (typeof item === 'object' ? item : { label: String(item), value: item })),
    [items],
  );

  const collection = useMemo(
    () =>
      children ||
      normalizedItems?.map(item => (
        <ListItem key={item.value} value={item.value}>
          {item.label}
        </ListItem>
      )),
    [children, normalizedItems],
  );

  // Base UI resolves the trigger label from `items`, so build them from the
  // `<ListItem>` children once when an explicit `items` prop is not provided.
  const resolvedItems = useMemo(
    () => normalizedItems ?? (children ? collectSelectItems(children) : undefined),
    [normalizedItems, children],
  );

  const labels = useMemo(
    () => new Map(resolvedItems?.map(item => [item.value, item.label])),
    [resolvedItems],
  );

  const isEmpty = !collection || (Array.isArray(collection) && collection.length === 0);
  // Only opt into the custom ScrollArea when a max height is requested, otherwise
  // the popup handles its own scrolling.
  const useScrollArea = maxHeight !== undefined && !isFullscreen;
  // The merged trigger props: `buttonProps` is deprecated in favor of `triggerProps`.
  const mergedTriggerProps = { ...buttonProps, ...triggerProps };
  const { className: triggerClassName, ...restTriggerProps } = mergedTriggerProps;

  return (
    <div data-slot="select" className={cn('flex flex-col gap-1', className)}>
      <BaseSelect.Root
        {...props}
        id={fieldId}
        items={resolvedItems}
        value={value}
        defaultValue={defaultValue}
        disabled={isDisabled ?? disabled}
        onValueChange={(next, details) => {
          onValueChange?.(next, details);
          onChange?.(next);
        }}
        onOpenChange={(open, details) => {
          if (!open) {
            setSearch('');
            onSearch?.('');
          }
          onOpenChange?.(open, details);
        }}
      >
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        <BaseSelect.Trigger
          {...restTriggerProps}
          data-slot="select-trigger"
          data-size={size}
          className={inputField({
            className: cn(
              'w-full justify-between gap-2 px-3 py-0 whitespace-nowrap cursor-pointer outline-none',
              'hover:border-edge-strong',
              'data-[size=sm]:h-8',
              'data-[placeholder]:text-fg-muted',
              "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              triggerClassName,
            ),
          })}
        >
          <BaseSelect.Value
            placeholder={placeholder}
            data-slot="select-value"
            className="truncate text-start"
          >
            {renderValue === undefined
              ? undefined
              : (selected: string | number | null) => {
                  const defaultChildren =
                    selected == null ? placeholder : (labels.get(selected) ?? selected);

                  return typeof renderValue === 'function'
                    ? renderValue({ defaultChildren, isPlaceholder: selected == null })
                    : renderValue || defaultChildren;
                }}
          </BaseSelect.Value>
          {showIcon && (
            <BaseSelect.Icon data-slot="select-icon" className="text-fg-muted">
              <Icon aria-hidden="true" size="sm">
                <ChevronDown />
              </Icon>
            </BaseSelect.Icon>
          )}
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            align="start"
            sideOffset={4}
            alignItemWithTrigger={alignItemWithTrigger}
            {...popoverProps}
            data-slot="select-positioner"
            className={cn(
              'zen-layer-floating',
              // Base UI positions the element with inline `position/top/left/transform`
              // styles, so fullscreen must override them with `!important`.
              isFullscreen && 'fixed! inset-0! w-auto! h-auto! transform-none!',
              popoverProps?.className,
            )}
          >
            <BaseSelect.Popup
              data-slot="select-content"
              className={cn(
                'zen-popover relative flex flex-col outline-none',
                'max-h-(--available-height) min-w-(--anchor-width) overflow-x-hidden',
                'rounded-md border border-edge bg-surface-overlay shadow-lg',
                !useScrollArea && !isFullscreen && !allowSearch && 'overflow-y-auto',
                (allowSearch || useScrollArea) && 'overflow-hidden',
                isFullscreen &&
                  'zen-popover-fullscreen size-full rounded-none border-0 shadow-none overflow-hidden',
              )}
            >
              {allowSearch && (
                <SearchField
                  className="w-auto shrink-0 rounded-t-md rounded-b-none border-0 border-b border-edge shadow-none focus-within:border-edge focus-within:ring-0"
                  value={search}
                  onChange={setSearch}
                  onSearch={value => {
                    setSearch(value);
                    onSearch?.(value);
                  }}
                  delay={searchDelay}
                  defaultValue={searchValue}
                  autoFocus
                  onKeyDown={event => {
                    // Keep typeahead/selection keys working on the list, but stop the
                    // select from swallowing text input while the search box has focus.
                    const isNavigationKey = [
                      'Escape',
                      'Tab',
                      'Enter',
                      'ArrowUp',
                      'ArrowDown',
                      'PageUp',
                      'PageDown',
                    ].includes(event.key);

                    if (!isNavigationKey) {
                      event.stopPropagation();
                    }
                  }}
                />
              )}
              {isLoading && <Loading className="py-8" icon="dots" placement="center" size="sm" />}
              {!isLoading && isEmpty && (
                <div
                  data-slot="select-empty"
                  className="px-2 py-8 text-center text-sm text-fg-muted"
                >
                  No results found
                </div>
              )}
              <ListPrimitiveProvider kind="select">
                <BaseSelect.ScrollUpArrow
                  data-slot="select-scroll-up-button"
                  className="top-0 z-1 flex w-full cursor-default items-center justify-center bg-surface-overlay py-1 text-fg-muted"
                >
                  <Icon aria-hidden="true" size="sm">
                    <ChevronUp />
                  </Icon>
                </BaseSelect.ScrollUpArrow>
                {useScrollArea ? (
                  <ScrollArea
                    maxHeight={maxHeight}
                    className="min-h-0 flex-1"
                    style={{ display: isLoading || isEmpty ? 'none' : undefined }}
                  >
                    <List
                      {...listProps}
                      className={cn('overflow-visible p-1', listProps?.className)}
                      style={listProps?.style}
                    >
                      {collection}
                    </List>
                  </ScrollArea>
                ) : (
                  <List
                    {...listProps}
                    className={cn('min-h-0 flex-1 p-1', listProps?.className)}
                    style={{
                      display: isLoading || isEmpty ? 'none' : undefined,
                      ...listProps?.style,
                    }}
                  >
                    {collection}
                  </List>
                )}
                <BaseSelect.ScrollDownArrow
                  data-slot="select-scroll-down-button"
                  className="bottom-0 z-1 flex w-full cursor-default items-center justify-center bg-surface-overlay py-1 text-fg-muted"
                >
                  <Icon aria-hidden="true" size="sm">
                    <ChevronDown />
                  </Icon>
                </BaseSelect.ScrollDownArrow>
              </ListPrimitiveProvider>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
