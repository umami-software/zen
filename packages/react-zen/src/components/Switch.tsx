import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { useFieldId } from './hooks/useFieldId';
import { Label } from './Label';
import { cn } from './lib/tailwind';

export const switchVariants = tv({
  slots: {
    root: [
      'peer inline-flex shrink-0 items-center rounded-full border border-transparent',
      'bg-interactive shadow-xs cursor-pointer outline-none',
      'transition-[color,background-color,box-shadow,border-color]',
      'data-checked:bg-primary',
      'focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
      'aria-invalid:border-status-error aria-invalid:ring-status-error/20',
      'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    ],
    thumb: [
      'pointer-events-none block rounded-full bg-surface shadow-sm ring-0',
      'transition-transform translate-x-0',
      'data-checked:translate-x-[calc(100%-2px)]',
    ],
  },
  variants: {
    size: {
      sm: { root: 'h-3.5 w-6', thumb: 'size-3' },
      md: { root: 'h-[1.15rem] w-8', thumb: 'size-4' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SwitchVariants = VariantProps<typeof switchVariants>;

export interface SwitchProps
  extends Omit<
      BaseSwitch.Root.Props,
      'checked' | 'defaultChecked' | 'disabled' | 'onCheckedChange' | 'value'
    >,
    SwitchVariants {
  className?: string;
  children?: ReactNode;
  label?: string;
  /**
   * When a `boolean`, acts as a deprecated alias for `isSelected`. When a `string`, it is
   * forwarded to the underlying input as the form value. Prefer `isSelected` for checked state.
   */
  value?: string | boolean;
  isSelected?: boolean;
  defaultSelected?: boolean;
  isDisabled?: boolean;
  onChange?: (selected: boolean) => void;
}

export function Switch({
  label,
  children,
  className,
  size,
  isSelected,
  defaultSelected,
  isDisabled,
  onChange,
  value,
  id,
  ...props
}: SwitchProps) {
  const checked = isSelected ?? (typeof value === 'boolean' ? value : undefined);
  const styles = switchVariants({ size });
  const fieldId = useFieldId(id);
  const labelContent = label ?? children;

  return (
    <div className="flex items-center gap-3 text-sm">
      <BaseSwitch.Root
        {...props}
        id={fieldId}
        data-slot="switch"
        data-size={size ?? 'md'}
        value={typeof value === 'string' ? value : undefined}
        checked={checked}
        defaultChecked={defaultSelected}
        disabled={isDisabled}
        className={cn(styles.root(), className)}
        onCheckedChange={onChange}
      >
        <BaseSwitch.Thumb data-slot="switch-thumb" className={styles.thumb()} />
      </BaseSwitch.Root>
      {labelContent ? (
        <Label
          htmlFor={fieldId}
          className="cursor-pointer font-normal peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-50"
        >
          {labelContent}
        </Label>
      ) : null}
    </div>
  );
}
