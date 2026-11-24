import { cloneElement, type HTMLAttributes, isValidElement, type ReactElement } from 'react';
import type { FillColor, FontColor, StrokeColor } from '@/lib/types';
import { cn, getCssColorValue, mapTextColor } from './lib/tailwind';

export type StrokeWidth = '0.5' | '1' | '1.5' | '2' | '3' | '4';

export interface IconProps extends Omit<HTMLAttributes<HTMLElement>, 'color' | 'size'> {
  color?: FontColor;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rotate?: number;
  strokeWidth?: StrokeWidth;
  strokeColor?: StrokeColor;
  fillColor?: FillColor;
}

const sizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
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
  size = 'sm',
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
    sizeMap[size],
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
