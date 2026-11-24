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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn, mapIdProperty } from '@/lib/utils';

const SELECTION_COLUMN_WIDTH = '2rem';

const alignClasses = {
  start: 'justify-start text-left',
  center: 'justify-center text-center',
  end: 'justify-end text-right',
};

export type DataTableSelectionMode = 'none' | 'single' | 'multiple';

export interface DataTableProps extends ComponentProps<typeof Table> {
  data?: any[];
  displayMode?: 'table' | 'cards';
  /** Adds a checkbox column for selecting rows. Rows are keyed by their `id`. */
  selectionMode?: DataTableSelectionMode;
  /** Selected row ids (controlled). */
  selectedRows?: string[];
  /** Initially selected row ids (uncontrolled). */
  defaultSelectedRows?: string[];
  /** Called with the new list of selected row ids. */
  onSelectedRowsChange?: (selectedRows: string[]) => void;
}

export function DataTable({
  data = [],
  displayMode = 'table',
  selectionMode = 'none',
  selectedRows: selectedRowsProp,
  defaultSelectedRows = [],
  onSelectedRowsChange,
  className,
  children,
  ...props
}: DataTableProps) {
  const [uncontrolledSelectedRows, setUncontrolledSelectedRows] = useState(defaultSelectedRows);
  const selectedRows = selectedRowsProp ?? uncontrolledSelectedRows;

  const rows = mapIdProperty(data);
  const rowIds = rows.map(row => String(row.id));

  const columns = Children.toArray(children)
    .filter(isValidElement)
    .map(child => child.props as DataColumnProps);

  const visibleColumns = columns.filter(({ hidden }) => !hidden);

  if (displayMode === 'cards') {
    return (
      <Grid width="100%" gap="6">
        {rows.map((row, index) => {
          const items = visibleColumns.map(({ id, label, children }) => {
            const value =
              typeof children === 'function' ? children(row, index) : (children ?? row[id]);

            return { id, label, value };
          });

          return <DataCard key={`${row.id}-${index}`} data={items} />;
        })}
      </Grid>
    );
  }

  const isSelectable = selectionMode !== 'none';

  const gridTemplateColumns = [
    ...(isSelectable ? [SELECTION_COLUMN_WIDTH] : []),
    ...visibleColumns.map(({ width }) => width || '1fr'),
  ].join(' ');

  const rowStyle: CSSProperties = { gridTemplateColumns };

  const setSelectedRows = (next: string[]) => {
    if (selectedRowsProp === undefined) {
      setUncontrolledSelectedRows(next);
    }
    onSelectedRowsChange?.(next);
  };

  const setRowSelected = (rowId: string, checked: boolean) => {
    if (selectionMode === 'single') {
      setSelectedRows(checked ? [rowId] : []);
      return;
    }

    setSelectedRows(
      checked
        ? [...selectedRows.filter(id => id !== rowId), rowId]
        : selectedRows.filter(id => id !== rowId),
    );
  };

  const selectedCount = rowIds.filter(id => selectedRows.includes(id)).length;
  const allSelected = rowIds.length > 0 && selectedCount === rowIds.length;

  return (
    <Table
      {...props}
      data-slot="data-table"
      data-selection-mode={isSelectable ? selectionMode : undefined}
      className={cn('grid', className)}
    >
      <TableHeader className="contents">
        <TableRow className="grid hover:bg-transparent" style={rowStyle}>
          {isSelectable && (
            <TableHead className="flex items-center">
              {selectionMode === 'multiple' && (
                <Checkbox
                  aria-label="Select all rows"
                  checked={allSelected}
                  indeterminate={selectedCount > 0 && !allSelected}
                  onCheckedChange={checked => setSelectedRows(checked ? rowIds : [])}
                />
              )}
            </TableHead>
          )}
          {visibleColumns.map(({ id, label, align }) => (
            <TableHead key={id} className={cn('flex items-center', align && alignClasses[align])}>
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="contents">
        {rows.map((row, index) => {
          const rowId = String(row.id);
          const isSelected = isSelectable && selectedRows.includes(rowId);

          return (
            <TableRow
              key={rowId}
              data-row-id={rowId}
              data-state={isSelected ? 'selected' : undefined}
              className="grid"
              style={rowStyle}
            >
              {isSelectable && (
                <TableCell className="flex items-center">
                  <Checkbox
                    aria-label="Select row"
                    checked={isSelected}
                    onCheckedChange={checked => setRowSelected(rowId, checked)}
                  />
                </TableCell>
              )}
              {visibleColumns.map(
                ({
                  id,
                  label: _label,
                  width: _width,
                  hidden: _hidden,
                  as,
                  align,
                  className: cellClassName,
                  children,
                  ...cellProps
                }) => {
                  const value =
                    typeof children === 'function' ? children(row, index) : children || row[id];

                  return (
                    <TableCell
                      {...cellProps}
                      key={id}
                      className={cn(
                        'flex min-w-0 items-center whitespace-normal',
                        align && alignClasses[align],
                        cellClassName,
                      )}
                    >
                      {as ? createElement(as, {}, value) : value}
                    </TableCell>
                  );
                },
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export interface DataColumnProps extends Omit<HTMLAttributes<HTMLTableCellElement>, 'children'> {
  id: string;
  label?: ReactNode;
  align?: 'start' | 'center' | 'end';
  width?: string;
  as?: string;
  hidden?: boolean;
  children?: ReactNode | ((row: any, index: number) => ReactNode);
}

export function DataColumn(_props: DataColumnProps) {
  return null;
}
