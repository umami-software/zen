import type { HTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/Button';
import { Column } from '@/components/Column';
import { X } from '@/components/icons';
import { cn } from '@/components/lib/tailwind';
import { Row } from '@/components/Row';
import { Text } from '@/components/Text';
import { toast as toastVariant } from '@/components/variants';

const TOAST_CLOSE_ACTION = 'close';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  id: string;
  message: string;
  title?: string;
  actions?: string[];
  allowClose?: boolean;
  variant?: 'success' | 'error';
  onClose?: (action?: string) => void;
}

export function Toast({
  id,
  message,
  title,
  actions = [],
  allowClose = true,
  variant,
  className,
  children,
  onClose,
  color: _color,
  ...props
}: ToastProps) {
  const hasActions = actions?.length > 0;

  return (
    <Row {...props} data-slot="toast" className={cn(toastVariant({ variant }), className)}>
      <Column flexGrow={1} gap="1">
        {title && <Text weight="semibold">{title}</Text>}
        {message && <Text color={title ? 'muted' : undefined}>{message}</Text>}
      </Column>
      {hasActions &&
        actions.map(action => {
          return (
            <Button key={action} variant="outline" onPress={() => onClose?.(action)}>
              {action}
            </Button>
          );
        })}
      {!hasActions && allowClose && (
        <Button
          variant="quiet"
          size="icon-xs"
          aria-label="Close"
          data-slot="toast-close"
          className="shrink-0 self-start text-fg-muted hover:text-fg"
          onPress={() => onClose?.(TOAST_CLOSE_ACTION)}
        >
          <X />
        </Button>
      )}
    </Row>
  );
}
