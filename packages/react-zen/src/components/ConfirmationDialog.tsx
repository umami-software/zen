import type { AlertDialog as AlertDialogPrimitive } from '@base-ui/react/alert-dialog';
import type { VariantProps } from 'class-variance-authority';
import { type ReactElement, type ReactNode, useId, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button, type buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ConfirmationDialogProps
  extends Omit<AlertDialogPrimitive.Root.Props, 'children' | 'actionsRef'> {
  /** Text the user must type before the confirm button is enabled. */
  value: string;
  /** Element that opens the dialog, e.g. `<Button variant="destructive">Delete</Button>`. */
  trigger?: ReactElement;
  title?: ReactNode;
  description?: ReactNode;
  /** Prompt shown above the confirmation input. */
  confirmMessage?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Button variant of the confirm button. Defaults to `destructive`. */
  variant?: VariantProps<typeof buttonVariants>['variant'];
  /** Called on confirm. When it returns a promise the dialog stays open until it resolves. */
  onConfirm?: () => unknown;
  onCancel?: () => void;
  /** Extra content rendered between the description and the confirmation input. */
  children?: ReactNode;
  className?: string;
}

export function ConfirmationDialog({
  value,
  trigger,
  title,
  description,
  confirmMessage = 'Type the following value to confirm',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  onConfirm,
  onCancel,
  onOpenChange,
  className,
  children,
  ...props
}: ConfirmationDialogProps) {
  const actionsRef = useRef<AlertDialogPrimitive.Root.Actions>(null);
  const [input, setInput] = useState('');
  const [pending, setPending] = useState(false);
  const inputId = useId();

  const canConfirm = input === value && !pending;

  const handleOpenChange: ConfirmationDialogProps['onOpenChange'] = (open, details) => {
    if (!open) {
      setInput('');
    }
    onOpenChange?.(open, details);
  };

  const handleConfirm = () => {
    let result: unknown;

    try {
      result = onConfirm?.();
    } catch {
      // Keep the dialog open when the handler throws synchronously.
      return;
    }

    if (result && typeof (result as Promise<unknown>).then === 'function') {
      setPending(true);
      (result as Promise<unknown>).then(
        () => {
          setPending(false);
          actionsRef.current?.close();
        },
        () => {
          // Rejected: leave the dialog open so the user can retry.
          setPending(false);
        },
      );
      return;
    }

    actionsRef.current?.close();
  };

  return (
    <AlertDialog {...props} actionsRef={actionsRef} onOpenChange={handleOpenChange}>
      {trigger && <AlertDialogTrigger render={trigger} />}
      <AlertDialogContent data-slot="confirmation-dialog" className={cn(className)}>
        {(title || description) && (
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
            {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
          </AlertDialogHeader>
        )}
        {children}
        <div className="grid gap-2">
          <label htmlFor={inputId} className="text-sm">
            {confirmMessage}:
          </label>
          <code className="rounded-md bg-muted px-3 py-2 font-mono text-sm">{value}</code>
          <Input
            id={inputId}
            autoFocus
            autoComplete="off"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
          <Button variant={variant} disabled={!canConfirm} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
