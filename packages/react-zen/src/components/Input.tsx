import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from './lib/tailwind';
import { type InputFieldVariants, inputField } from './variants';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, InputFieldVariants {}

/**
 * Classes used to flatten a standalone `Input` / `Textarea` when it is rendered
 * inside an `InputGroup`. The group owns the border, background and focus ring.
 */
export const inputGroupControlClasses = [
  'h-auto w-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none',
  'focus-visible:border-0 focus-visible:ring-0',
  'read-only:bg-transparent disabled:bg-transparent disabled:opacity-100',
];

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => (
    <input
      data-slot="input"
      {...props}
      ref={ref}
      type={type}
      className={inputField({
        variant,
        className: cn(
          'w-full min-w-0 px-3 py-1 outline-none',
          'placeholder:text-fg-muted',
          'read-only:bg-surface-raised',
          'disabled:cursor-not-allowed',
          'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-fg',
          className,
        ),
      })}
    />
  ),
);

Input.displayName = 'Input';
