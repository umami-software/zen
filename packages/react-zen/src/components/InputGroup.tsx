import { forwardRef, type HTMLAttributes, type MouseEvent } from 'react';
import { Button, type ButtonProps } from './Button';
import { Input, type InputProps, inputGroupControlClasses } from './Input';
import { cn } from './lib/tailwind';
import { Textarea, type TextareaProps } from './Textarea';
import { type InputFieldVariants, inputField } from './variants';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement>, InputFieldVariants {}

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="input-group"
      role={props.role ?? 'group'}
      className={inputField({
        variant,
        className: cn(
          'group/input-group w-full min-w-0 gap-0 p-0',
          'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col',
          'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col',
          'has-[>textarea]:h-auto',
          className,
        ),
      })}
    />
  ),
);

InputGroup.displayName = 'InputGroup';

export type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

export interface InputGroupAddonProps extends HTMLAttributes<HTMLDivElement> {
  align?: InputGroupAddonAlign;
}

const addonClasses: Record<InputGroupAddonAlign, string> = {
  // Inline addons must not add vertical padding around their buttons; the
  // input's padding determines the height of a single-line control.
  'inline-start': 'order-first ps-3 py-0 has-[>button]:-ms-1.5',
  'inline-end': 'order-last pe-3 py-0 has-[>button]:-me-1.5',
  'block-start':
    'order-first w-full justify-start px-3 pt-3 pb-2 group-has-[>input]/input-group:pt-2.5',
  'block-end':
    'order-last w-full justify-start px-3 pt-2 pb-3 group-has-[>input]/input-group:pb-2.5',
};

export const InputGroupAddon = forwardRef<HTMLDivElement, InputGroupAddonProps>(
  ({ align = 'inline-start', className, onClick, ...props }, ref) => {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || (event.target as HTMLElement).closest('button')) {
        return;
      }

      event.currentTarget.parentElement
        ?.querySelector<HTMLInputElement | HTMLTextAreaElement>('[data-slot="input-group-control"]')
        ?.focus();
    };

    return (
      <div
        {...props}
        ref={ref}
        role={props.role ?? 'group'}
        data-slot="input-group-addon"
        data-align={align}
        className={cn(
          'flex h-auto shrink-0 cursor-text select-none items-center justify-center gap-2 text-sm font-medium text-fg-muted',
          "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          addonClasses[align],
          className,
        )}
        onClick={handleClick}
      />
    );
  },
);

InputGroupAddon.displayName = 'InputGroupAddon';

export type InputGroupButtonSize = 'xs' | 'sm' | 'icon-xs' | 'icon-sm';

export interface InputGroupButtonProps extends Omit<ButtonProps, 'size'> {
  size?: InputGroupButtonSize;
}

export const InputGroupButton = forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, size = 'xs', type = 'button', variant = 'quiet', ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      type={type}
      variant={variant}
      size={size}
      data-slot="input-group-button"
      className={cn(
        'shrink-0 rounded shadow-none',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
    />
  ),
);

InputGroupButton.displayName = 'InputGroupButton';

export const InputGroupText = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      data-slot="input-group-text"
      className={cn(
        'flex items-center gap-2 text-sm text-fg-muted [&_svg]:pointer-events-none [&_svg]:size-4',
        className,
      )}
    />
  ),
);

InputGroupText.displayName = 'InputGroupText';

export const InputGroupInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      data-slot="input-group-control"
      className={cn(inputGroupControlClasses, 'px-3', className)}
    />
  ),
);

InputGroupInput.displayName = 'InputGroupInput';

export const InputGroupTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      {...props}
      ref={ref}
      data-slot="input-group-control"
      className={cn(inputGroupControlClasses, 'min-h-16 resize-none p-3', className)}
    />
  ),
);

InputGroupTextarea.displayName = 'InputGroupTextarea';
