import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  globalFilteringFeature,
  type RowData,
  type RowSelectionState,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import {
  Children,
  type ComponentProps,
  type CSSProperties,
  createElement,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  useState,
} from 'react';
import { DataCard } from '@/components/DataCard';
import { Grid } from '@/components/Grid';
import { ArrowDown, ArrowUp, ChevronsUpDown } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

// Only the TanStack Table features DataTable uses; the rest are tree-shaken out.
const features = tableFeatures({
  columnFilteringFeature, // required by globalFilteringFeature
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

const SELECTION_COLUMN_WIDTH = '2rem';

const alignClasses = {
  start: 'justify-start text-left',
  center: 'justify-center text-center',
  end: 'justify-end text-right',
};

export type DataTableSelectionMode = 'none' | 'single' | 'multiple';

/** Sorted columns, in priority order. */
export type DataTableSorting = { id: string; desc: boolean }[];

export interface DataTableProps<TData extends RowData = any> extends ComponentProps<typeof Table> {
  data?: TData[];
  displayMode?: 'table' | 'cards';
  /** Returns a row's unique id. Defaults to the row's `id` property, or its index without one. */
  getRowId?: (row: TData, index: number) => string;
  /** Adds a checkbox column for selecting rows. */
  selectionMode?: DataTableSelectionMode;
  /** Selected row ids (controlled). */
  selectedRows?: string[];
  /** Initially selected row ids (uncontrolled). */
  defaultSelectedRows?: string[];
  /** Called with the new list of selected row ids. */
  onSelectedRowsChange?: (selectedRows: string[]) => void;
  /** Sorted columns (controlled). Columns are sortable by clicking headers when `sortable`. */
  sorting?: DataTableSorting;
  /** Initially sorted columns (uncontrolled). */
  defaultSorting?: DataTableSorting;
  /** Called when the user changes the sorting. */
  onSortingChange?: (sorting: DataTableSorting) => void;
  /** Shows only rows where a filterable column contains this text (case-insensitive). */
  filter?: string;
  /** Splits rows into pages of this size and shows Previous and Next controls. */
  pageSize?: number;
  /** Current page, starting at 0 (controlled). */
  pageIndex?: number;
  /** Initial page, starting at 0 (uncontrolled). */
  defaultPageIndex?: number;
  /** Called when the page changes. */
  onPageIndexChange?: (pageIndex: number) => void;
  /** Shown when there are no rows to display (default: "No results."). */
  emptyState?: ReactNode;
}

export interface DataColumnProps<TData = any>
  extends Omit<HTMLAttributes<HTMLTableCellElement>, 'children'> {
  id: string;
  label?: ReactNode;
  align?: 'start' | 'center' | 'end';
  width?: string;
  as?: string;
  hidden?: boolean;
  /** The column's value for a row, used for sorting, filtering and the default cell. Defaults to `row[id]`. */
  value?: (row: TData) => unknown;
  /** Lets users sort by this column by clicking its header. */
  sortable?: boolean;
  /** Includes this column when matching `filter` (default: true for text and number values). */
  filterable?: boolean;
  children?: ReactNode | ((row: TData, index: number) => ReactNode);
}

/** Declares a column of a DataTable. Renders nothing on its own. */
export function DataColumn<TData = any>(_props: DataColumnProps<TData>) {
  return null;
}

type Updater<T> = T | ((old: T) => T);

function resolve<T>(updater: Updater<T>, old: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(old) : updater;
}

/** State that is controlled when `value` is defined and uncontrolled otherwise. */
function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const current = value === undefined ? uncontrolled : value;

  const setValue = (next: T) => {
    if (value === undefined) {
      setUncontrolled(next);
    }
    onChange?.(next);
  };

  return [current, setValue];
}

function defaultGetRowId(row: any, index: number) {
  return row?.id !== undefined && row?.id !== null ? String(row.id) : String(index);
}

function getColumnValue<TData>(column: DataColumnProps<TData>, row: TData) {
  return column.value ? column.value(row) : (row as any)?.[column.id];
}

function renderCell<TData>(column: DataColumnProps<TData>, row: TData, index: number) {
  const { children, as } = column;
  const content =
    typeof children === 'function'
      ? children(row, index)
      : children !== undefined && children !== null
        ? children
        : (getColumnValue(column, row) as ReactNode);

  return as ? createElement(as, {}, content) : content;
}

export function DataTable<TData extends RowData = any>({
  data = [],
  displayMode = 'table',
  getRowId = defaultGetRowId,
  selectionMode = 'none',
  selectedRows: selectedRowsProp,
  defaultSelectedRows = [],
  onSelectedRowsChange,
  sorting: sortingProp,
  defaultSorting = [],
  onSortingChange,
  filter = '',
  pageSize,
  pageIndex: pageIndexProp,
  defaultPageIndex = 0,
  onPageIndexChange,
  emptyState = 'No results.',
  className,
  children,
  ...props
}: DataTableProps<TData>) {
  const [selectedRows, setSelectedRows] = useControllableState(
    selectedRowsProp,
    defaultSelectedRows,
    onSelectedRowsChange,
  );
  const [sorting, setSorting] = useControllableState(sortingProp, defaultSorting, onSortingChange);
  const [pageIndex, setPageIndex] = useControllableState(
    pageIndexProp,
    defaultPageIndex,
    onPageIndexChange,
  );

  const columns = Children.toArray(children)
    .filter(isValidElement)
    .map(child => child.props as DataColumnProps<TData>);

  const visibleColumns = columns.filter(({ hidden }) => !hidden);

  const isSelectable = selectionMode !== 'none';
  const isPaginated = pageSize !== undefined && pageSize > 0;

  const rowSelection: RowSelectionState = Object.fromEntries(selectedRows.map(id => [id, true]));

  const table = useTable({
    features,
    data,
    columns: visibleColumns.map(column => ({
      id: column.id,
      accessorFn: (row: TData) => getColumnValue(column, row),
      enableSorting: !!column.sortable,
      enableGlobalFilter: column.filterable !== false,
      sortUndefined: 'last' as const,
      // TanStack sorts numbers and dates descending first; always start ascending instead.
      sortDescFirst: false,
    })),
    getRowId: (row: TData, index: number) => getRowId(row, index),
    enableRowSelection: isSelectable,
    enableMultiRowSelection: selectionMode === 'multiple',
    globalFilterFn: 'includesString',
    state: {
      sorting,
      rowSelection,
      globalFilter: filter,
      pagination: { pageIndex, pageSize: pageSize ?? Math.max(data.length, 1) },
    },
    onSortingChange: (updater: Updater<DataTableSorting>) => setSorting(resolve(updater, sorting)),
    onRowSelectionChange: (updater: Updater<RowSelectionState>) => {
      const next = resolve(updater, rowSelection);
      setSelectedRows(Object.keys(next));
    },
    onPaginationChange: (updater: Updater<{ pageIndex: number; pageSize: number }>) => {
      setPageIndex(resolve(updater, { pageIndex, pageSize: pageSize ?? 0 }).pageIndex);
    },
    onGlobalFilterChange: () => {},
  });

  const rows = (isPaginated ? table.getRowModel() : table.getPrePaginatedRowModel()).rows;
  const pageCount = isPaginated ? table.getPageCount() : 1;

  const pagination = isPaginated && pageCount > 1 && (
    <div
      data-slot="data-table-pagination"
      className="flex w-full items-center justify-between gap-4 py-3 text-sm text-muted-foreground"
    >
      <span>
        Page {pageIndex + 1} of {pageCount}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );

  const empty = (
    <div data-slot="data-table-empty" className="py-10 text-center text-sm text-muted-foreground">
      {emptyState}
    </div>
  );

  if (displayMode === 'cards') {
    return (
      <Grid width="100%" gap="6" data-slot="data-table" data-display-mode="cards">
        {rows.length === 0
          ? empty
          : rows.map(row => {
              const items = visibleColumns.map(column => ({
                label: column.label,
                value: renderCell(column, row.original as TData, row.index),
              }));

              if (isSelectable) {
                items.unshift({
                  label: '',
                  value: (
                    <Checkbox
                      aria-label="Select row"
                      checked={row.getIsSelected()}
                      onCheckedChange={checked => row.toggleSelected(checked)}
                    />
                  ),
                });
              }

              return (
                <DataCard
                  key={row.id}
                  data-row-id={row.id}
                  data-state={row.getIsSelected() ? 'selected' : undefined}
                  data={items}
                />
              );
            })}
        {pagination}
      </Grid>
    );
  }

  const gridTemplateColumns = [
    ...(isSelectable ? [SELECTION_COLUMN_WIDTH] : []),
    ...visibleColumns.map(({ width }) => width || '1fr'),
  ].join(' ');

  const rowStyle: CSSProperties = { gridTemplateColumns };

  const allSelected = table.getIsAllRowsSelected();
  const someSelected = table.getIsSomeRowsSelected();

  // The table and its parts are laid out with CSS grid (display: contents on the sections), which
  // drops their implicit table semantics in some browsers. The explicit roles restore them.
  const tableElement = (
    <Table
      {...props}
      role="table"
      data-slot="data-table"
      data-selection-mode={isSelectable ? selectionMode : undefined}
      className={cn('grid', className)}
    >
      <TableHeader role="rowgroup" className="contents">
        <TableRow role="row" className="grid hover:bg-transparent" style={rowStyle}>
          {isSelectable && (
            <TableHead role="columnheader" className="flex items-center">
              {selectionMode === 'multiple' && (
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected}
                  indeterminate={someSelected && !allSelected}
                  onCheckedChange={checked => table.toggleAllRowsSelected(checked)}
                />
              )}
            </TableHead>
          )}
          {visibleColumns.map(column => {
            const tableColumn = table.getColumn(column.id);
            const sorted = column.sortable ? tableColumn?.getIsSorted() : false;
            const SortIcon =
              sorted === 'asc' ? ArrowUp : sorted === 'desc' ? ArrowDown : ChevronsUpDown;

            return (
              <TableHead
                key={column.id}
                role="columnheader"
                aria-sort={
                  column.sortable
                    ? sorted === 'asc'
                      ? 'ascending'
                      : sorted === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined
                }
                className={cn('flex items-center', column.align && alignClasses[column.align])}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    data-slot="data-table-sort"
                    onClick={tableColumn?.getToggleSortingHandler()}
                    className="-mx-2 inline-flex h-7 cursor-pointer items-center gap-1 rounded-md px-2 font-medium outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    {column.label}
                    <SortIcon
                      aria-hidden="true"
                      className={cn('size-3.5', !sorted && 'text-muted-foreground')}
                    />
                  </button>
                ) : (
                  column.label
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>
      <TableBody role="rowgroup" className="contents">
        {rows.length === 0 ? (
          <TableRow role="row" className="grid hover:bg-transparent" style={rowStyle}>
            <TableCell role="cell" style={{ gridColumn: '1 / -1' }}>
              {empty}
            </TableCell>
          </TableRow>
        ) : (
          rows.map(row => {
            const isSelected = isSelectable && row.getIsSelected();

            return (
              <TableRow
                key={row.id}
                role="row"
                data-row-id={row.id}
                data-state={isSelected ? 'selected' : undefined}
                className="grid"
                style={rowStyle}
              >
                {isSelectable && (
                  <TableCell role="cell" className="flex items-center">
                    <Checkbox
                      aria-label="Select row"
                      checked={isSelected}
                      onCheckedChange={checked => row.toggleSelected(checked)}
                    />
                  </TableCell>
                )}
                {visibleColumns.map(column => {
                  const {
                    id,
                    label: _label,
                    width: _width,
                    hidden: _hidden,
                    as: _as,
                    value: _value,
                    sortable: _sortable,
                    filterable: _filterable,
                    align,
                    className: cellClassName,
                    children: _children,
                    ...cellProps
                  } = column;

                  return (
                    <TableCell
                      {...cellProps}
                      key={id}
                      role="cell"
                      className={cn(
                        'flex min-w-0 items-center whitespace-normal',
                        align && alignClasses[align],
                        cellClassName,
                      )}
                    >
                      {renderCell(column, row.original as TData, row.index)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );

  if (!pagination) {
    return tableElement;
  }

  return (
    <div data-slot="data-table-wrapper" className="flex w-full flex-col">
      {tableElement}
      {pagination}
    </div>
  );
}
