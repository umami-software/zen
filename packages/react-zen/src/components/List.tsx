import { CheckIcon } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
  useState,
} from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Field, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

type SelectionMode = 'none' | 'single' | 'multiple';

interface ListContextValue {
  selectionMode: SelectionMode;
  showCheckmark: boolean;
  selected: ReadonlySet<string>;
  toggle: (value: string) => void;
}

const ListContext = createContext<ListContextValue>({
  selectionMode: 'none',
  showCheckmark: true,
  selected: new Set(),
  toggle: () => undefined,
});

export interface ListProps
  extends Omit<ComponentProps<'div'>, 'onChange' | 'defaultValue' | 'value'> {
  label?: ReactNode;
  selectionMode?: SelectionMode;
  /** Controlled selected item values. Always an array, also in single selection mode. */
  value?: string[];
  /** Initially selected item values (uncontrolled). */
  defaultValue?: string[];
  /** Called with the selected item values whenever the selection changes. */
  onValueChange?: (value: string[]) => void;
  /** Shows a check mark on selected items. */
  showCheckmark?: boolean;
}

export function List({
  id,
  label,
  selectionMode = 'none',
  value,
  defaultValue,
  onValueChange,
  showCheckmark = true,
  className,
  children,
  onKeyDown,
  ...props
}: ListProps) {
  const listId = useFieldId(id);
  const labelId = useId();
  const [uncontrolled, setUncontrolled] = useState<string[]>(() => defaultValue ?? []);
  const selectedValues = value ?? uncontrolled;
  const selected = new Set(selectedValues);

  const toggle = (itemValue: string) => {
    if (selectionMode === 'none') {
      return;
    }

    let next: string[];

    if (selectionMode === 'multiple') {
      next = selected.has(itemValue)
        ? selectedValues.filter(v => v !== itemValue)
        : [...selectedValues, itemValue];
    } else {
      next = selected.has(itemValue) ? [] : [itemValue];
    }

    if (value === undefined) {
      setUncontrolled(next);
    }
    onValueChange?.(next);
  };

  // Roving focus: the container is the single tab stop and the arrow keys move
  // focus between the options (which are focusable programmatically only).
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return;
    }

    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])',
      ),
    );

    if (options.length === 0) {
      return;
    }

    const current = options.indexOf(document.activeElement as HTMLElement);
    let next = 0;

    if (event.key === 'ArrowDown') {
      next = current < 0 ? 0 : Math.min(current + 1, options.length - 1);
    } else if (event.key === 'ArrowUp') {
      next = current < 0 ? options.length - 1 : Math.max(current - 1, 0);
    } else if (event.key === 'End') {
      next = options.length - 1;
    }

    event.preventDefault();
    options[next]?.focus();
  };

  const listbox = (
    <ListContext.Provider value={{ selectionMode, showCheckmark, selected, toggle }}>
      <div
        id={listId}
        role="listbox"
        aria-multiselectable={selectionMode === 'multiple' || undefined}
        aria-labelledby={label ? labelId : undefined}
        tabIndex={0}
        {...props}
        data-slot="list"
        className={cn(
          'flex flex-col overflow-auto rounded-md p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
          className,
        )}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </ListContext.Provider>
  );

  if (!label) {
    return listbox;
  }

  return (
    <Field>
      <FieldLabel id={labelId}>{label}</FieldLabel>
      {listbox}
    </Field>
  );
}

export interface ListItemProps extends Omit<ComponentProps<'div'>, 'value'> {
  /** Identifies the item in the list's `value`. Defaults to the text content when it is a string. */
  value?: string;
  disabled?: boolean;
}

export function ListItem({
  value,
  children,
  className,
  disabled,
  onClick,
  onKeyDown,
  ...props
}: ListItemProps) {
  const { selectionMode, showCheckmark, selected, toggle } = useContext(ListContext);
  const itemValue = value ?? (typeof children === 'string' ? children : '');
  const isSelected = selected.has(itemValue);
  const hasIndicator = showCheckmark && selectionMode !== 'none';

  return (
    <div
      role="option"
      tabIndex={disabled ? undefined : -1}
      {...props}
      aria-disabled={disabled || undefined}
      aria-selected={isSelected}
      data-selected={isSelected || undefined}
      data-disabled={disabled || undefined}
      data-slot="list-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        hasIndicator ? 'pr-8' : 'pr-2',
        className,
      )}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) {
          toggle(itemValue);
        }
      }}
      onKeyDown={event => {
        onKeyDown?.(event);
        if (!event.defaultPrevented && !disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          toggle(itemValue);
        }
      }}
    >
      {children}
      {hasIndicator && isSelected && (
        <span
          data-slot="list-item-indicator"
          className="pointer-events-none absolute right-2 flex size-4 items-center justify-center"
        >
          <CheckIcon aria-hidden="true" />
        </span>
      )}
    </div>
  );
}

export interface ListSeparatorProps extends ComponentProps<'div'> {}

export function ListSeparator({ className, ...props }: ListSeparatorProps) {
  return (
    <div
      role="separator"
      {...props}
      data-slot="list-separator"
      className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
    />
  );
}

export interface ListSectionProps extends Omit<ComponentProps<'div'>, 'title'> {
  title?: ReactNode;
}

export function ListSection({ title, className, children, ...props }: ListSectionProps) {
  const titleId = useId();

  return (
    <div
      role="group"
      aria-labelledby={title ? titleId : undefined}
      {...props}
      data-slot="list-section"
      className={cn('flex flex-col', className)}
    >
      {title && (
        <div
          id={titleId}
          data-slot="list-section-title"
          className="px-2 py-1.5 text-xs text-muted-foreground"
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
