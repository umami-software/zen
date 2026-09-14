import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type TableHTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { Checkbox, type CheckboxProps } from './Checkbox';
import {
  TableSelectionContext,
  type TableSelectionMode,
  TableSelectionScopeContext,
} from './lib/tableSelection';
import { cn } from './lib/tailwind';

const gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  selectionMode?: TableSelectionMode;
  selectedKeys?: Iterable<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (keys: Set<string>) => void;
}

export interface TableColumnProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'start' | 'center' | 'end';
  isRowHeader?: boolean;
}

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'start' | 'center' | 'end';
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  id?: string;
}

const alignClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
};

const INTERACTIVE_SELECTOR =
  'a, button, input, select, textarea, [role="button"], [role="checkbox"]';

/* -------------------------------------------------------------------------- */
/*                                 Container                                  */
/* -------------------------------------------------------------------------- */

export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {}

/** Scroll container for a `Table`. */
export function TableContainer({ className, ...props }: TableContainerProps) {
  return (
    <div
      {...props}
      data-slot="table-container"
      className={cn('relative w-full overflow-x-auto', className)}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Table                                    */
/* -------------------------------------------------------------------------- */

export function Table({
  children,
  className,
  selectionMode = 'none',
  selectedKeys: controlledSelectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  ...props
}: TableProps) {
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = useState(
    () => new Set(defaultSelectedKeys),
  );
  const [rowKeys, setRowKeys] = useState<Set<string>>(() => new Set());
  const selectedKeys =
    controlledSelectedKeys === undefined
      ? uncontrolledSelectedKeys
      : new Set(controlledSelectedKeys);

  const updateSelection = useCallback(
    (next: Set<string>) => {
      if (controlledSelectedKeys === undefined) {
        setUncontrolledSelectedKeys(next);
      }
      onSelectionChange?.(next);
    },
    [controlledSelectedKeys, onSelectionChange],
  );

  const registerRow = useCallback((key: string) => {
    setRowKeys(current => {
      if (current.has(key)) {
        return current;
      }
      const next = new Set(current);
      next.add(key);
      return next;
    });

    return () => {
      setRowKeys(current => {
        if (!current.has(key)) {
          return current;
        }
        const next = new Set(current);
        next.delete(key);
        return next;
      });
    };
  }, []);

  const setRowSelected = useCallback(
    (key: string, selected: boolean) => {
      if (selectionMode === 'none') {
        return;
      }

      const next = new Set(selectionMode === 'multiple' ? selectedKeys : []);
      if (selected) {
        next.add(key);
      } else {
        next.delete(key);
      }
      updateSelection(next);
    },
    [selectedKeys, selectionMode, updateSelection],
  );

  const setAllSelected = useCallback(
    (selected: boolean) => {
      if (selectionMode !== 'multiple') {
        return;
      }
      updateSelection(selected ? new Set(rowKeys) : new Set());
    },
    [rowKeys, selectionMode, updateSelection],
  );

  const selection = useMemo(
    () => ({
      selectionMode,
      selectedKeys,
      rowKeys,
      registerRow,
      setRowSelected,
      setAllSelected,
    }),
    [registerRow, rowKeys, selectedKeys, selectionMode, setAllSelected, setRowSelected],
  );

  return (
    <TableSelectionContext.Provider value={selection}>
      <table
        {...props}
        role="table"
        data-slot="table"
        data-selection-mode={selectionMode}
        className={cn('grid text-sm w-full relative', className)}
      >
        {children}
      </table>
    </TableSelectionContext.Provider>
  );
}

interface TableHeaderComponentProps extends HTMLAttributes<HTMLTableSectionElement> {
  style?: CSSProperties;
}

export function TableHeader({ children, className, style, ...props }: TableHeaderComponentProps) {
  const cols = style?.gridTemplateColumns || gridTemplateColumns;
  return (
    <thead
      {...props}
      role="rowgroup"
      data-slot="table-header"
      className={cn(
        '[&>tr]:grid [&>tr]:border-b [&>tr]:border-edge [&>tr]:[grid-template-columns:var(--grid-cols)]',
        className,
      )}
      style={{ '--grid-cols': cols } as CSSProperties}
    >
      <tr role="row" data-slot="table-header-row">
        <TableSelectionScopeContext.Provider value={{ type: 'header' }}>
          {children}
        </TableSelectionScopeContext.Provider>
      </tr>
    </thead>
  );
}

export function TableBody({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody {...props} role="rowgroup" data-slot="table-body" className={cn('contents', className)}>
      {children}
    </tbody>
  );
}

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
  style?: CSSProperties;
}

export function TableFooter({ children, className, style, ...props }: TableFooterProps) {
  const cols = style?.gridTemplateColumns || gridTemplateColumns;
  return (
    <tfoot
      {...props}
      role="rowgroup"
      data-slot="table-footer"
      className={cn(
        'font-medium',
        '[&>tr]:grid [&>tr]:border-t [&>tr]:border-edge [&>tr]:[grid-template-columns:var(--grid-cols)]',
        className,
      )}
      style={{ '--grid-cols': cols } as CSSProperties}
    >
      <tr role="row" data-slot="table-footer-row">
        {children}
      </tr>
    </tfoot>
  );
}

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {}

export function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      {...props}
      data-slot="table-caption"
      className={cn('mt-4 text-sm text-fg-muted', className)}
    />
  );
}

