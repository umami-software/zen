import { CalendarIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { useState } from 'react';
import type { Matcher } from 'react-day-picker';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldLabel } from '@/components/ui/field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type CalendarProps = ComponentProps<typeof Calendar>;

export interface DatePickerProps {
  id?: string;
  value?: Date;
  defaultValue?: Date;
  /** Earliest selectable date. */
  min?: Date;
  /** Latest selectable date. */
  max?: Date;
  label?: ReactNode;
  placeholder?: ReactNode;
  /** BCP 47 locale used to format the selected date. */
  locale?: string;
  disabled?: boolean;
  readOnly?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  formatOptions?: Intl.DateTimeFormatOptions;
  /** Receives `undefined` when the selected date is cleared. */
  onValueChange?: (date: Date | undefined) => void;
  triggerProps?: Omit<ComponentProps<typeof Button>, 'children'>;
  calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect' | 'required'>;
  className?: string;
}

export function DatePicker({
  id,
  value,
  defaultValue,
  min,
  max,
  label,
  placeholder = 'Select date',
  locale,
  disabled,
  readOnly,
  open: openProp,
  defaultOpen,
  onOpenChange,
  formatOptions = { dateStyle: 'medium' },
  onValueChange,
  triggerProps,
  calendarProps,
  className,
}: DatePickerProps) {
  const fieldId = useFieldId(id ?? triggerProps?.id);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const [uncontrolledValue, setUncontrolledValue] = useState<Date | undefined>(defaultValue);
  const date = value ?? uncontrolledValue;
  const open = openProp ?? uncontrolledOpen;
  const isDisabled = disabled ?? triggerProps?.disabled;

  const setOpen = (nextOpen: boolean) => {
    if (openProp === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleSelect = (nextDate: Date | undefined) => {
    if (readOnly) {
      return;
    }

    if (value === undefined) {
      setUncontrolledValue(nextDate);
    }
    onValueChange?.(nextDate);
    setOpen(false);
  };

  const disabledDays: Matcher[] = [];

  if (min) {
    disabledDays.push({ before: min });
  }
  if (max) {
    disabledDays.push({ after: max });
  }
  if (calendarProps?.disabled !== undefined) {
    disabledDays.push(
      ...(Array.isArray(calendarProps.disabled)
        ? calendarProps.disabled
        : [calendarProps.disabled]),
    );
  }

  const picker = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            {...triggerProps}
            id={fieldId}
            data-slot="date-picker-trigger"
            data-empty={!date || undefined}
            disabled={isDisabled}
            aria-readonly={readOnly || undefined}
            className={cn(
              'w-full justify-start text-left font-normal data-empty:text-muted-foreground',
              triggerProps?.className as string | undefined,
              className,
            )}
          />
        }
      >
        <CalendarIcon />
        {date ? new Intl.DateTimeFormat(locale, formatOptions).format(date) : placeholder}
      </PopoverTrigger>
      <PopoverContent data-slot="date-picker-content" className="w-auto p-0" align="start">
        <Calendar
          {...calendarProps}
          mode="single"
          selected={date}
          defaultMonth={calendarProps?.defaultMonth ?? date}
          startMonth={calendarProps?.startMonth ?? min}
          endMonth={calendarProps?.endMonth ?? max}
          disabled={disabledDays.length ? disabledDays : undefined}
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  );

  if (!label) {
    return picker;
  }

  return (
    <Field data-slot="date-picker" data-disabled={isDisabled ? true : undefined}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      {picker}
    </Field>
  );
}
