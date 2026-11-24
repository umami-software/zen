import { cva } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';
import type { ToastVariant } from '@/components/hooks/useToast';
import { X } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TOAST_CLOSE_ACTION = 'close';

const toastVariants = cva(
  'pointer-events-auto flex w-full min-w-72 max-w-sm items-center gap-3 rounded-lg border bg-popover p-4 text-sm text-popover-foreground shadow-lg',
  {
    variants: {
      variant: {
        default: '',
        success: 'text-success **:data-[slot=toast-description]:text-success/90',
        destructive: 'text-destructive **:data-[slot=toast-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  id: string;
  message: string;
  title?: string;
  actions?: string[];
  allowClose?: boolean;
  variant?: ToastVariant;
  onClose?: (action?: string) => void;
}

export function Toast({
  id,
  message,
  title,
  actions = [],
  allowClose = true,
  variant = 'default',
  className,
  children,
  onClose,
  ...props
}: ToastProps) {
  const hasActions = actions?.length > 0;

  return (
    <div
      {...props}
      data-slot="toast"
      data-variant={variant}
      className={cn(toastVariants({ variant }), className)}
    >
      <div data-slot="toast-content" className="flex flex-1 flex-col gap-1">
        {title && (
          <div data-slot="toast-title" className="font-medium">
            {title}
          </div>
        )}
        {message && (
          <div
            data-slot="toast-description"
            className={cn(title && variant === 'default' && 'text-muted-foreground')}
          >
            {message}
          </div>
        )}
        {children}
      </div>
      {hasActions &&
        actions.map(action => {
          return (
            <Button key={action} variant="outline" size="sm" onClick={() => onClose?.(action)}>
              {action}
            </Button>
          );
        })}
      {!hasActions && allowClose && (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Close"
          data-slot="toast-close"
          className="shrink-0 self-start text-muted-foreground hover:text-foreground"
          onClick={() => onClose?.(TOAST_CLOSE_ACTION)}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
