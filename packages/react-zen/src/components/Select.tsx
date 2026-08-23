import { Select as BaseSelect } from '@base-ui/react/select';
import { Children, isValidElement, type ReactNode, useState } from 'react';
import { ChevronRight } from '@/components/icons';
import { Button, type ButtonProps } from './Button';
import { Column } from './Column';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { Label } from './Label';
import { List, ListItem, ListPrimitiveProvider, type ListProps } from './List';
import { Loading } from './Loading';
import { cn } from './lib/tailwind';
import { ScrollArea } from './ScrollArea';
import { SearchField } from './SearchField';
import './Overlay.css';

export interface SelectValueRenderProps {
  defaultChildren: ReactNode;
  isPlaceholder: boolean;
}

function getSelectItemLabel(
  children: ReactNode,
  selectedValue: string | number,
): ReactNode | undefined {
  let label: ReactNode | undefined;

  Children.forEach(children, child => {
    if (label !== undefined || !isValidElement(child)) {
      return;
    }

    if (child.type === ListItem) {
      const props = child.props as {
        children?: ReactNode;
        id?: string | number;
        value?: string | number;
      };
      const itemValue =
        props.value ?? props.id ?? (typeof props.children === 'string' ? props.children : '');

      if (itemValue === selectedValue) {
        label = props.children;
      }
      return;
    }

    label = getSelectItemLabel((child.props as { children?: ReactNode }).children, selectedValue);
  });

  return label;
}

export interface SelectProps
  extends Omit<
    BaseSelect.Root.Props<string | number>,
    'children' | 'value' | 'defaultValue' | 'items' | 'disabled' | 'onValueChange'
  > {
  children?: ReactNode;
  items?: ReadonlyArray<string | number | { label: ReactNode; value: string | number }>;
  value?: string | number;
  defaultValue?: string | number;
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  allowSearch?: boolean;
  searchValue?: string;
  searchDelay?: number;
  isFullscreen?: boolean;
  maxHeight?: string | number;
  showIcon?: boolean;
  alignItemWithTrigger?: boolean;
  onSearch?: (value: string) => void;
  onChange?: (value: string | number | null) => void;
  buttonProps?: ButtonProps;
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
  allowSearch,
  searchValue,
  searchDelay,
  isFullscreen,
  maxHeight,
  showIcon = true,
  alignItemWithTrigger = false,
  onSearch,
  onChange,
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
  const normalizedItems = items?.map(item =>
    typeof item === 'object' ? item : { label: String(item), value: item },
  );
  const collection =
    children ||
    normalizedItems?.map(item => (
      <ListItem key={item.value} value={item.value}>
        {item.label}
      </ListItem>
    ));
  const isEmpty = !collection || (Array.isArray(collection) && collection.length === 0);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <BaseSelect.Root
        {...props}
        id={fieldId}
        items={normalizedItems}
        value={value}
        defaultValue={defaultValue}
        disabled={isDisabled}
        onValueChange={onChange}
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
          render={
            <Button
              variant="outline"
              {...buttonProps}
              className={cn('w-full justify-between', buttonProps?.className)}
            />
          }
        >
          <BaseSelect.Value placeholder={placeholder}>
            {selected => {
              const defaultChildren =
                selected == null
                  ? placeholder
                  : (getSelectItemLabel(collection, selected) ?? selected);
              return typeof renderValue === 'function'
                ? renderValue({
                    defaultChildren,
                    isPlaceholder: selected == null,
                  })
                : renderValue || defaultChildren;
            }}
          </BaseSelect.Value>
          {showIcon && (
            <Icon rotate={90} aria-hidden="true" size="sm">
              <ChevronRight />
            </Icon>
          )}
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            align="start"
            sideOffset={4}
            alignItemWithTrigger={alignItemWithTrigger}
            {...popoverProps}
            className={cn('zen-layer-floating', popoverProps?.className)}
          >
            <BaseSelect.Popup
              className={cn(
                'zen-popover bg-surface-overlay border border-edge rounded-md shadow-lg outline-none',
                isFullscreen && 'zen-popover-fullscreen fixed inset-0 rounded-none',
              )}
            >
              <Column gap="2" padding="2">
                {allowSearch && (
                  <SearchField
                    className="-mx-2 -mt-2 w-auto rounded-t-md rounded-b-none border-0 border-b border-edge shadow-none focus-within:border-edge"
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
                      if (event.key !== 'Escape' && event.key !== 'Tab') {
                        event.stopPropagation();
                      }
                    }}
                  />
                )}
                {isLoading && <Loading className="py-8" icon="dots" placement="center" size="sm" />}
                {!isLoading && isEmpty && (
                  <div className="px-2 py-8 text-center text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] text-foreground-muted">
                    No results found
                  </div>
                )}
                <ListPrimitiveProvider kind="select">
                  <ScrollArea
                    maxHeight={maxHeight}
                    style={{ display: isLoading || isEmpty ? 'none' : undefined }}
                  >
                    <List
                      {...listProps}
                      isFullscreen={isFullscreen}
                      className={cn('overflow-visible', listProps?.className)}
                      style={listProps?.style}
                    >
                      {collection}
                    </List>
                  </ScrollArea>
                </ListPrimitiveProvider>
              </Column>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
