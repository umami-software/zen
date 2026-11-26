import { cloneElement, type HTMLAttributes, isValidElement, type ReactElement } from 'react';
import type { FillColor, FontColor, StrokeColor } from '@/lib/types';
import { cn, getCssColorValue, mapTextColor } from './lib/tailwind';

export type StrokeWidth = '0.5' | '1' | '1.5' | '2' | '3' | '4';

export interface IconProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'size'> {
  color?: FontColor;
  /** Matches the text size of the same name (xs 12px … xl 20px). Omit to use the theme's `--icon-size`. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rotate?: number;
  strokeWidth?: StrokeWidth;
  strokeColor?: StrokeColor;
  fillColor?: FillColor;
}

// Sizes match Tailwind's text sizes of the same name (text-xs … text-xl), so an icon lines up
// with the text it sits next to. md is text-base. Use a size-* class for anything larger.
const sizeMap = {
  xs: 'size-3', // 12px
  sm: 'size-3.5', // 14px
  md: 'size-4', // 16px
  lg: 'size-4.5', // 18px
  xl: 'size-5', // 20px
};

const strokeWidthMap: Record<StrokeWidth, string> = {
  '0.5': 'stroke-[0.5]',
  '1': 'stroke-1',
  '1.5': 'stroke-[1.5]',
  '2': 'stroke-2',
  '3': 'stroke-[3]',
  '4': 'stroke-[4]',
};

export function Icon({
  color,
  size,
  rotate,
  strokeWidth,
  strokeColor,
  fillColor,
  style,
  className,
  children,
  ...props
}: IconProps) {
  // Convert color to string for mapping
  const colorStr = color === true ? 'true' : color;

  // Wrapper classes for positioning and rotation
  const wrapperClasses = cn('inline-flex items-center justify-center shrink-0');

  // Map stroke/fill colors for SVG compatibility
  const strokeColorStr = strokeColor === true ? 'true' : strokeColor;
  const fillColorStr = fillColor === true ? 'true' : fillColor;

  const wrapperStyle: React.CSSProperties = {
    ...style,
    transform: rotate ? `rotate(${rotate}deg)` : undefined,
  };

  // Build SVG classes
  const svgClasses = cn(
    size ? sizeMap[size] : 'size-(--icon-size)',
    mapTextColor(colorStr),
    strokeWidth && strokeWidthMap[strokeWidth],
    className,
  );

  // SVG-specific props to pass to the child
  const svgProps: Record<string, any> = {
    className: svgClasses,
  };

  if (strokeColorStr) {
    svgProps.stroke = getCssColorValue(strokeColorStr);
  }
  if (fillColorStr) {
    svgProps.fill = getCssColorValue(fillColorStr);
  }

  // Clone the child element to pass SVG props
  const clonedChild = isValidElement(children)
    ? cloneElement(children as ReactElement, svgProps)
    : children;

  return (
    <span {...props} className={wrapperClasses} style={wrapperStyle}>
      {clonedChild}
    </span>
  );
}
