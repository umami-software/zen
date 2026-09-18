import { Field as BaseField } from '@base-ui/react/field';
import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from 'react';
import { forwardRef, useRef, useState } from 'react';
import { CopyButton } from './CopyButton';
import { FieldDescription, FieldError } from './Field';
import { useFieldId } from './hooks/useFieldId';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from './InputGroup';
import { Label } from './Label';
import { cn } from './lib/tailwind';

type NativeFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
>;

export interface TextFieldProps extends NativeFieldProps {
  label?: string;
  description?: ReactNode;
  error?: ReactNode;
  placeholder?: string;
  allowCopy?: boolean;
  asTextArea?: boolean;
  resize?: 'vertical' | 'horizontal' | 'both' | 'none';
  variant?: 'quiet' | 'none';
  isReadOnly?: boolean;
  isDisabled?: boolean;
  onChange?: (value: any) => void;
}

const resizeClasses = {
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
  none: 'resize-none',
};

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref && typeof ref === 'object') {
    (ref as { current: T | null }).current = value;
  }
}

export const TextField = forwardRef<FieldElement, TextFieldProps>(function TextField(
  {
    label,
    description,
    error,
    placeholder,
    allowCopy,
    asTextArea,
    resize,
    variant,
    onChange,
    isReadOnly,
    isDisabled,
    readOnly,
    disabled,
    className,
    id,
    children: _children,
    ...props
  },
  forwardedRef,
) {
  const fieldId = useFieldId(id);
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;
  const innerRef = useRef<FieldElement | null>(null);
  // Only tracks emptiness so the copy button can be enabled/disabled. The value
  // itself stays owned by the caller (controlled) or the DOM (uncontrolled).
  const [hasValue, setHasValue] = useState(() => {
    const initial = props.value ?? props.defaultValue;
    return initial !== undefined && initial !== null && initial !== '';
  });

  const handleRef = (element: FieldElement | null) => {
    innerRef.current = element;
    setRef(forwardedRef, element);
  };

  const handleChange = (event: ChangeEvent<FieldElement>) => {
    if (allowCopy) {
      setHasValue(event.target.value !== '');
    }
    onChange?.(event.target.value);
  };

  const isInvalid = props['aria-invalid'] ?? (error ? true : undefined);
  const describedBy =
    [props['aria-describedby'], description && descriptionId, error && errorId]
      .filter(Boolean)
      .join(' ') || undefined;

  const controlProps = {
    ...props,
    id: fieldId,
    placeholder,
    readOnly: isReadOnly ?? readOnly,
    disabled: isDisabled ?? disabled,
    'aria-invalid': isInvalid,
    'aria-describedby': describedBy,
    className: cn(allowCopy && asTextArea && 'pe-12', resize && resizeClasses[resize]),
    onChange: handleChange,
  };

  // Controlled fields keep the copy button in sync without any local mirror.
  const copyDisabled = props.value !== undefined ? !props.value : !hasValue;

  const input = (
    <InputGroup
      variant={variant === 'quiet' ? 'quiet' : 'default'}
      className={cn(variant === 'quiet' && 'text-[length:inherit]', className)}
    >
      {asTextArea ? (
        <InputGroupTextarea {...controlProps} ref={handleRef as Ref<HTMLTextAreaElement>} />
      ) : (
        <InputGroupInput {...controlProps} ref={handleRef as Ref<HTMLInputElement>} />
      )}
      {allowCopy && (
        <InputGroupAddon
          align="inline-end"
          className={cn(asTextArea && 'absolute end-0 top-1 z-10')}
        >
          <CopyButton
            value={() => innerRef.current?.value ?? ''}
            aria-disabled={copyDisabled}
            className={cn('text-fg-muted hover:text-fg', copyDisabled && 'text-fg-disabled')}
          />
        </InputGroupAddon>
      )}
    </InputGroup>
  );

  if (!label && !description && !error) {
    return input;
  }

  return (
    <BaseField.Root data-slot="text-field" className="flex flex-col gap-2">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      {input}
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </BaseField.Root>
  );
});
