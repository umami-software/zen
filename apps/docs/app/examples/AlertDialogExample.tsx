import { AlertDialog, Button, DialogTrigger, Modal, Text } from '@umami/react-zen';

export function AlertDialogExample() {
  return (
    <DialogTrigger overlayType="alert-dialog">
      <Button variant="primary">Delete account</Button>
      <Modal>
        <AlertDialog title="Are you sure you want to delete your account?">
          <Text>This cannot be undone. All your data will be permanantly deleted.</Text>
        </AlertDialog>
      </Modal>
    </DialogTrigger>
  );
}
