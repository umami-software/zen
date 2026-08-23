import type { InputHTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Search, X } from '@/components/icons';
import { useDebounce } from './hooks/useDebounce';
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

export function SearchField({
  label,
  placeholder,
  value,
  defaultValue = '',
  delay = 0,
  onChange,
  onSearch,
  className,
  ...props
}: SearchFieldProps) {
  const [search, setSearch] = useState(String(value ?? defaultValue));
  const wasControlled = useRef(value !== undefined);
  const searchValue = useDebounce(search, delay);

  const handleChange = (nextValue: string) => {
    setSearch(nextValue);
    if (delay === 0 || nextValue === '') {
      onSearch?.(nextValue);
    }
    onChange?.(nextValue);
  };

  useEffect(() => {
    if (value !== undefined) {
      wasControlled.current = true;
      setSearch(String(value));
    } else if (wasControlled.current) {
      // Value was cleared externally (e.g. form reset)
      setSearch(String(defaultValue));
    }
  }, [value, defaultValue]);

  useEffect(() => {
    if (delay > 0) {
      onSearch?.(searchValue);
    }
  }, [searchValue, delay, onSearch]);

  const input = (
    <InputGroup role="search" className={className}>
      <InputGroupInput
        aria-label="Search"
        {...props}
        type="search"
        placeholder={placeholder}
        value={search}
        className="[&::-webkit-search-cancel-button]:hidden"
        onChange={event => handleChange(event.target.value)}
        onKeyDown={event => {
          props.onKeyDown?.(event);
          if (event.key === 'Enter') {
            onSearch?.(search);
          }
        }}
      />
      <InputGroupAddon align="inline-start">
        <Icon color="muted">
          <Search />
        </Icon>
      </InputGroupAddon>
      {search && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            isDisabled={props.disabled}
            aria-label="Clear search"
            className="text-foreground-muted"
            onClick={() => handleChange('')}
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
      <div className="flex flex-col gap-1">
        <Label htmlFor={props.id}>{label}</Label>
        {input}
      </div>
    );
  }

  return input;
}
