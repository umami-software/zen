import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ButtonHTMLAttributes } from 'react';
import { useState } from 'react';
import { CalendarDays } from '@/components/icons';
import { Calendar, type CalendarProps } from './Calendar';
import { useFieldId } from './hooks/useFieldId';
import { Icon } from './Icon';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { inputField } from './variants';
import './Overlay.css';
import './Popover.css';

export interface DatePickerProps {
  id?: string;
  value?: Date;
  defaultValue?: Date;
  minValue?: Date;
  maxValue?: Date;
  label?: string;
  placeholder?: string;
  locale?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Receives `undefined` when the selected date is cleared. */
  onChange?: (date: Date | undefined) => void;
  triggerProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  /** @deprecated Use `triggerProps` instead. */
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  calendarProps?: Partial<CalendarProps>;
  className?: string;
}

export function DatePicker({
  id,
  value,
  defaultValue,
  minValue,
  maxValue,
  label,
  placeholder = 'Select date',
  locale,
  isDisabled,
  isReadOnly,
  isOpen,
  defaultOpen,
  onOpenChange,
  formatOptions = { dateStyle: 'medium' },
  onChange,
  triggerProps,
  buttonProps,
  calendarProps,
  className,
}: DatePickerProps) {
  const fieldId = useFieldId(id ?? triggerProps?.id ?? buttonProps?.id);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | undefined>(defaultValue);
  const date = value ?? uncontrolledValue;
  const open = isOpen ?? uncontrolledOpen;
  const disabled = isDisabled ?? triggerProps?.disabled ?? buttonProps?.disabled;

  const setOpen = (nextOpen: boolean) => {
    if (isOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleChange = (nextDate: Date | undefined) => {
    if (isReadOnly) {
      return;
    }

    if (value === undefined) {
      setUncontrolledValue(nextDate);
    }
    onChange?.(nextDate);
    setOpen(false);
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} data-slot="date-picker">
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <BasePopover.Root open={open} onOpenChange={setOpen}>
        <BasePopover.Trigger
          render={
            <button
              type="button"
              {...buttonProps}
              {...triggerProps}
              id={fieldId}
              data-slot="date-picker-trigger"
              disabled={disabled}
              aria-readonly={isReadOnly || undefined}
              className={inputField({
                className: cn(
                  'w-full justify-start gap-3 px-3 py-0 whitespace-nowrap cursor-pointer outline-none',
                  'hover:border-edge-strong',
                  buttonProps?.className,
                  triggerProps?.className,
                ),
              })}
            >
              <Icon size="sm">
                <CalendarDays />
              </Icon>
              {date ? (
                new Intl.DateTimeFormat(locale, formatOptions).format(date)
              ) : (
                <span className="text-fg-muted">{placeholder}</span>
              )}
            </button>
          }
        />
        <BasePopover.Portal>
          <BasePopover.Positioner sideOffset={4} className="zen-layer-floating">
            <BasePopover.Popup
              data-slot="date-picker-popup"
              className="zen-popover outline-none bg-surface-overlay border border-edge rounded-lg shadow-lg p-4"
            >
              <Calendar
                {...calendarProps}
                value={date}
                minValue={minValue}
                maxValue={maxValue}
                isReadOnly={isReadOnly}
                onChange={handleChange}
              />
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
    </div>
  );
}
