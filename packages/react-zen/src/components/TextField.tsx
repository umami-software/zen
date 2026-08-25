import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';
import { CopyButton } from './CopyButton';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from './InputGroup';
import { Label } from './Label';
import { cn } from './lib/tailwind';

type NativeFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'readOnly' | 'disabled'
>;

export interface TextFieldProps extends NativeFieldProps {
  label?: string;
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

export function TextField({
  value,
  defaultValue,
  label,
  placeholder,
  allowCopy,
  asTextArea,
  resize,
  variant,
  onChange,
  isReadOnly,
  isDisabled,
  className,
  children: _children,
  ...props
}: TextFieldProps) {
  const [inputValue, setInputValue] = useState(defaultValue ?? value ?? '');
  const wasControlled = useRef(value !== undefined);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    onChange?.(nextValue);
  };

  useEffect(() => {
    if (value !== undefined) {
      wasControlled.current = true;
      setInputValue(value);
    } else if (wasControlled.current) {
      // Value was cleared externally (e.g. form reset)
      setInputValue(defaultValue ?? '');
    }
  }, [value, defaultValue]);

  const inputClasses = cn(allowCopy && asTextArea && 'pe-12', resize && resizeClasses[resize]);

  const input = (
    <>
      <InputGroup
        variant={variant === 'quiet' ? 'quiet' : 'default'}
        className={cn(
          isReadOnly && 'focus-within:border-edge',
          isDisabled && 'text-foreground-disabled',
          variant === 'quiet' && 'text-[length:inherit]',
          className,
        )}
      >
        {asTextArea ? (
          <InputGroupTextarea
            {...props}
            placeholder={placeholder}
            value={inputValue}
            readOnly={isReadOnly}
            disabled={isDisabled}
            className={inputClasses}
            onChange={handleChange}
          />
        ) : (
          <InputGroupInput
            {...props}
            placeholder={placeholder}
            value={inputValue}
            readOnly={isReadOnly}
            disabled={isDisabled}
            className={inputClasses}
            onChange={handleChange}
          />
        )}
        {allowCopy && (
          <InputGroupAddon
            align="inline-end"
            className={cn(asTextArea && 'absolute end-0 top-1 z-10')}
          >
            <CopyButton
              value={String(inputValue)}
              aria-disabled={!inputValue}
              className={cn(
                'text-foreground-muted hover:text-foreground-primary',
                !inputValue && 'text-foreground-disabled',
              )}
            />
          </InputGroupAddon>
        )}
      </InputGroup>
    </>
  );

  if (label) {
    return (
      <div className="flex flex-col gap-1">
        <Label>{label}</Label>
        {input}
      </div>
    );
  }

  return input;
}
