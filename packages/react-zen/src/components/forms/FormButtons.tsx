import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export interface FormButtonsProps extends ComponentProps<'div'> {}

export function FormButtons({ className, ...props }: FormButtonsProps) {
  return (
    <div
      {...props}
      data-slot="form-buttons"
      className={cn('flex items-center justify-end gap-3', className)}
    />
  );
}
