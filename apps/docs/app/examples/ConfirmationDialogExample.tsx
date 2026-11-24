import { Button, ConfirmationDialog, Text } from '@umami/react-zen';

export function ConfirmationDialogExample() {
  return (
    <ConfirmationDialog
      trigger={<Button variant="destructive">Delete account</Button>}
      title="Delete account"
      value="abc123"
      confirmLabel="Delete"
    >
      <Text>This cannot be undone. All your data will be permanently deleted.</Text>
    </ConfirmationDialog>
  );
}
