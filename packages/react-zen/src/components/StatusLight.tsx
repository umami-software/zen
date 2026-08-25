import type { ReactNode } from 'react';
import { Box } from './Box';
import { cn } from './lib/tailwind';
import { Row } from './Row';

export interface StatusLightProps {
  color?: string;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'active' | 'inactive' | 'none';
  className?: string;
  children?: ReactNode;
}

const variantColors = {
  info: 'bg-status-info',
  success: 'bg-status-success',
  warning: 'bg-status-warning',
  error: 'bg-status-error',
  active: 'bg-status-success',
  inactive: 'bg-neutral-400',
  none: 'bg-transparent',
};

function StatusDot({ color, variant }: { color?: string; variant: string }) {
  return (
    <Row alignItems="center" justifyContent="center" className="relative w-3 h-3">
      <Box
        borderRadius="full"
        className={cn('w-2 h-2', variantColors[variant as keyof typeof variantColors])}
        style={color ? { backgroundColor: color } : undefined}
      />
    </Row>
  );
}

export function StatusLight(props: StatusLightProps) {
  const { color, variant = 'inactive', children, className, ...domProps } = props;

  return (
    <Row
      {...domProps}
      alignItems="center"
      gap="2"
      className={cn('text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]', className)}
    >
      <StatusDot color={color} variant={variant} />
      {children}
    </Row>
  );
}
