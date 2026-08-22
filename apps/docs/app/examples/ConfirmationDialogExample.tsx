import { Button, ConfirmationDialog, DialogTrigger, Modal, Text } from '@umami/react-zen';

export function ConfirmationDialogExample() {
  return (
    <DialogTrigger overlayType="alert-dialog">
      <Button variant="danger">Delete account</Button>
      <Modal>
        <ConfirmationDialog
          title="Delete account"
          value={'abc123'}
          confirmLabel="Delete"
          isDanger={true}
        >
          <Text>This cannot be undone. All your data will be permananently deleted.</Text>
        </ConfirmationDialog>
      </Modal>
    </DialogTrigger>
  );
}