export function TableRow({ children, className, style, id, ...props }: TableRowProps) {
  const generatedId = useId();
  const selection = useContext(TableSelectionContext);
  const isSelectable = selection !== null && selection.selectionMode !== 'none';

  if (process.env.NODE_ENV !== 'production' && isSelectable && id === undefined) {
    console.warn(
      '[react-zen] <TableRow> requires a stable `id` when the table has a selection mode. ' +
        'A generated id is used as a fallback, which resets the selection whenever the row remounts.',
    );
  }

  const rowKey = id !== undefined ? String(id) : generatedId;
  const isSelected = selection?.selectedKeys.has(rowKey) ?? false;
  const registerRow = selection?.registerRow;
  // Roving tab stop: only the first row participates in the tab sequence.
  const firstRowKey = selection ? selection.rowKeys.values().next().value : undefined;

  useEffect(() => registerRow?.(rowKey), [registerRow, rowKey]);

  const selectFromEvent = (
    event: MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>,
  ) => {
    if (!selection || !isSelectable || event.defaultPrevented) {
      return;
    }

    if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) {
      return;
    }

    selection.setRowSelected(rowKey, !isSelected);
  };

  return (
    <tr
      {...props}
      role="row"
      data-slot="table-row"
      data-row-id={id}
      data-selected={isSelected || undefined}
      aria-selected={isSelectable ? isSelected : undefined}
      tabIndex={isSelectable ? (props.tabIndex ?? (rowKey === firstRowKey ? 0 : -1)) : undefined}
      className={cn(
        'grid border-b border-edge-muted min-h-10',
        isSelectable &&
          'cursor-pointer outline-none data-[selected]:bg-interactive focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
        className,
      )}
      style={{ gridTemplateColumns, ...style }}
      onClick={event => {
        props.onClick?.(event);
        selectFromEvent(event);
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event);
        if (event.defaultPrevented || !isSelectable) {
          return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          const sibling =
            event.key === 'ArrowDown'
              ? event.currentTarget.nextElementSibling
              : event.currentTarget.previousElementSibling;
          if (sibling instanceof HTMLElement) {
            event.preventDefault();
            sibling.focus();
          }
          return;
        }
        if (
          (event.key === 'Enter' || event.key === ' ') &&
          !(event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR))
        ) {
          event.preventDefault();
          selection?.setRowSelected(rowKey, !isSelected);
        }
      }}
    >
      <TableSelectionScopeContext.Provider value={{ type: 'row', rowKey }}>
        {children}
      </TableSelectionScopeContext.Provider>
    </tr>
  );
}

export function TableColumn({
  children,
  className,
  align,
  isRowHeader: _isRowHeader,
  ...props
}: TableColumnProps) {
  return (
    <th
      {...props}
      role="columnheader"
      scope="col"
      data-slot="table-column"
      className={cn(
        'flex p-2 text-left font-bold flex-1 first:pl-0 last:pr-0',
        align && alignClasses[align],
        className,
      )}
    >
      {children}
    </th>
  );
}

/** Alias of `TableColumn` matching the shadcn naming. */
export const TableHead = TableColumn;

export function TableCell({ children, className, align, ...props }: TableCellProps) {
  return (
    <td
      {...props}
      role="cell"
      data-slot="table-cell"
      className={cn(
        'flex p-2 flex-1 first:pl-0 last:pr-0',
        '[&_a]:font-medium [&_a]:underline [&_a]:decoration-edge [&_a]:underline-offset-4',
        '[&_a:hover]:decoration-primary',
        align && alignClasses[align],
        className,
      )}
    >
      {children}
    </td>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Selection checkbox                             */
/* -------------------------------------------------------------------------- */

export interface TableSelectionCheckboxProps
  extends Omit<CheckboxProps, 'isSelected' | 'isIndeterminate' | 'defaultSelected'> {
  children?: ReactNode;
}

/**
 * A `Checkbox` wired up to the enclosing `Table` selection state. Renders the
 * "select all" checkbox inside a `TableHeader` and a row checkbox inside a
 * `TableRow`.
 */
export function TableSelectionCheckbox({
  isDisabled,
  onChange,
  ...props
}: TableSelectionCheckboxProps) {
  const selection = useContext(TableSelectionContext);
  const scope = useContext(TableSelectionScopeContext);

  if (!selection || !scope) {
    return null;
  }

  const isHeader = scope.type === 'header';
  const selectedRowCount = Array.from(selection.rowKeys).filter(key =>
    selection.selectedKeys.has(key),
  ).length;
  const checked = isHeader
    ? selection.rowKeys.size > 0 && selectedRowCount === selection.rowKeys.size
    : scope.rowKey
      ? selection.selectedKeys.has(scope.rowKey)
      : false;
  const indeterminate =
    isHeader && selectedRowCount > 0 && selectedRowCount < selection.rowKeys.size;

  return (
    <Checkbox
      {...props}
      aria-label={props['aria-label'] ?? (isHeader ? 'Select all rows' : 'Select row')}
      isSelected={checked}
      isIndeterminate={indeterminate}
      isDisabled={
        isDisabled ||
        selection.selectionMode === 'none' ||
        (isHeader && selection.selectionMode !== 'multiple')
      }
      onChange={selected => {
        onChange?.(selected);
        if (isHeader) {
          selection.setAllSelected(selected);
        } else if (scope.rowKey) {
          selection.setRowSelected(scope.rowKey, selected);
        }
      }}
    />
  );
}
