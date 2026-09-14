import type { ReactNode } from 'react';
import { Button, type ButtonProps } from './Button';
import { Icon } from './Icon';
import { Spinner } from './Spinner';

export interface LoadingButtonProps extends ButtonProps {
  children?: ReactNode;
  isDisabled?: boolean;
  isLoading?: boolean;
  showText?: boolean;
}

export function LoadingButton({
  isLoading,
  isDisabled,
  showText = true,
  children,
  ...props
}: LoadingButtonProps) {
  const loading = !!isLoading;

  return (
    <Button
      {...props}
      data-slot="loading-button"
      data-loading={loading || undefined}
      aria-busy={loading}
      isDisabled={isDisabled || loading}
    >
      {loading && (
        <Icon size="sm">
          <Spinner isDisabled={isDisabled} />
        </Icon>
      )}
      {showText && children}
    </Button>
  );
}
