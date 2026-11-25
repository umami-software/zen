import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { XIcon } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

export interface AutocompleteProps
  extends Omit<BaseAutocomplete.Root.Props<string>, 'children' | 'items' | 'inline'> {
  items: readonly string[];
  label?: ReactNode;
  placeholder?: string;
  /** Shows a clear button while the input has a value. */
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
      disabled,
      showClear,
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
      <BaseAutocomplete.Root {...props} id={id} items={items} disabled={disabled}>
        <Field
          data-slot="autocomplete"
          data-disabled={disabled ? true : undefined}
          className={cn('relative', className)}
        >
          {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
          <InputGroup data-disabled={disabled ? 'true' : undefined}>
            <BaseAutocomplete.Input
              placeholder={placeholder}
              {...inputProps}
              id={inputId}
              ref={ref}
              render={<InputGroupInput />}
            />
            {showClear && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear"
                  render={<BaseAutocomplete.Clear />}
                >
                  <XIcon />
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
              sideOffset={6}
              {...positionerProps}
              data-slot="autocomplete-positioner"
              className={state =>
                cn(
                  'isolate z-50',
                  typeof positionerProps?.className === 'function'
                    ? positionerProps.className(state)
                    : positionerProps?.className,
                )
              }
            >
              <BaseAutocomplete.Popup
                data-slot="autocomplete-content"
                className="relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
              >
                <BaseAutocomplete.List
                  data-slot="autocomplete-list"
                  className="no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0"
                >
                  {(item: string) => (
                    <BaseAutocomplete.Item
                      key={item}
                      value={item}
                      data-slot="autocomplete-item"
                      className="relative flex w-full cursor-default items-center gap-2 rounded-md px-1.5 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--icon-size)"
                    >
                      {renderItem ? renderItem(item) : item}
                    </BaseAutocomplete.Item>
                  )}
                </BaseAutocomplete.List>
                <BaseAutocomplete.Empty data-slot="autocomplete-empty">
                  <div className="flex w-full justify-center py-2 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                </BaseAutocomplete.Empty>
              </BaseAutocomplete.Popup>
            </BaseAutocomplete.Positioner>
          </BaseAutocomplete.Portal>
        </Field>
      </BaseAutocomplete.Root>
    );
  },
);

Autocomplete.displayName = 'Autocomplete';
