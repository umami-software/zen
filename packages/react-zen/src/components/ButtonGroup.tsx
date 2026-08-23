import type { HTMLAttributes, ReactNode } from 'react';
import type { RenderProp } from './lib/render';
import { resolveRender } from './lib/render';
import { cn } from './lib/tailwind';
import { Separator, type SeparatorProps } from './Separator';

export type ButtonGroupOrientation = 'horizontal' | 'vertical';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation;
}

export function ButtonGroup({ className, orientation = 'horizontal', ...props }: ButtonGroupProps) {
  return (
    <div
      {...props}
      role={props.role ?? 'group'}
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(
        'flex w-fit items-stretch',
        'has-[>[data-slot=button-group]]:gap-2',
        '[&>[data-slot]]:focus-visible:relative [&>[data-slot]]:focus-visible:z-10',
        '[&>input]:min-w-0 [&>input]:flex-1',
        orientation === 'horizontal'
          ? [
              '[&>[data-slot]]:rounded-e-none',
              '[&>[data-slot]~[data-slot]]:rounded-s-none',
              '[&>[data-slot]~[data-slot]]:border-s-0',
            ]
          : [
              'flex-col',
              '[&>[data-slot]]:rounded-b-none',
              '[&>[data-slot]~[data-slot]]:rounded-t-none',
              '[&>[data-slot]~[data-slot]]:border-t-0',
            ],
        className,
      )}
    />
  );
}

export interface ButtonGroupTextProps extends HTMLAttributes<HTMLDivElement> {
  render?: RenderProp<ButtonGroupTextRenderProps>;
}

export interface ButtonGroupTextRenderProps {
  className: string;
  children?: ReactNode;
  'data-slot': 'button-group-text';
  [key: string]: unknown;
}

export function ButtonGroupText({ className, render, children, ...props }: ButtonGroupTextProps) {
  const classes = cn(
    'flex items-center gap-2 rounded border border-edge bg-surface-raised px-4 text-[length:var(--zen-font-size-sm)]/[var(--zen-line-height-sm)] font-medium shadow-sm',
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none",
    className,
  );
  const renderProps: ButtonGroupTextRenderProps = {
    ...props,
    className: classes,
    children,
    'data-slot': 'button-group-text',
  };

  return resolveRender(
    render,
    renderProps,
    <div {...props} data-slot="button-group-text" className={classes}>
      {children}
    </div>,
  );
}

export interface ButtonGroupSeparatorProps extends SeparatorProps {}

export function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: ButtonGroupSeparatorProps) {
  return (
    <Separator
      {...props}
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'relative self-stretch',
        'data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto',
        'data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto',
        className,
      )}
    />
  );
}
