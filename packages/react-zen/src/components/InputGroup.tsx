import {
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MouseEvent,
  type TextareaHTMLAttributes,
} from 'react';
import { Button, type ButtonProps } from './Button';
import { cn } from './lib/tailwind';
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
  'inline-start': 'order-first ps-3',
  'inline-end': 'order-last pe-3',
  'block-start': 'order-first w-full justify-start px-3 pt-3',
  'block-end': 'order-last w-full justify-start px-3 pb-3',
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
          'flex h-auto shrink-0 cursor-text items-center justify-center gap-2 py-2 text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)] text-foreground-muted',
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

const buttonSizeClasses: Record<InputGroupButtonSize, string> = {
  xs: 'h-6 gap-1 rounded px-1.5 py-0 text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
  sm: 'h-8 gap-2 rounded px-2 py-0 text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)]',
  'icon-xs': 'size-6 rounded p-0',
  'icon-sm': 'size-8 rounded p-0',
};

export const InputGroupButton = forwardRef<HTMLButtonElement, InputGroupButtonProps>(
  ({ className, size = 'xs', type = 'button', variant = 'quiet', ...props }, ref) => (
    <Button
      {...props}
      ref={ref}
      type={type}
      variant={variant}
      size="xs"
      data-size={size}
      className={cn(
        'shrink-0 shadow-none',
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        buttonSizeClasses[size],
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
        'flex items-center gap-2 text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)] text-foreground-muted [&_svg]:pointer-events-none [&_svg]:size-4',
        className,
      )}
    />
  ),
);

InputGroupText.displayName = 'InputGroupText';

export const InputGroupInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      data-slot="input-group-control"
      className={cn(
        'min-w-0 flex-1 bg-transparent px-3 py-2 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed',
        className,
      )}
    />
  ),
);

InputGroupInput.displayName = 'InputGroupInput';

export const InputGroupTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    {...props}
    ref={ref}
    data-slot="input-group-control"
    className={cn(
      'min-w-0 w-full flex-1 bg-transparent p-3 text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] outline-none placeholder:text-foreground-muted disabled:cursor-not-allowed',
      className,
    )}
  />
));

InputGroupTextarea.displayName = 'InputGroupTextarea';
