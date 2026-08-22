'use client';
import {
  Button,
  Dialog,
  DialogTrigger,
  Form,
  FormButtons,
  FormField,
  Modal,
  TextField,
} from '@umami/react-zen';

export function DialogExample() {
  return (
    <DialogTrigger>
      <Button variant="primary">Click me</Button>
      <Modal>
        <Dialog title="Sign up for newsletter">
          {({ close }) => {
            return (
              <Form>
                <FormField name="name" label="Name">
                  <TextField />
                </FormField>
                <FormField name="email" label="Email">
                  <TextField />
                </FormField>
                <FormButtons>
                  <Button onPress={close}>Cancel</Button>
                  <Button variant="primary" onPress={close}>
                    Sign up
                  </Button>
                </FormButtons>
              </Form>
            );
          }}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
}
