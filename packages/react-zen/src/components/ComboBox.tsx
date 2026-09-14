import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Children, isValidElement, type ReactElement, type ReactNode, useMemo } from 'react';
import { Icon } from '@/components/Icon';
import { ChevronDown, X } from '@/components/icons';
import {
  List,
  ListItem,
  type ListItemProps,
  ListPrimitiveProvider,
  type ListProps,
} from '@/components/List';
import { useFieldId } from './hooks/useFieldId';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './InputGroup';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { ScrollArea } from './ScrollArea';
import './Overlay.css';

export interface ComboBoxItem {
  label: ReactNode;
  value: string;
  element?: ReactElement<ListItemProps>;
}

/** Base UI receives the item objects directly, so values may be an item or its string value. */
export type ComboBoxValue = string | ComboBoxItem;

function getItemValue(item: ComboBoxValue | null): string {
  if (item == null) {
    return '';
  }

  return typeof item === 'object' ? item.value : String(item);
}

function getItemLabel(label: ReactNode): string {
  if (typeof label === 'string' || typeof label === 'number') {
    return String(label);
  }

  if (Array.isArray(label)) {
    return label.map(getItemLabel).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(label)) {
    return getItemLabel(label.props.children);
  }

  return '';
}

export interface ComboBoxProps
  extends Omit<
    BaseCombobox.Root.Props<string>,
    | 'children'
    | 'items'
    | 'disabled'
    | 'onValueChange'
    | 'itemToStringLabel'
    | 'itemToStringValue'
    | 'isItemEqualToValue'
    | 'filter'
    | 'onItemHighlighted'
  > {
  children?: ReactNode;
  items?: ReadonlyArray<string | { label: ReactNode; value: string }>;
  label?: string;
  placeholder?: string;
  /** Compat alias for the Base UI `disabled` prop. */
  isDisabled?: boolean;
  disabled?: boolean;
  /** Shows a clear button (`Combobox.Clear`) while the input has a value. */
  showClear?: boolean;
  showIcon?: boolean;
  maxHeight?: string | number;
  'aria-invalid'?: boolean | 'true' | 'false';
  onChange?: (value: string | null) => void;
  onValueChange?: BaseCombobox.Root.Props<string>['onValueChange'];
  itemToStringLabel?: (item: ComboBoxValue) => string;
  itemToStringValue?: (item: ComboBoxValue) => string;
  /** Items are passed to Base UI as `{ label, value }` objects, so the filter receives them. */
  filter?:
    | ((
        item: ComboBoxValue,
        query: string,
        itemToString?: (item: ComboBoxValue) => string,
      ) => boolean)
    | null;
  onItemHighlighted?: (
    highlightedValue: ComboBoxValue | undefined,
    eventDetails: Parameters<
      NonNullable<BaseCombobox.Root.Props<ComboBoxValue>['onItemHighlighted']>
    >[1],
  ) => void;
  /** Content shown when no items match the current filter. */
  emptyState?: ReactNode;
  /** @deprecated Use `emptyState` instead. */
  renderEmptyState?: (props: object) => ReactNode;
  inputProps?: BaseCombobox.Input.Props;
  listProps?: ListProps;
  popoverProps?: BaseCombobox.Positioner.Props;
  className?: string;
}

