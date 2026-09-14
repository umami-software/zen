import { Toggle as BaseToggle, type ToggleProps as BaseToggleProps } from '@base-ui/react/toggle';
import {
  ToggleGroup as BaseToggleGroup,
  type ToggleGroupProps as BaseToggleGroupProps,
} from '@base-ui/react/toggle-group';
import { createContext, useContext, useId } from 'react';
import { Label } from './Label';
import type { Selection } from './lib/interaction';
import { cn } from './lib/tailwind';
import { type ToggleVariants, toggleVariants } from './Toggle';

export interface ToggleGroupProps
  extends Omit<
      BaseToggleGroupProps<string>,
      'value' | 'defaultValue' | 'onChange' | 'onValueChange'
    >,
    ToggleVariants {
  label?: string;
  value?: string[];
  defaultValue?: string[];
  /** Gap between items, in Tailwind spacing units. `0` renders a joined group. */
  spacing?: number;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string[]) => void;
  selectionMode?: 'single' | 'multiple';
  selectedKeys?: Iterable<string>;
  defaultSelectedKeys?: Iterable<string>;
  onSelectionChange?: (value: Selection) => void;
}

interface ToggleGroupContextValue extends ToggleVariants {
  spacing?: number;
  orientation?: 'horizontal' | 'vertical';
}

const ToggleGroupContext = createContext<ToggleGroupContextValue>({});

export function ToggleGroup({
  label,
  value,
  defaultValue,
  variant,
  size,
  spacing = 0,
  orientation = 'horizontal',
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

  if (process.env.NODE_ENV !== 'production' && value !== undefined && selectedKeys !== undefined) {
    console.warn(
      '[ToggleGroup] `value` and `selectedKeys` were both provided. `value` takes precedence; `selectedKeys` is a deprecated alias.',
    );
  }

  const handleChange = (keys: string[]) => {
    onSelectionChange?.(new Set(keys));
    onChange?.(keys);
  };

  const group = (
    <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
      <BaseToggleGroup
        {...props}
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        data-spacing={spacing}
        orientation={orientation}
        aria-labelledby={label ? labelId : props['aria-labelledby']}
        value={value ?? (selectedKeys ? Array.from(selectedKeys) : undefined)}
        defaultValue={
          defaultValue ?? (defaultSelectedKeys ? Array.from(defaultSelectedKeys) : undefined)
        }
        multiple={selectionMode === 'multiple'}
        onValueChange={handleChange}
        className={cn(
          'group/toggle-group inline-flex w-fit items-center',
          orientation === 'vertical' ? 'flex-col items-stretch' : 'flex-row',
          spacing === 0
            ? 'gap-0 bg-surface shadow-sm border border-edge rounded overflow-hidden'
            : undefined,
          className,
        )}
        style={spacing ? { gap: `calc(var(--spacing) * ${spacing})` } : undefined}
      >
        {children}
      </BaseToggleGroup>
    </ToggleGroupContext.Provider>
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

export interface ToggleGroupItemProps
  extends Omit<BaseToggleProps<string>, 'disabled'>,
    ToggleVariants {
  id?: string;
  isDisabled?: boolean;
}

export function ToggleGroupItem({
  id,
  className,
  children,
  variant,
  size,
  isDisabled,
  ...props
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  const resolvedVariant = context.variant ?? variant;
  const resolvedSize = context.size ?? size;

  return (
    <BaseToggle
      {...props}
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-spacing={context.spacing}
      value={props.value ?? id}
      disabled={isDisabled}
      className={toggleVariants({
        variant: resolvedVariant,
        size: resolvedSize,
        className: cn(
          'shrink-0 rounded-none focus:z-10 focus-visible:z-10',
          'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
          context.spacing === 0 &&
            (context.orientation === 'vertical'
              ? '[&:not(:first-child)]:border-t [&:not(:first-child)]:border-t-edge'
              : '[&:not(:first-child)]:border-l [&:not(:first-child)]:border-l-edge'),
          className,
        ),
      })}
    >
      {children}
    </BaseToggle>
  );
}
