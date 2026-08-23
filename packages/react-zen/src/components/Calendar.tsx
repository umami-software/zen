import type { ComponentProps } from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronRight } from '@/components/icons';
import { cn } from './lib/tailwind';

export type CalendarProps = Omit<
  ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'defaultMonth' | 'onSelect' | 'disabled'
> & {
  value?: Date;
  minValue?: Date;
  maxValue?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

export function Calendar({
  className,
  value,
  minValue,
  maxValue,
  defaultValue,
  onChange,
  isDisabled,
  isReadOnly,
  ...props
}: CalendarProps) {
  const disabled = [
    ...(minValue ? [{ before: minValue }] : []),
    ...(maxValue ? [{ after: maxValue }] : []),
  ];

  return (
    <DayPicker
      {...props}
      mode="single"
      selected={value}
      defaultMonth={defaultValue ?? value}
      disabled={isDisabled ? true : disabled}
      onSelect={date => {
        if (date && !isReadOnly) {
          onChange?.(date);
        }
      }}
      className={cn(
        'w-fit max-w-full text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)]',
        className,
      )}
      classNames={{
        months: 'relative',
        month: 'space-y-4',
        month_caption: 'flex justify-center items-center h-10 font-bold',
        nav: 'absolute inset-x-0 top-0 flex justify-between',
        button_previous:
          'inline-flex items-center justify-center size-10 rounded hover:bg-interactive',
        button_next: 'inline-flex items-center justify-center size-10 rounded hover:bg-interactive',
        month_grid: 'border-collapse',
        weekdays: 'flex',
        weekday: 'w-12 text-center font-bold',
        week: 'flex mt-1',
        day: 'size-12 text-center',
        day_button:
          'size-12 rounded cursor-pointer outline-none hover:bg-interactive focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-2',
        selected: '[&>button]:text-primary-foreground [&>button]:bg-primary',
        outside: 'invisible',
        disabled: 'text-foreground-disabled pointer-events-none opacity-50',
        today: '[&>button]:font-bold',
      }}
      components={{
        Chevron: ({ orientation }) => (
          <ChevronRight
            className={cn(
              'size-4',
              orientation === 'left' && 'rotate-180',
              orientation === 'up' && '-rotate-90',
              orientation === 'down' && 'rotate-90',
            )}
          />
        ),
      }}
    />
  );
}
