import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { type ReactNode, useState } from 'react';
import { Button } from './Button';
import { Column } from './Column';
import { Dialog, type DialogProps } from './Dialog';
import { Heading } from './Heading';
import { type OverlayTarget, useOverlayTrigger } from './OverlayTrigger';
import { Row } from './Row';
import { Text } from './Text';

export interface AlertDialogProps extends DialogProps {
  title?: ReactNode;
  description?: ReactNode;
  isDanger?: boolean;
  isConfirmDisabled?: boolean;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Called on confirm. When it returns a promise the dialog stays open until it resolves. */
  onConfirm?: () => unknown;
  onCancel?: () => void;
}

export function AlertDialog({
  title,
  description,
  isDanger,
  isConfirmDisabled,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  className,
  children,
  ...props
}: AlertDialogProps) {
  const { close } = useOverlayTrigger();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = () => {
    let result: unknown;

    try {
      result = onConfirm?.();
    } catch {
      // Keep the dialog open when the handler throws synchronously.
      return;
    }

    if (result && typeof (result as Promise<unknown>).then === 'function') {
      setIsPending(true);
      (result as Promise<unknown>).then(
        () => {
          setIsPending(false);
          close();
        },
        () => {
          // Rejected: leave the dialog open so the user can retry.
          setIsPending(false);
        },
      );
      return;
    }

    close();
  };

  return (
    <Dialog {...props} title={title} className={className}>
      {({ close: closeDialog }) => {
        return (
          <Column gap="4">
            {description && (
              <BaseAlertDialog.Description render={<Text color="muted" />}>
                {description}
              </BaseAlertDialog.Description>
            )}
            {typeof children === 'function' ? children({ close: closeDialog }) : children}
            <Row gap="3" justifyContent="end">
              <BaseAlertDialog.Close
                data-slot="alert-dialog-cancel"
                render={
                  <Button variant="outline" onPress={onCancel}>
                    {cancelLabel}
                  </Button>
                }
              />
              <Button
                data-slot="alert-dialog-action"
                variant={isDanger ? 'danger' : 'primary'}
                isDisabled={isConfirmDisabled || isPending}
                onPress={handleConfirm}
              >
                {confirmLabel}
              </Button>
            </Row>
          </Column>
        );
      }}
    </Dialog>
  );
}

(AlertDialog as typeof AlertDialog & OverlayTarget).zenOverlayType = 'alert-dialog';

/** Explicit, shadcn-style parts. */
export interface AlertDialogTitleProps extends BaseAlertDialog.Title.Props {}

export function AlertDialogTitle({ className, ...props }: AlertDialogTitleProps) {
  return (
    <BaseAlertDialog.Title
      data-slot="alert-dialog-title"
      {...props}
      render={props.render ?? <Heading size="xl" />}
      className={className as string}
    />
  );
}

export interface AlertDialogDescriptionProps extends BaseAlertDialog.Description.Props {}

export function AlertDialogDescription({ className, ...props }: AlertDialogDescriptionProps) {
  return (
    <BaseAlertDialog.Description
      data-slot="alert-dialog-description"
      {...props}
      render={props.render ?? <Text color="muted" />}
      className={className as string}
    />
  );
}

export interface AlertDialogCancelProps extends BaseAlertDialog.Close.Props {}

export function AlertDialogCancel({ render, ...props }: AlertDialogCancelProps) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-cancel"
      {...props}
      render={render ?? <Button variant="outline" />}
    />
  );
}

export interface AlertDialogActionProps extends BaseAlertDialog.Close.Props {}

export function AlertDialogAction({ render, ...props }: AlertDialogActionProps) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-action"
      {...props}
      render={render ?? <Button variant="primary" />}
    />
  );
}
