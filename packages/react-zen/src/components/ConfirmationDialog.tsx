import { type ChangeEvent, type ReactNode, useState } from 'react';
import { AlertDialog, type AlertDialogProps } from './AlertDialog';
import { Box } from './Box';
import { cn } from './lib/tailwind';
import { Text } from './Text';
import { TextField } from './TextField';

export interface ConfirmationDialogProps extends AlertDialogProps {
  value: string;
  confirmMessage?: ReactNode;
}

export function ConfirmationDialog({
  value,
  confirmMessage,
  className,
  children,
  ...props
}: ConfirmationDialogProps) {
  const [canSave, setCanSave] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCanSave(e.target.value === value);
  };

  return (
    <AlertDialog {...props} className={cn(className)} isConfirmDisabled={!canSave}>
      {({ close }) => {
        return (
          <>
            {typeof children === 'function' ? children({ close }) : children}
            <Text>{confirmMessage || 'Type the following value to confirm'}:</Text>
            <Box
              paddingX="3"
              paddingY="2"
              marginY="2"
              borderRadius="md"
              className="font-mono text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] bg-surface-sunken"
            >
              {value}
            </Box>
            <TextField autoFocus={true} aria-label="Confirmation" onChange={handleChange} />
          </>
        );
      }}
    </AlertDialog>
  );
}
