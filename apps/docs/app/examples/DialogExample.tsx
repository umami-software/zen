'use client';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Field,
  FieldGroup,
  FieldLabel,
  Input,
} from '@umami/react-zen';
import { type FormEvent, useState } from 'react';

export function DialogExample() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Save the subscription, then close the dialog.
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Sign up</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>Sign up for our newsletter</DialogTitle>
            <DialogDescription>Get product updates once a month.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newsletter-name">Name</FieldLabel>
              <Input id="newsletter-name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="newsletter-email">Email</FieldLabel>
              <Input id="newsletter-email" name="email" type="email" required />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button type="submit">Sign up</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
