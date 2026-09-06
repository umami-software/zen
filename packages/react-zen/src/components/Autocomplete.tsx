import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { forwardRef, type ReactNode, useId } from 'react';
import { InputGroup, InputGroupInput } from './InputGroup';
import { cn } from './lib/tailwind';
import './Overlay.css';
import './Popover.css';

export interface AutocompleteProps
  extends Omit<BaseAutocomplete.Root.Props<string>, 'children' | 'items' | 'inline'> {
  items: readonly string[];
  label?: ReactNode;
  placeholder?: string;
  isDisabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  inputProps?: BaseAutocomplete.Input.Props;
  positionerProps?: BaseAutocomplete.Positioner.Props;
  renderItem?: (item: string) => ReactNode;
  emptyMessage?: ReactNode;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      items,
      label,
      placeholder,
      isDisabled,
      disabled,
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
    const generatedId = useId();
    const inputId = inputProps?.id ?? generatedId;
    return (
      <BaseAutocomplete.Root
        {...props}
        items={items}
        disabled={isDisabled ?? disabled}
        onValueChange={(value, details) => {
          onValueChange?.(value, details);
          if (!details.isCanceled) onChange?.(value);
        }}
      >
        <div className={cn('relative flex flex-col gap-1', className)}>
          {label && (
            <label htmlFor={inputId} className="text-sm font-semibold">
              {label}
            </label>
          )}
          <InputGroup>
            <BaseAutocomplete.Input
              placeholder={placeholder}
              {...inputProps}
              id={inputId}
              ref={ref}
              render={<InputGroupInput className="text-sm" />}
            />
          </InputGroup>
          <BaseAutocomplete.Portal>
            <BaseAutocomplete.Positioner
              align="start"
              sideOffset={4}
              {...positionerProps}
              className={state =>
                cn(
                  'zen-layer-floating',
                  typeof positionerProps?.className === 'function'
                    ? positionerProps.className(state)
                    : positionerProps?.className,
                )
              }
            >
              <BaseAutocomplete.Popup className="zen-popover w-[var(--anchor-width)] max-w-[var(--available-width)] max-h-[min(23rem,var(--available-height))] overflow-auto rounded-md border border-edge bg-surface-overlay p-2 text-fg shadow-lg outline-none">
                <BaseAutocomplete.List>
                  {(item: string) => (
                    <BaseAutocomplete.Item
                      key={item}
                      value={item}
                      className="cursor-default rounded px-3 py-2 text-sm outline-none data-[highlighted]:bg-interactive"
                    >
                      {renderItem ? renderItem(item) : item}
                    </BaseAutocomplete.Item>
                  )}
                </BaseAutocomplete.List>
                <BaseAutocomplete.Empty>
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
