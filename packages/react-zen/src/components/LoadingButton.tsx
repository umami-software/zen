import type { ComponentProps } from 'react';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';

export interface LoadingButtonProps extends ComponentProps<typeof Button> {
  /** Disables the button and shows a spinner before its content. */
  loading?: boolean;
}

export function LoadingButton({
  loading = false,
  disabled,
  children,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
    >
      {loading && <Spinner data-icon="inline-start" />}
      {children}
    </Button>
  );
}
