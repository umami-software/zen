import type { ReactNode } from 'react';
import { Column, type ColumnProps } from './Column';
import { Row, type RowProps } from './Row';
import { Text } from './Text';

export interface PageHeaderProps extends RowProps {
  children?: ReactNode;
}

export function PageHeader({ children, ...props }: PageHeaderProps) {
  return (
    <Row
      width="100%"
      paddingY="4"
      alignItems="center"
      justifyContent="space-between"
      border="bottom"
      gap="4"
      {...props}
    >
      {children}
    </Row>
  );
}

export interface PageHeaderTitleProps extends Omit<ColumnProps, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  breadcrumb?: ReactNode;
}

export function PageHeaderTitle({
  title,
  description,
  breadcrumb,
  children,
  ...props
}: PageHeaderTitleProps) {
  return (
    <Column gap="1" {...props}>
      {breadcrumb}
      <Text size="xl" weight="semibold">
        {title}
      </Text>
      {description && <Text color="muted">{description}</Text>}
      {children}
    </Column>
  );
}

export interface PageHeaderActionsProps extends RowProps {
  children?: ReactNode;
}

export function PageHeaderActions({ children, ...props }: PageHeaderActionsProps) {
  return (
    <Row gap="2" alignItems="center" {...props}>
      {children}
    </Row>
  );
}
