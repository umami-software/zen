import { Field as BaseField } from '@base-ui/react/field';
import {
  type FieldsetHTMLAttributes,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { labelClasses } from './Label';
import { cn } from './lib/tailwind';
import { Separator } from './Separator';

export type FieldOrientation = 'vertical' | 'horizontal' | 'responsive';

const fieldOrientationClasses: Record<FieldOrientation, string> = {
  vertical: 'flex-col gap-2 *:w-full [&>.sr-only]:w-auto',
  horizontal:
    'flex-row items-center gap-2 has-[>[data-slot=field-content]]:items-start [&>[data-slot=field-label]]:flex-auto',
  responsive:
    'flex-col gap-2 *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:gap-2 @md/field-group:*:w-auto',
};

export interface FieldProps extends BaseField.Root.Props {
  orientation?: FieldOrientation;
}

export const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ orientation = 'vertical', className, ...props }, ref) => (
    <BaseField.Root
      {...props}
      ref={ref}
      role={(props as HTMLAttributes<HTMLDivElement>).role ?? 'group'}
      data-slot="field"
      data-orientation={orientation}
      className={cn('group/field flex w-full', fieldOrientationClasses[orientation], className)}
    />
  ),
);

Field.displayName = 'Field';

export interface FieldLabelProps extends BaseField.Label.Props {}

export const FieldLabel = forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    <BaseField.Label
      {...props}
      ref={ref as never}
      data-slot="field-label"
      className={cn(
        labelClasses,
        'group/field-label peer/field-label flex w-fit',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col',
        className,
      )}
    />
  ),
);

FieldLabel.displayName = 'FieldLabel';

export interface FieldControlProps extends BaseField.Control.Props {}

export const FieldControl = forwardRef<HTMLInputElement, FieldControlProps>(
  ({ className, ...props }, ref) => (
    <BaseField.Control
      {...props}
      ref={ref as never}
      data-slot="field-control"
      className={className}
    />
  ),
);

FieldControl.displayName = 'FieldControl';

export interface FieldDescriptionProps extends BaseField.Description.Props {}

export const FieldDescription = forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, ...props }, ref) => (
    <BaseField.Description
      {...props}
      ref={ref}
      data-slot="field-description"
      className={cn(
        'text-sm font-normal leading-normal text-fg-muted',
        '[&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
    />
  ),
);

FieldDescription.displayName = 'FieldDescription';

export interface FieldErrorProps extends BaseField.Error.Props {}

export const FieldError = forwardRef<HTMLDivElement, FieldErrorProps>(
  ({ className, children, match, ...props }, ref) => {
    // When used with an external validation library (react-hook-form) the message
    // is passed directly as children, so render whenever there is something to show.
    if (match === undefined && !children) {
      return null;
    }

    return (
      <BaseField.Error
        {...props}
        ref={ref}
        match={match ?? true}
        role="alert"
        data-slot="field-error"
        className={cn('text-sm font-normal text-status-error', className)}
      >
        {children}
      </BaseField.Error>
    );
  },
);

FieldError.displayName = 'FieldError';

export const FieldContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="field-content"
      className={cn('group/field-content flex flex-1 flex-col gap-1 leading-snug', className)}
    />
  ),
);

FieldContent.displayName = 'FieldContent';

export const FieldTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="field-title"
      className={cn(
        'flex w-fit items-center gap-2 text-sm font-medium leading-snug select-none',
        className,
      )}
    />
  ),
);

FieldTitle.displayName = 'FieldTitle';

export const FieldGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="field-group"
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-4',
        className,
      )}
    />
  ),
);

FieldGroup.displayName = 'FieldGroup';

export const FieldSet = forwardRef<
  HTMLFieldSetElement,
  FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, ...props }, ref) => (
  <fieldset
    {...props}
    ref={ref}
    data-slot="field-set"
    className={cn('flex w-full min-w-0 flex-col gap-3', className)}
  />
));

FieldSet.displayName = 'FieldSet';

export interface FieldLegendProps extends HTMLAttributes<HTMLLegendElement> {
  variant?: 'legend' | 'label';
}

export const FieldLegend = forwardRef<HTMLLegendElement, FieldLegendProps>(
  ({ className, variant = 'legend', ...props }, ref) => (
    <legend
      {...props}
      ref={ref}
      data-slot="field-legend"
      data-variant={variant}
      className={cn('mb-2 font-medium', variant === 'legend' ? 'text-base' : 'text-sm', className)}
    />
  ),
);

FieldLegend.displayName = 'FieldLegend';

export interface FieldSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const FieldSeparator = forwardRef<HTMLDivElement, FieldSeparatorProps>(
  ({ className, children, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-slot="field-separator"
      data-content={!!children}
      className={cn('relative -my-2 h-5 text-sm', className)}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-surface px-2 text-fg-muted"
        >
          {children}
        </span>
      )}
    </div>
  ),
);

FieldSeparator.displayName = 'FieldSeparator';
