import { Fragment, type ReactNode } from 'react';
import { Grid, type GridProps } from '@/components/Grid';
import { Row } from '@/components/Row';
import { Text } from '@/components/Text';
import { mapIdProperty } from '@/lib/utils';

export interface DataCardProps extends GridProps {
  data?: { label: ReactNode; value: any }[];
  labelWidth?: string;
}

export function DataCard({ data = [], labelWidth = 'auto', ...props }: DataCardProps) {
  const rows = mapIdProperty(data);

  return (
    <Grid
      width="100%"
      columns={`${labelWidth} 1fr`}
      border
      borderRadius="lg"
      padding="6"
      {...props}
    >
      {rows.map((row, index) => {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: rows are static display data
          <Fragment key={index}>
            <Row paddingY="3" border="bottom" paddingRight="6">
              <Text weight="medium">{row?.label}</Text>
            </Row>
            <Row paddingY="3" border="bottom">
              <Text>{row?.value}</Text>
            </Row>
          </Fragment>
        );
      })}
    </Grid>
  );
}
