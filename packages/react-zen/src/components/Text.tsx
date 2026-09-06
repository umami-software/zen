import type { HTMLAttributes, ReactNode } from 'react';
import type {
  FontColor,
  FontSize,
  FontWeight,
  LetterSpacing,
  LineHeight,
  Responsive,
  TextAlign,
  TextDecorationStyle,
  TextIndent,
  TextTransform,
  TextWrap,
  VerticalAlign,
  Whitespace,
  WordBreak,
} from '@/lib/types';
import { type RenderProp, resolveRender } from './lib/render';
import {
  cn,
  mapFontSize,
  mapFontWeight,
  mapLetterSpacing,
  mapLineHeight,
  mapTextAlign,
  mapTextColor,
  mapTextDecorationStyle,
  mapTextIndent,
  mapTextTransform,
  mapTextWrap,
  mapVerticalAlign,
  mapWhitespace,
  mapWordBreak,
} from './lib/tailwind';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  color?: FontColor;
  size?: Responsive<FontSize>;
  weight?: Responsive<FontWeight>;
  align?: Responsive<TextAlign>;
  spacing?: Responsive<LetterSpacing>;
  lineHeight?: Responsive<LineHeight>;
  wrap?: Responsive<TextWrap>;
  whitespace?: Responsive<Whitespace>;
  wordBreak?: Responsive<WordBreak>;
  transform?: Responsive<TextTransform>;
  indent?: Responsive<TextIndent>;
  verticalAlign?: Responsive<VerticalAlign>;
  truncate?: Responsive<boolean>;
  italic?: Responsive<boolean>;
  underline?: Responsive<boolean>;
  strikethrough?: Responsive<boolean>;
  decorationStyle?: Responsive<TextDecorationStyle>;
  decorationColor?: FontColor;
  as?:
    | 'span'
    | 'div'
    | 'label'
    | 'p'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'code'
    | 'blockquote';
  render?: RenderProp<TextRenderProps>;
}

export interface TextRenderProps {
  className: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function Text({
  color,
  size = 'sm',
  weight,
  align,
  spacing,
  lineHeight,
  wrap,
  whitespace,
  wordBreak,
  transform,
  indent,
  verticalAlign,
  truncate,
  italic,
  underline,
  strikethrough,
  decorationStyle,
  decorationColor,
  as = 'span',
  render,
  className,
  children,
  ...props
}: TextProps) {
  const Component = as;

  // Convert color to string for mapping
  const colorStr = color === true ? 'true' : color;
  const decorationColorStr = decorationColor === true ? 'true' : decorationColor;

  const classes = cn(
    mapFontSize(size),
    mapFontWeight(weight),
    mapTextAlign(align),
    mapLetterSpacing(spacing),
    mapLineHeight(lineHeight),
    mapTextWrap(wrap),
    mapWhitespace(whitespace),
    mapWordBreak(wordBreak),
    mapTextTransform(transform),
    mapTextIndent(indent),
    mapVerticalAlign(verticalAlign),
    mapTextColor(colorStr),
    truncate && 'truncate',
    italic && 'italic',
    underline && 'underline',
    strikethrough && 'line-through',
    mapTextDecorationStyle(decorationStyle),
    decorationColorStr && `decoration-${decorationColorStr}`,
    className,
  );

  const renderProps: TextRenderProps = {
    ...props,
    className: classes,
    children,
  };

  const defaultElement = (
    <Component {...props} className={classes}>
      {children}
    </Component>
  );

  return resolveRender(render, renderProps, defaultElement);
}
