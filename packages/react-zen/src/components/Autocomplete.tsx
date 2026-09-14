import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { forwardRef, type ReactNode } from 'react';
import { X } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './InputGroup';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { listItem } from './variants';
import './Overlay.css';
import './Popover.css';

export interface AutocompleteProps
  extends Omit<BaseAutocomplete.Root.Props<string>, 'children' | 'items' | 'inline'> {
  items: readonly string[];
  label?: ReactNode;
  placeholder?: string;
  /** Compat alias for the Base UI `disabled` prop. */
  isDisabled?: boolean;
  /**
   * Called with the new input value after Base UI's own `onValueChange` handler runs,
   * and only when the change was not canceled. Use `onValueChange` instead when you
   * need the raw Base UI event details (including canceled changes).
   */
  onChange?: (value: string) => void;
  /** Shows a clear button (`Autocomplete.Clear`) while the input has a value. */
  showClear?: boolean;
  className?: string;
  inputProps?: BaseAutocomplete.Input.Props;
  positionerProps?: BaseAutocomplete.Positioner.Props;
  renderItem?: (item: string) => ReactNode;
  emptyMessage?: ReactNode;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      id,
      items,
      label,
      placeholder,
      isDisabled,
      disabled,
      showClear,
      onChange,
      onValueChange,
      className,
      inputProps,
      positionerProps,
      renderItem,
      emptyMessage = 'No suggestions found.',
      ...props
    },
    ref,
  ) => {
    const fieldId = useFieldId(id);
    const inputId = inputProps?.id ?? fieldId;

    return (
      <BaseAutocomplete.Root
        {...props}
        id={id}
        items={items}
        disabled={isDisabled ?? disabled}
        onValueChange={(value, details) => {
          onValueChange?.(value, details);
          if (!details.isCanceled) onChange?.(value);
        }}
      >
        <div data-slot="autocomplete" className={cn('relative flex flex-col gap-1', className)}>
          {label && <Label htmlFor={inputId}>{label}</Label>}
          <InputGroup>
            <BaseAutocomplete.Input
              placeholder={placeholder}
              {...inputProps}
              id={inputId}
              ref={ref}
              data-slot="autocomplete-input"
              render={<InputGroupInput className="text-sm" />}
            />
            {showClear && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  variant="quiet"
                  aria-label="Clear"
                  data-slot="autocomplete-clear"
                  render={<BaseAutocomplete.Clear />}
                >
                  <Icon aria-hidden="true" size="sm">
                    <X />
                  </Icon>
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          <BaseAutocomplete.Status data-slot="autocomplete-status" className="sr-only">
            {items.length} suggestion{items.length === 1 ? '' : 's'} available
          </BaseAutocomplete.Status>
          <BaseAutocomplete.Portal>
            <BaseAutocomplete.Positioner
              align="start"
              sideOffset={4}
              {...positionerProps}
              data-slot="autocomplete-positioner"
              className={state =>
                cn(
                  'zen-layer-floating',
                  typeof positionerProps?.className === 'function'
                    ? positionerProps.className(state)
                    : positionerProps?.className,
                )
              }
            >
              <BaseAutocomplete.Popup
                data-slot="autocomplete-content"
                className="zen-popover w-(--anchor-width) max-w-(--available-width) max-h-[min(23rem,var(--available-height))] overflow-x-hidden overflow-y-auto rounded-md border border-edge bg-surface-overlay p-1 text-fg shadow-lg outline-none"
              >
                <BaseAutocomplete.List data-slot="autocomplete-list">
                  {(item: string) => (
                    <BaseAutocomplete.Item
                      key={item}
                      value={item}
                      data-slot="autocomplete-item"
                      className={listItem()}
                    >
                      {renderItem ? renderItem(item) : item}
                    </BaseAutocomplete.Item>
                  )}
                </BaseAutocomplete.List>
                <BaseAutocomplete.Empty data-slot="autocomplete-empty">
                  <div className="px-3 py-4 text-center text-sm text-fg-muted">{emptyMessage}</div>
                </BaseAutocomplete.Empty>
              </BaseAutocomplete.Popup>
            </BaseAutocomplete.Positioner>
          </BaseAutocomplete.Portal>
        </div>
      </BaseAutocomplete.Root>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
