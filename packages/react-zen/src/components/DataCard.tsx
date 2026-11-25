import { Fragment, type ReactNode } from 'react';
import { Grid, type GridProps } from '@/components/Grid';
import { cn } from '@/lib/utils';

export interface DataCardProps extends GridProps {
  data?: { label: ReactNode; value: any }[];
  labelWidth?: string;
}

/**
 * Label/value pairs in a bordered card, styled like DataTable: the label column is shaded like
 * the table header, and the row lines run to the card's border.
 */
export function DataCard({ data = [], labelWidth = 'auto', className, ...props }: DataCardProps) {
  return (
    <Grid
      data-slot="data-card"
      width="100%"
      columns={`${labelWidth} 1fr`}
      border
      borderRadius="lg"
      {...props}
      className={cn('overflow-hidden bg-white text-sm dark:bg-black', className)}
    >
      {data.map((row, index) => {
        const isLast = index === data.length - 1;

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are static display data
          <Fragment key={index}>
            <div
              data-slot="data-card-label"
              className={cn(
                'flex items-center border-r bg-muted/50 py-2 pr-6 pl-4 font-medium text-foreground',
                !isLast && 'border-b',
              )}
            >
              {row?.label}
            </div>
            <div
              data-slot="data-card-value"
              className={cn(
                'flex min-w-0 items-center px-4 py-2 wrap-anywhere',
                !isLast && 'border-b',
              )}
            >
              {row?.value}
            </div>
          </Fragment>
        );
      })}
    </Grid>
  );
}
