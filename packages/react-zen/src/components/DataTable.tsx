import {
  Children,
  createElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { DataCard } from '@/components/DataCard';
import { Grid } from '@/components/Grid';
import { mapIdProperty } from '@/lib/utils';
import { cn } from './lib/tailwind';
import {
  Table,
  TableBody,
  TableCell,
  type TableCellProps,
  TableColumn,
  TableHeader,
  type TableProps,
  TableRow,
} from './Table';

export interface DataTableProps extends TableProps {
  data?: any[];
  displayMode?: 'table' | 'cards';
}

export function DataTable({
  data = [],
  displayMode = 'table',
  className,
  children,
  ...props
}: DataTableProps) {
  const rows = mapIdProperty(data);
  const widths: string[] = [];

  const columns = Children.map(children as ReactElement, (child?: ReactElement<any, any>) => {
    if (child) {
      widths.push(child?.props?.width || '1fr');

      return { ...(child?.props as DataColumnProps) };
    }
    return null;
  })?.filter(n => n);

  const gridTemplateColumns = widths.join(' ');

  if (displayMode === 'cards') {
    return (
      <Grid id="grid" width="100%" gap="6">
        {rows.map((row, index) => {
          const items = columns
            ?.filter(({ hidden }) => !hidden)
            .map(({ id, label, children }) => {
              const value =
                typeof children === 'function' ? children(row, index) : (children ?? row[id]);

              return { id, label, value };
            });

          return <DataCard key={`${row.id}-${index}`} data={items} />;
        })}
      </Grid>
    );
  }

  return (
    <Table
      {...props}
      className={cn(
        'relative text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
        className,
      )}
    >
      <TableHeader style={{ gridTemplateColumns }}>
        {columns?.map(({ id, label, as, hidden, width, ...columnProps }) => {
          if (hidden) {
            return null;
          }

          return (
            <TableColumn {...columnProps} key={id} id={id}>
              {label}
            </TableColumn>
          );
        })}
      </TableHeader>
      <TableBody>
        {rows.map((row, index) => {
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: row data may not have unique ids
            <TableRow key={index} id={String(row.id)} style={{ gridTemplateColumns }}>
              {columns?.map(({ id, as, hidden, className, children, ...cellProps }) => {
                if (hidden) {
                  return null;
                }

                const value =
                  typeof children === 'function' ? children(row, index) : children || row[id];

                return (
                  <TableCell
                    {...(cellProps as TableCellProps)}
                    key={id}
                    className={cn('items-center', className)}
                  >
                    {as ? createElement(as, {}, value) : value}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export interface DataColumnProps extends Omit<HTMLAttributes<any>, 'children'> {
  id: string;
  label?: ReactNode;
  align?: 'start' | 'center' | 'end';
  width?: string;
  as?: string;
  hidden?: boolean;
  children?: ReactNode | ((row: any, index: number) => void);
}

export function DataColumn(_props: DataColumnProps) {
  return null;
}
