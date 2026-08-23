import {
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
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
        className={cn(
          'grid text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] w-full relative',
          className,
        )}
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
      className={cn(
        '[&>tr]:grid [&>tr]:border-b [&>tr]:border-edge [&>tr]:[grid-template-columns:var(--grid-cols)]',
        className,
      )}
      style={{ '--grid-cols': cols } as CSSProperties}
    >
      <tr>
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
    <tbody {...props} className={cn('contents', className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className, style, id, ...props }: TableRowProps) {
  const generatedId = useId();
  const rowKey = id ?? generatedId;
  const selection = useContext(TableSelectionContext);
  const isSelectable = selection !== null && selection.selectionMode !== 'none';
  const isSelected = selection?.selectedKeys.has(rowKey) ?? false;
  const registerRow = selection?.registerRow;

  useEffect(() => registerRow?.(rowKey), [registerRow, rowKey]);

  const selectFromEvent = (
    event: MouseEvent<HTMLTableRowElement> | KeyboardEvent<HTMLTableRowElement>,
  ) => {
    if (!selection || !isSelectable || event.defaultPrevented) {
      return;
    }

    if (
      event.target instanceof Element &&
      event.target.closest('a, button, input, select, textarea, [role="button"], [role="checkbox"]')
    ) {
      return;
    }

    selection.setRowSelected(rowKey, !isSelected);
  };

  return (
    <tr
      {...props}
      data-row-id={id}
      data-selected={isSelected || undefined}
      aria-selected={isSelectable ? isSelected : props['aria-selected']}
      tabIndex={isSelectable ? (props.tabIndex ?? 0) : props.tabIndex}
      className={cn(
        'grid border-b border-edge-muted min-h-10',
        isSelectable && 'cursor-pointer data-[selected]:bg-interactive',
        className,
      )}
      style={{ gridTemplateColumns, ...style }}
      onClick={event => {
        props.onClick?.(event);
        selectFromEvent(event);
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event);
        if (
          !event.defaultPrevented &&
          (event.key === 'Enter' || event.key === ' ') &&
          !(
            event.target instanceof Element &&
            event.target.closest(
              'a, button, input, select, textarea, [role="button"], [role="checkbox"]',
            )
          )
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
      scope="col"
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

export function TableCell({ children, className, align, ...props }: TableCellProps) {
  return (
    <td
      {...props}
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
