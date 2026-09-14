import { type ComponentProps, useEffect, useRef } from 'react';
import { type DateRange, type DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChevronDown, ChevronLeft, ChevronRight } from '@/components/icons';
import { cn } from './lib/tailwind';
import { type ButtonVariants, button } from './variants';

export type CalendarSelection = Date | Date[] | DateRange | undefined;

export type CalendarProps = Omit<
  ComponentProps<typeof DayPicker>,
  'mode' | 'selected' | 'defaultMonth' | 'onSelect' | 'disabled'
> & {
  /** Selection mode. Defaults to `single`. */
  mode?: 'single' | 'multiple' | 'range';
  /** Base UI/react-day-picker style selection. Use with `mode`. */
  selected?: CalendarSelection;
  onSelect?: (selected: CalendarSelection) => void;
  /** Compat prop for `mode="single"`. */
  value?: Date;
  minValue?: Date;
  maxValue?: Date;
  defaultValue?: Date;
  /** Compat prop for `mode="single"`. Receives `undefined` when the date is deselected. */
  onChange?: (date: Date | undefined) => void;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  captionLayout?: ComponentProps<typeof DayPicker>['captionLayout'];
  showOutsideDays?: boolean;
  buttonVariant?: ButtonVariants['variant'];
};

export function Calendar({
  className,
  classNames,
  value,
  minValue,
  maxValue,
  defaultValue,
  mode = 'single',
  selected,
  onSelect,
  onChange,
  isDisabled,
  isReadOnly,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'quiet',
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();
  const disabled = [
    ...(minValue ? [{ before: minValue }] : []),
    ...(maxValue ? [{ after: maxValue }] : []),
  ];
  const selection = selected ?? (mode === 'single' ? value : undefined);

  const handleSelect = (next: CalendarSelection) => {
    if (isReadOnly) {
      return;
    }

    onSelect?.(next);

    if (mode === 'single') {
      onChange?.(next as Date | undefined);
    }
  };

  return (
    <DayPicker
      {...(props as ComponentProps<typeof DayPicker>)}
      mode={mode as 'single'}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      selected={selection as Date | undefined}
      defaultMonth={defaultValue ?? value}
      disabled={isDisabled || isReadOnly ? true : disabled}
      onSelect={handleSelect as (next: Date | undefined) => void}
      className={cn(
        'group/calendar [--cell-size:--spacing(8)]',
        'w-fit max-w-full text-sm',
        // The month grid is a real <table>; host prose styles (docs sites,
        // CMS themes) often style table/th/td with borders, padding, and
        // width. Reset them at matching specificity so zen styles hold.
        '[&_table]:m-0 [&_table]:w-auto [&_table]:border-0 [&_table]:text-[length:inherit]',
        '[&_th]:border-0 [&_th]:p-0 [&_th]:text-center [&_th]:align-middle',
        '[&_td]:border-0 [&_td]:p-0 [&_td]:text-center [&_td]:align-middle',
        '[&_th:first-child]:pl-0 [&_th:last-child]:pr-0',
        '[&_td:first-child]:pl-0 [&_td:last-child]:pr-0',
        className,
      )}
      classNames={{
        root: cn(defaultClassNames.root, 'w-fit'),
        months: cn(defaultClassNames.months, 'relative flex flex-col gap-4 md:flex-row'),
        month: cn(defaultClassNames.month, 'flex w-full flex-col gap-4'),
        nav: cn(
          defaultClassNames.nav,
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
        ),
        button_previous: cn(
          defaultClassNames.button_previous,
          button({ variant: buttonVariant }),
          'size-7 p-0 select-none aria-disabled:opacity-50',
        ),
        button_next: cn(
          defaultClassNames.button_next,
          button({ variant: buttonVariant }),
          'size-7 p-0 select-none aria-disabled:opacity-50',
        ),
        month_caption: cn(
          defaultClassNames.month_caption,
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) font-medium',
        ),
        dropdowns: cn(
          defaultClassNames.dropdowns,
          'flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
        ),
        dropdown_root: cn(
          defaultClassNames.dropdown_root,
          'relative rounded border border-edge shadow-xs',
          'has-focus:border-focus-ring has-focus:ring-[3px] has-focus:ring-focus-ring/50',
        ),
        dropdown: cn(defaultClassNames.dropdown, 'absolute inset-0 bg-surface-overlay opacity-0'),
        caption_label: cn(
          defaultClassNames.caption_label,
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'flex items-center gap-1 rounded pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-fg-muted',
        ),
        month_grid: cn(defaultClassNames.month_grid, 'w-full border-collapse'),
        weekdays: cn(defaultClassNames.weekdays, 'flex'),
        weekday: cn(
          defaultClassNames.weekday,
          'flex-1 select-none rounded text-[0.8rem] font-normal text-fg-muted',
        ),
        week: cn(defaultClassNames.week, 'mt-2 flex w-full'),
        week_number_header: cn(defaultClassNames.week_number_header, 'w-(--cell-size) select-none'),
        week_number: cn(defaultClassNames.week_number, 'select-none text-[0.8rem] text-fg-muted'),
        day: cn(
          defaultClassNames.day,
          'group/day relative aspect-square h-full w-full select-none p-0 text-center',
        ),
        range_start: cn(defaultClassNames.range_start, 'rounded-l bg-interactive'),
        range_middle: cn(defaultClassNames.range_middle, 'rounded-none bg-interactive'),
        range_end: cn(defaultClassNames.range_end, 'rounded-r bg-interactive'),
        today: cn(
          defaultClassNames.today,
          'rounded bg-interactive text-fg data-[selected=true]:rounded-none',
        ),
        outside: cn(defaultClassNames.outside, 'text-fg-muted aria-selected:text-fg-muted'),
        disabled: cn(defaultClassNames.disabled, 'text-fg-disabled opacity-50'),
        hidden: cn(defaultClassNames.hidden, 'invisible'),
        ...classNames,
      }}
      components={{
        Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(rootClassName)} {...rootProps} />
        ),
        Chevron: ({ className: chevronClassName, orientation }) => {
          if (orientation === 'left') {
            return <ChevronLeft className={cn('size-4', chevronClassName)} />;
          }

          if (orientation === 'right') {
            return <ChevronRight className={cn('size-4', chevronClassName)} />;
          }

          return (
            <ChevronDown
              className={cn('size-4', orientation === 'up' && 'rotate-180', chevronClassName)}
            />
          );
        },
        DayButton: dayButtonProps => (
          <CalendarDayButton buttonVariant={buttonVariant} {...dayButtonProps} />
        ),
        WeekNumber: ({ children, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex size-(--cell-size) items-center justify-center text-center">
              {children}
            </div>
          </td>
        ),
        ...components,
      }}
    />
  );
}

export function CalendarDayButton({
  className,
  day,
  modifiers,
  buttonVariant = 'quiet',
  ...props
}: ComponentProps<typeof DayButton> & { buttonVariant?: ButtonVariants['variant'] }) {
  const defaultClassNames = getDefaultClassNames();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-slot="calendar-day-button"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      {...props}
      className={cn(
        button({ variant: buttonVariant, size: 'icon' }),
        'relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 rounded border-0 font-normal leading-none',
        'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
        'group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10',
        'group-data-[focused=true]/day:border-focus-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-focus-ring/50',
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-fg',
        'data-[range-start=true]:rounded-l data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-fg',
        'data-[range-end=true]:rounded-r data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-fg',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-interactive data-[range-middle=true]:text-fg',
        '[&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
    />
  );
}
