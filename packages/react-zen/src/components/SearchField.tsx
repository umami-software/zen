import type { ChangeEvent, InputHTMLAttributes, Ref } from 'react';
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Search, X } from '@/components/icons';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './InputGroup';
import { Label } from './Label';

export interface SearchFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSearch'> {
  label?: string;
  delay?: number;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField(
  {
    label,
    placeholder,
    value,
    defaultValue,
    delay = 0,
    onChange,
    onSearch,
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
    onChange?.(nextValue);

    clearTimeout(timerRef.current);

    if (immediate || delay === 0 || nextValue === '') {
      dispatchSearch(nextValue);
      return;
    }

    timerRef.current = setTimeout(() => dispatchSearch(nextValue), delay);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue(event.target.value);
  };

  const handleClear = () => {
    const input = inputRef.current;

    if (input && value === undefined) {
      input.value = '';
      input.focus();
    }

    handleValue('', true);
  };

  const handleRef = (element: HTMLInputElement | null) => {
    inputRef.current = element;
    if (typeof forwardedRef === 'function') {
      forwardedRef(element);
    } else if (forwardedRef) {
      (forwardedRef as { current: HTMLInputElement | null }).current = element;
    }
  };

  const isLabelled = Boolean(label || props['aria-label'] || props['aria-labelledby']);
  const showClear = value !== undefined ? value !== '' : hasValue;

  const input = (
    <InputGroup role="search" className={className}>
      <InputGroupInput
        {...props}
        ref={handleRef as Ref<HTMLInputElement>}
        id={fieldId}
        type="search"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        aria-label={isLabelled ? props['aria-label'] : 'Search'}
        className="[&::-webkit-search-cancel-button]:hidden"
        onChange={handleChange}
        onKeyDown={event => {
          props.onKeyDown?.(event);
          if (event.key === 'Enter') {
            handleValue(event.currentTarget.value, true);
          }
        }}
      />
      <InputGroupAddon align="inline-start">
        <Icon color="muted">
          <Search />
        </Icon>
      </InputGroupAddon>
      {showClear && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            isDisabled={props.disabled}
            aria-label="Clear search"
            className="text-fg-muted"
            onClick={handleClear}
          >
            <Icon size="sm">
              <X />
            </Icon>
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );

  if (label) {
    return (
      <div data-slot="search-field" className="flex flex-col gap-1">
        <Label htmlFor={fieldId}>{label}</Label>
        {input}
      </div>
    );
  }

  return input;
});
