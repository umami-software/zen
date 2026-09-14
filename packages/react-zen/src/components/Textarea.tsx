import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from './lib/tailwind';
import { type InputFieldVariants, inputField } from './variants';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    InputFieldVariants {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, ...props }, ref) => (
    <textarea
      data-slot="textarea"
      {...props}
      ref={ref}
      className={inputField({
        variant,
        className: cn(
          'field-sizing-content block h-auto min-h-16 w-full min-w-0 px-3 py-2 outline-none',
          'placeholder:text-fg-muted',
          'read-only:bg-surface-raised',
          'disabled:cursor-not-allowed',
          className,
        ),
      })}
    />
  ),
);

Textarea.displayName = 'Textarea';
