'use client';

import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from '@base-ui/react/toggle';
import {
  ToggleGroup as BaseToggleGroup,
  type ToggleGroupProps as BaseToggleGroupProps,
} from '@base-ui/react/toggle-group';
import { createContext, useContext, useId } from 'react';
import { Label } from './Label';
import type { Selection } from './lib/interaction';
import { cn } from './lib/tailwind';

export interface ToggleGroupProps
  extends Omit<
    BaseToggleGroupProps<string>,
    'value' | 'defaultValue' | 'onChange' | 'onValueChange'
  > {
  label?: string;
  value?: string[];
  defaultValue?: string[];
  variant?: 'primary';
  onChange?: (value: string[]) => void;
  selectionMode?: 'single' | 'multiple';
  selectedKeys?: Iterable<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (value: Selection) => void;
}

const ToggleGroupVariantContext = createContext<ToggleGroupProps['variant']>(undefined);

export function ToggleGroup({
  label,
  value,
  defaultValue,
  variant,
  onChange,
  className,
  children,
  selectionMode = 'single',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  ...props
}: ToggleGroupProps) {
  const labelId = useId();
  const handleChange = (keys: string[]) => {
    onSelectionChange?.(new Set(keys));
    onChange?.(keys);
  };

  const group = (
    <ToggleGroupVariantContext.Provider value={variant}>
      <BaseToggleGroup
        {...props}
        aria-labelledby={label ? labelId : props['aria-labelledby']}
        value={value || (selectedKeys ? Array.from(selectedKeys) : undefined)}
        defaultValue={
          defaultValue || (defaultSelectedKeys ? Array.from(defaultSelectedKeys) : undefined)
        }
        multiple={selectionMode === 'multiple'}
        onValueChange={handleChange}
        className={cn(
          'inline-flex bg-surface-base shadow-sm border border-edge rounded overflow-hidden',
          className,
        )}
      >
        {children}
      </BaseToggleGroup>
    </ToggleGroupVariantContext.Provider>
  );

  if (label) {
    return (
      <div className="inline-flex flex-col gap-1">
        <Label id={labelId}>{label}</Label>
        {group}
      </div>
    );
  }

  return group;
}

export interface ToggleGroupItemProps extends Omit<BaseToggleProps<string>, 'disabled'> {
  id?: string;
  isDisabled?: boolean;
}

export function ToggleGroupItem({
  id,
  className,
  children,
  isDisabled,
  ...props
}: ToggleGroupItemProps) {
  const variant = useContext(ToggleGroupVariantContext);

  return (
    <BaseToggle
      {...props}
      value={props.value || id}
      disabled={isDisabled}
      className={cn(
        'text-foreground-muted bg-surface-base font-bold flex items-center justify-center p-2 cursor-pointer outline-none',
        '[&:not(:first-child)]:border-l [&:not(:first-child)]:border-edge',
        'hover:bg-interactive',
        variant === 'primary'
          ? 'data-[pressed]:text-primary-foreground data-[pressed]:bg-primary'
          : 'data-[pressed]:text-foreground-primary data-[pressed]:bg-interactive',
        'data-[disabled]:text-foreground-disabled',
        className,
      )}
    >
      {children}
    </BaseToggle>
  );
}
