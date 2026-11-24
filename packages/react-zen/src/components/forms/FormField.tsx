import {
  type ComponentProps,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldValues,
  type RegisterOptions,
  type UseFormReturn,
  useController,
  useFormContext,
} from 'react-hook-form';
import { useFieldId } from '@/components/hooks/useFieldId';
import { PasswordField } from '@/components/PasswordField';
import { SearchField } from '@/components/SearchField';
import { TextField } from '@/components/TextField';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroupInput, InputGroupTextarea } from '@/components/ui/input-group';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';

export interface FormFieldRenderProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  context: UseFormReturn;
  /** Props that connect the control to the label, description and error. */
  controlProps: {
    id: string;
    'aria-invalid': true | undefined;
    'aria-describedby': string | undefined;
  };
}

export interface FormFieldProps extends Omit<ComponentProps<typeof Field>, 'children'> {
  name: string;
  label?: ReactNode;
  description?: ReactNode;
  rules?: RegisterOptions<FieldValues, string>;
  /**
   * A single control element, which is bound to the field automatically, or a render
   * function for full control over the binding.
   */
  children: ReactElement | ((props: FormFieldRenderProps) => ReactNode);
}

/**
 * How a child control receives the field's value and reports changes:
 * - `checked`: boolean `checked` + `onCheckedChange` (Checkbox, Switch)
 * - `pressed`: boolean `pressed` + `onPressedChange` (Toggle)
 * - `event`: string `value` + native `onChange` event (input, textarea, Input, Textarea)
 * - `text`: string `value` + `onValueChange(value)` (TextField, PasswordField, SearchField)
 * - `value`: `value` + `onValueChange(value)` (everything else: Select, RadioGroup,
 *   Slider, ToggleGroup, Combobox, NumberField, DatePicker, List, CheckboxGroup, ...)
 */
type Binding = 'checked' | 'pressed' | 'event' | 'text' | 'value';

const bindings = new Map<unknown, Binding>([
  [Checkbox, 'checked'],
  [Switch, 'checked'],
  [Toggle, 'pressed'],
  [Input, 'event'],
  [Textarea, 'event'],
  [InputGroupInput, 'event'],
  [InputGroupTextarea, 'event'],
  [TextField, 'text'],
  [PasswordField, 'text'],
  [SearchField, 'text'],
]);

function getBinding(type: unknown): Binding {
  if (typeof type === 'string') {
    return 'event';
  }
  return bindings.get(type) ?? 'value';
}

function bindField(
  binding: Binding,
  { value, onChange, onBlur, name, ref, disabled }: ControllerRenderProps<FieldValues, string>,
) {
  const common: Record<string, unknown> = { name, onBlur, ref };

  if (disabled !== undefined) {
    common.disabled = disabled;
  }

  switch (binding) {
    case 'checked':
      return { ...common, checked: !!value, onCheckedChange: onChange };
    case 'pressed':
      return { ...common, pressed: !!value, onPressedChange: onChange };
    case 'event':
      return { ...common, value: value ?? '', onChange };
    case 'text':
      return { ...common, value: value ?? '', onValueChange: onChange };
    default:
      return { ...common, value, onValueChange: onChange };
  }
}

export function FormField({
  id,
  name,
  label,
  description,
  rules,
  orientation = 'vertical',
  children,
  ...props
}: FormFieldProps) {
  const fieldId = useFieldId(id);
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const context = useFormContext();
  const { field, fieldState } = useController({ name, control: context.control, rules });
  const { invalid, error } = fieldState;

  const controlProps = {
    id: fieldId,
    'aria-invalid': invalid || undefined,
    'aria-describedby':
      [description && descriptionId, invalid && errorId].filter(Boolean).join(' ') || undefined,
  } as const;

  let control: ReactNode;

  if (typeof children === 'function') {
    control = children({ field, fieldState, context, controlProps });
  } else if (isValidElement<Record<string, unknown>>(children)) {
    const ownDescribedBy = children.props['aria-describedby'];

    control = cloneElement(children, {
      ...bindField(getBinding(children.type), field),
      ...controlProps,
      'aria-describedby':
        [ownDescribedBy, controlProps['aria-describedby']].filter(Boolean).join(' ') || undefined,
    });
  } else {
    control = children;
  }

  const labelNode = label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>;
  const descriptionNode = description && (
    <FieldDescription id={descriptionId}>{description}</FieldDescription>
  );
  const errorNode = invalid && <FieldError id={errorId}>{error?.message}</FieldError>;

  return (
    <Field
      {...props}
      orientation={orientation}
      data-invalid={invalid || undefined}
      data-disabled={field.disabled || undefined}
    >
      {orientation === 'horizontal' ? (
        <>
          {control}
          {(labelNode || descriptionNode || errorNode) && (
            <FieldContent>
              {labelNode}
              {descriptionNode}
              {errorNode}
            </FieldContent>
          )}
        </>
      ) : (
        <>
          {labelNode}
          {control}
          {descriptionNode}
          {errorNode}
        </>
      )}
    </Field>
  );
}
