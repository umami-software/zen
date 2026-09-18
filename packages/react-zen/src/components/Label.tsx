import { forwardRef, type LabelHTMLAttributes } from 'react';
import type { FontSize, FontWeight, Responsive } from '@/lib/types';
import { cn, mapFontSize, mapFontWeight } from './lib/tailwind';

export const labelClasses = [
  'flex items-center gap-2 text-sm leading-none font-semibold select-none',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  'group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
];

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** @deprecated Use `className` instead. Kept for backwards compatibility. */
  size?: Responsive<FontSize>;
  /** @deprecated Use `className` instead. Kept for backwards compatibility. */
  weight?: Responsive<FontWeight>;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size, weight, className, ...props }, ref) => (
    <label
      {...props}
      ref={ref}
      data-slot="label"
      className={cn(labelClasses, mapFontSize(size), mapFontWeight(weight), className)}
    />
  ),
);

Label.displayName = 'Label';