export function ComboBox({
  id,
  className,
  label,
  placeholder,
  isDisabled,
  disabled,
  showClear,
  showIcon = true,
  maxHeight,
  onChange,
  onValueChange,
  emptyState,
  renderEmptyState,
  inputProps,
  listProps,
  popoverProps,
  children,
  items,
  itemToStringLabel,
  itemToStringValue,
  'aria-invalid': ariaInvalid,
  ...props
}: ComboBoxProps) {
  const fieldId = useFieldId(id);
  const inputId = inputProps?.id ?? fieldId;

  const normalizedItems = useMemo<ComboBoxItem[]>(() => {
    if (items) {
      return items.map(item => (typeof item === 'object' ? item : { label: item, value: item }));
    }

    return Children.toArray(children).flatMap<ComboBoxItem>(child => {
      if (!isValidElement<ListItemProps>(child)) {
        return [];
      }

      const value = String(
        child.props.value ??
          child.props.id ??
          (typeof child.props.children === 'string' ? child.props.children : ''),
      );

      return value ? [{ label: child.props.children, value, element: child }] : [];
    });
  }, [items, children]);

  const itemLabels = useMemo(
    () =>
      new Map(normalizedItems.map(item => [item.value, getItemLabel(item.label) || item.value])),
    [normalizedItems],
  );

  const resolveLabel = (item: ComboBoxValue) => {
    if (typeof item === 'object') {
      return getItemLabel(item.label) || item.value;
    }

    return itemLabels.get(item) ?? String(item);
  };

  return (
    <BaseCombobox.Root<ComboBoxValue>
      {...props}
      items={normalizedItems}
      itemToStringLabel={itemToStringLabel ?? resolveLabel}
      itemToStringValue={itemToStringValue ?? getItemValue}
      isItemEqualToValue={(item, value) => getItemValue(item) === getItemValue(value)}
      disabled={isDisabled ?? disabled}
      onValueChange={(value, details) => {
        const next = value == null ? null : getItemValue(value);
        onValueChange?.(next, details);
        onChange?.(next);
      }}
    >
      <div data-slot="combobox" className={cn('relative flex flex-col gap-1', className)}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <BaseCombobox.InputGroup render={<InputGroup />}>
          <BaseCombobox.Input
            placeholder={placeholder}
            {...inputProps}
            id={inputId}
            aria-invalid={ariaInvalid}
            data-slot="combobox-input"
            render={<InputGroupInput />}
          />
          {(showClear || showIcon) && (
            <InputGroupAddon align="inline-end">
              {showClear && (
                <InputGroupButton
                  size="icon-xs"
                  variant="quiet"
                  aria-label="Clear selection"
                  data-slot="combobox-clear"
                  render={<BaseCombobox.Clear />}
                >
                  <Icon aria-hidden="true" size="sm">
                    <X />
                  </Icon>
                </InputGroupButton>
              )}
              {showIcon && (
                <InputGroupButton
                  size="icon-xs"
                  variant="quiet"
                  aria-label="Open"
                  data-slot="combobox-trigger"
                  render={<BaseCombobox.Trigger />}
                >
                  <Icon aria-hidden="true" size="sm">
                    <ChevronDown />
                  </Icon>
                </InputGroupButton>
              )}
            </InputGroupAddon>
          )}
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner
            align="start"
            sideOffset={4}
            {...popoverProps}
            data-slot="combobox-positioner"
            className={cn('zen-layer-floating', popoverProps?.className)}
          >
            <BaseCombobox.Popup
              data-slot="combobox-content"
              className="zen-popover w-(--anchor-width) max-w-(--available-width) max-h-(--available-height) overflow-x-hidden rounded-md border border-edge bg-surface-overlay shadow-lg outline-none"
            >
              <ListPrimitiveProvider kind="combobox">
                <ScrollArea maxHeight={maxHeight ?? 'min(23rem, var(--available-height))'}>
                  <List {...listProps} className={cn('overflow-visible p-1', listProps?.className)}>
                    <BaseCombobox.Collection>
                      {(item: ComboBoxValue) => {
                        if (typeof item !== 'object') {
                          return (
                            <ListItem key={item} value={item}>
                              {resolveLabel(item)}
                            </ListItem>
                          );
                        }

                        return (
                          item.element ?? (
                            <ListItem key={item.value} value={item.value}>
                              {item.label}
                            </ListItem>
                          )
                        );
                      }}
                    </BaseCombobox.Collection>
                  </List>
                </ScrollArea>
              </ListPrimitiveProvider>
              <BaseCombobox.Empty data-slot="combobox-empty">
                <div className="flex min-h-16 items-center justify-center px-4 py-3 text-center">
                  {emptyState ?? renderEmptyState?.({}) ?? (
                    <span className="text-sm text-fg-muted">No items found.</span>
                  )}
                </div>
              </BaseCombobox.Empty>
            </BaseCombobox.Popup>
          </BaseCombobox.Positioner>
        </BaseCombobox.Portal>
      </div>
    </BaseCombobox.Root>
  );
}
