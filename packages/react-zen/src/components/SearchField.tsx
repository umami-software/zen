import { SearchIcon, XIcon } from 'lucide-react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onSearch' | 'children'> {
  label?: ReactNode;
  /** Debounce delay in milliseconds for `onSearch`. */
  delay?: number;
  /** Called with the new string value on every change (and on clear). */
  onValueChange?: (value: string) => void;
  /** Called with the search term, debounced by `delay`. Fires immediately on Enter and clear. */
  onSearch?: (value: string) => void;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    label,
    value,
    defaultValue,
    delay = 0,
    onChange,
    onValueChange,
    onSearch,
    onKeyDown,
    className,
    id,
    ...props
  },
  forwardedRef,
) {
  const fieldId = useFieldId(id);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Tracks whether the clear button should be visible. The value itself is owned
  // by the caller (controlled) or the DOM (uncontrolled).
  const [hasValue, setHasValue] = useState(() => Boolean(value ?? defaultValue));

  // Keep the latest handler in a ref so an inline `onSearch` does not restart the timer.
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastDispatched = useRef<string | undefined>(undefined);

  const dispatchSearch = useCallback((nextValue: string) => {
    clearTimeout(timerRef.current);
    if (lastDispatched.current === nextValue) {
      return;
    }
    lastDispatched.current = nextValue;
    onSearchRef.current?.(nextValue);
  }, []);

  // Clear any pending timer on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleValue = (nextValue: string, immediate = false) => {
    setHasValue(nextValue !== '');
    onValueChange?.(nextValue);

    clearTimeout(timerRef.current);

    if (immediate || delay === 0 || nextValue === '') {
      dispatchSearch(nextValue);
      return;
    }

    timerRef.current = setTimeout(() => dispatchSearch(nextValue), delay);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    handleValue(event.target.value);
  };

  const handleClear = () => {
    const input = inputRef.current;

    if (input && value === undefined) {
      input.value = '';
    }

    input?.focus();
    handleValue('', true);
  };

  const handleRef = (element: HTMLInputElement | null) => {
    inputRef.current = element;
    if (typeof forwardedRef === 'function') {
      forwardedRef(element);
    } else if (forwardedRef) {
      forwardedRef.current = element;
    }
  };

  const isLabelled = Boolean(label || props['aria-label'] || props['aria-labelledby']);
  const showClear = value !== undefined ? value !== '' : hasValue;

  const control = (
    <InputGroup
      role="search"
      data-slot="search-field"
      data-disabled={props.disabled ? 'true' : undefined}
      className={className}
    >
      <InputGroupInput
        {...props}
        ref={handleRef}
        id={fieldId}
        type="search"
        value={value}
        defaultValue={defaultValue}
        aria-label={isLabelled ? props['aria-label'] : 'Search'}
        className="[&::-webkit-search-cancel-button]:hidden"
        onChange={handleChange}
        onKeyDown={event => {
          onKeyDown?.(event);
          if (event.key === 'Enter') {
            handleValue(event.currentTarget.value, true);
          }
        }}
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      {showClear && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            disabled={props.disabled}
            aria-label="Clear search"
            onClick={handleClear}
          >
            <XIcon />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );

  if (!label) {
    return control;
  }

  return (
    <Field data-disabled={props.disabled ? true : undefined}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      {control}
    </Field>
  );
});
