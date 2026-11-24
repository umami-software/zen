import { Button, useToast } from '@umami/react-zen';

export function ToastExample() {
  const { toast } = useToast();

  return (
    <Button variant="outline" onClick={() => toast('Your message has been sent.')}>
      Show toast
    </Button>
  );
}

export function ToastTitleExample() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast('The application encountered an error.', { title: 'Oops! Something went wrong.' })
      }
    >
      Show toast
    </Button>
  );
}

export function ToastActionExample() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast('The task was deleted successfully.', {
          title: 'Task deleted',
          actions: ['Undo'],
        })
      }
    >
      Show toast
    </Button>
  );
}

export function ToastVariantsExample() {
  const { toast } = useToast();

  return (
    <>
      <Button
        variant="outline"
        onClick={() => toast('Your message was sent.', { variant: 'success' })}
      >
        Success toast
      </Button>
      <Button
        variant="outline"
        onClick={() => toast('Something went wrong.', { variant: 'destructive' })}
      >
        Destructive toast
      </Button>
    </>
  );
}
