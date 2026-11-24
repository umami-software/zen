import { CheckIcon, CopyIcon } from 'lucide-react';
import type {
  ChangeEvent,
  InputHTMLAttributes,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
} from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { cn } from '@/lib/utils';

type FieldElement = HTMLInputElement | HTMLTextAreaElement;

type NativeFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'children'
>;

export interface TextFieldProps extends NativeFieldProps {
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  allowCopy?: boolean;
  asTextArea?: boolean;
  resize?: 'vertical' | 'horizontal' | 'both' | 'none';
  variant?: 'default' | 'quiet';
  /** Native change event from the underlying `<input>` / `<textarea>`. */
  onChange?: (event: ChangeEvent<FieldElement>) => void;
  /** Called with the new string value. */
  onValueChange?: (value: string) => void;
}

const resizeClasses = {
  vertical: 'resize-y',
  horizontal: 'resize-x',
  both: 'resize',
  none: 'resize-none',
};

const COPY_TIMEOUT = 2000;

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
    allowCopy,
    asTextArea,
    resize,
    variant = 'default',
    onChange,
    onValueChange,
    className,
    id,
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
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const handleRef = (element: FieldElement | null) => {
    innerRef.current = element;
    setRef(forwardedRef, element);
  };

  const handleChange = (event: ChangeEvent<FieldElement>) => {
    if (allowCopy) {
      setHasValue(event.target.value !== '');
    }
    onChange?.(event);
    onValueChange?.(event.target.value);
  };

  const handleCopy = async () => {
    const text = innerRef.current?.value;

    if (!text) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), COPY_TIMEOUT);
  };

  const invalid = props['aria-invalid'] ?? (error ? true : undefined);
  const isInvalid = invalid === true || invalid === 'true';
  const describedBy =
    [props['aria-describedby'], description && descriptionId, error && errorId]
      .filter(Boolean)
      .join(' ') || undefined;

  const isQuiet = variant === 'quiet';

  const controlProps = {
    ...props,
    id: fieldId,
    'aria-invalid': invalid,
    'aria-describedby': describedBy,
    onChange: handleChange,
  };

  // Controlled fields keep the copy button in sync without any local mirror.
  const copyDisabled = props.value !== undefined ? !props.value : !hasValue;

  const control = (
    <InputGroup
      data-slot="text-field"
      data-disabled={props.disabled ? 'true' : undefined}
      className={cn(
        isQuiet &&
          'h-auto rounded-none border-transparent shadow-none dark:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-transparent has-[[data-slot=input-group-control]:focus-visible]:border-b-border has-[[data-slot=input-group-control]:focus-visible]:ring-0',
        className,
      )}
    >
      {asTextArea ? (
        <InputGroupTextarea
          {...(controlProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          ref={handleRef as Ref<HTMLTextAreaElement>}
          className={cn(
            resize && resizeClasses[resize],
            allowCopy && 'pr-10',
            isQuiet && 'text-[length:inherit] md:text-[length:inherit]',
          )}
        />
      ) : (
        <InputGroupInput
          {...(controlProps as InputHTMLAttributes<HTMLInputElement>)}
          ref={handleRef as Ref<HTMLInputElement>}
          className={cn(isQuiet && 'h-auto text-[length:inherit] md:text-[length:inherit]')}
        />
      )}
      {allowCopy && (
        <InputGroupAddon
          align="inline-end"
          className={cn(asTextArea && 'absolute top-1 right-1 p-0 has-[>button]:mr-0')}
        >
          <InputGroupButton
            size="icon-xs"
            aria-label="Copy"
            data-copied={copied || undefined}
            disabled={copyDisabled || props.disabled}
            onClick={handleCopy}
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );

  if (!label && !description && !error) {
    return control;
  }

  return (
    <Field data-invalid={isInvalid || undefined} data-disabled={props.disabled ? true : undefined}>
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      {control}
      {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </Field>
  );
});
