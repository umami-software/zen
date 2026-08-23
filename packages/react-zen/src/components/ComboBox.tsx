import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { ChevronRight } from '@/components/icons';
import {
  List,
  ListItem,
  type ListItemProps,
  ListPrimitiveProvider,
  type ListProps,
} from '@/components/List';
import { InputGroup, InputGroupAddon, InputGroupInput } from './InputGroup';
import { cn } from './lib/tailwind';
import { ScrollArea } from './ScrollArea';
import './Overlay.css';

interface ComboBoxItem {
  label: ReactNode;
  value: string;
  element?: ReactElement<ListItemProps>;
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
    'children' | 'items' | 'disabled' | 'onValueChange'
  > {
  children?: ReactNode;
  items?: ReadonlyArray<string | { label: ReactNode; value: string }>;
  label?: string;
  placeholder?: string;
  isDisabled?: boolean;
  maxHeight?: string | number;
  onChange?: (value: string | null) => void;
  renderEmptyState?: (props: object) => ReactNode;
  listProps?: ListProps;
  popoverProps?: BaseCombobox.Positioner.Props;
  className?: string;
}

export function ComboBox({
  className,
  label,
  placeholder,
  isDisabled,
  maxHeight,
  onChange,
  renderEmptyState,
  listProps,
  popoverProps,
  children,
  items,
  itemToStringLabel,
  ...props
}: ComboBoxProps) {
  const childItems = Children.toArray(children).flatMap<ComboBoxItem>(child => {
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
  const normalizedItems: ComboBoxItem[] =
    items?.map(item => (typeof item === 'object' ? item : { label: item, value: item })) ??
    childItems;
  const itemLabels = new Map(
    normalizedItems.map(item => [item.value, getItemLabel(item.label) || item.value]),
  );

  return (
    <BaseCombobox.Root
      {...props}
      items={normalizedItems.map(item => item.value)}
      itemToStringLabel={itemToStringLabel ?? (value => itemLabels.get(value) ?? value)}
      disabled={isDisabled}
      onValueChange={onChange}
    >
      <div className={cn('relative', className)}>
        {label && (
          <BaseCombobox.Label className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-semibold">
            {label}
          </BaseCombobox.Label>
        )}
        <BaseCombobox.InputGroup render={<InputGroup />}>
          <BaseCombobox.Input placeholder={placeholder} render={<InputGroupInput />} />
          <InputGroupAddon align="inline-end">
            <BaseCombobox.Trigger className="flex size-6 shrink-0 items-center justify-center rounded text-foreground-muted hover:bg-interactive hover:text-foreground-primary">
              <Icon rotate={90} aria-hidden="true" size="sm">
                <ChevronRight />
              </Icon>
            </BaseCombobox.Trigger>
          </InputGroupAddon>
        </BaseCombobox.InputGroup>
        <BaseCombobox.Portal>
          <BaseCombobox.Positioner
            align="start"
            sideOffset={4}
            {...popoverProps}
            className={cn('zen-layer-floating', popoverProps?.className)}
          >
            <BaseCombobox.Popup className="zen-popover w-[var(--anchor-width)] max-w-[var(--available-width)] p-2 border border-edge rounded-md shadow-lg bg-surface-overlay outline-none">
              <ListPrimitiveProvider kind="combobox">
                <ScrollArea maxHeight={maxHeight ?? 'min(23rem, var(--available-height))'}>
                  <List {...listProps} className={cn('overflow-visible', listProps?.className)}>
                    <BaseCombobox.Collection>
                      {value => {
                        const item = normalizedItems.find(option => option.value === value);

                        if (!item) {
                          return null;
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
              <BaseCombobox.Empty>
                <div className="flex min-h-16 items-center justify-center px-4 py-3 text-center">
                  {renderEmptyState ? (
                    renderEmptyState({})
                  ) : (
                    <span className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] text-foreground-muted">
                      No items found.
                    </span>
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
