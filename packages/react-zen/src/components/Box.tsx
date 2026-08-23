import {
  type CSSProperties,
  type ElementType,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import type {
  AlignContent,
  AlignItems,
  AlignSelf,
  BackgroundColor,
  Border,
  BorderColor,
  BorderRadius,
  BorderWidth,
  BoxShadow,
  Cursor,
  Display,
  FlexGrow,
  FlexShrink,
  FontColor,
  Height,
  JustifyContent,
  JustifyItems,
  JustifySelf,
  Margin,
  MaxHeight,
  MaxWidth,
  MinHeight,
  MinWidth,
  Opacity,
  Overflow,
  Padding,
  PointerEvents,
  Position,
  Responsive,
  Spacing,
  StateStyles,
  TextAlign,
  Width,
} from '@/lib/types';
import { type RenderProp, resolveRender } from './lib/render';
import {
  cn,
  isHeightPreset,
  isMaxHeightPreset,
  isMaxWidthPreset,
  isMinHeightPreset,
  isMinWidthPreset,
  isWidthPreset,
  mapAlignContent,
  mapAlignItems,
  mapAlignSelf,
  mapBackgroundColor,
  mapBorder,
  mapBorderColor,
  mapBorderRadius,
  mapBorderWidth,
  mapCursor,
  mapDisplay,
  mapHeight,
  mapJustifyContent,
  mapJustifyItems,
  mapMargin,
  mapMaxHeight,
  mapMaxWidth,
  mapMinHeight,
  mapMinWidth,
  mapOpacity,
  mapOverflow,
  mapPadding,
  mapPointerEvents,
  mapPosition,
  mapShadow,
  mapSpace,
  mapStateStyles,
  mapTextAlign,
  mapTextColor,
  mapWidth,
} from './lib/tailwind';

export interface BoxProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  display?: Responsive<Display>;
  color?: FontColor;
  backgroundColor?: BackgroundColor;
  border?: Responsive<Border>;
  borderWidth?: Responsive<BorderWidth>;
  borderColor?: BorderColor;
  borderRadius?: Responsive<BorderRadius>;
  shadow?: Responsive<BoxShadow>;

  padding?: Responsive<Padding>;
  paddingX?: Responsive<Padding>;
  paddingY?: Responsive<Padding>;
  paddingTop?: Responsive<Padding>;
  paddingRight?: Responsive<Padding>;
  paddingBottom?: Responsive<Padding>;
  paddingLeft?: Responsive<Padding>;

  margin?: Responsive<Margin>;
  marginX?: Responsive<Margin>;
  marginY?: Responsive<Margin>;
  marginTop?: Responsive<Margin>;
  marginRight?: Responsive<Margin>;
  marginBottom?: Responsive<Margin>;
  marginLeft?: Responsive<Margin>;
  spaceX?: Responsive<Spacing>;
  spaceY?: Responsive<Spacing>;

  width?: Responsive<Width | string>;
  minWidth?: Responsive<MinWidth | string>;
  maxWidth?: Responsive<MaxWidth | string>;

  height?: Responsive<Height | string>;
  minHeight?: Responsive<MinHeight | string>;
  maxHeight?: Responsive<MaxHeight | string>;

  position?: Responsive<Position>;
  textAlign?: Responsive<TextAlign>;

  top?: string;
  right?: string;
  bottom?: string;
  left?: string;

  overflow?: Responsive<Overflow>;
  overflowX?: Responsive<Overflow>;
  overflowY?: Responsive<Overflow>;

  cursor?: Responsive<Cursor>;
  opacity?: Responsive<Opacity>;
  pointerEvents?: Responsive<PointerEvents>;

  alignContent?: Responsive<AlignContent>;
  alignItems?: Responsive<AlignItems>;
  alignSelf?: Responsive<AlignSelf>;
  justifyContent?: Responsive<JustifyContent>;
  justifyItems?: Responsive<JustifyItems>;
  justifySelf?: Responsive<JustifySelf>;

  flexBasis?: string;
  flexGrow?: FlexGrow;
  flexShrink?: FlexShrink;
  fill?: boolean;

  gridArea?: string;
  gridRow?: string;
  gridColumn?: string;

  order?: number;
  zIndex?: number;

  theme?: string;

  // State styles
  hover?: StateStyles;
  focus?: StateStyles;
  active?: StateStyles;

  as?: string;
  render?: RenderProp<BoxRenderProps>;
}

export interface BoxRenderProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}

// Helper to convert value to string for mapping functions
function toStringValue(value: string | number | boolean | undefined): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'boolean') return value ? 'true' : undefined;
  return String(value);
}

export const Box = forwardRef(function Box(
  {
    display,
    color,
    backgroundColor,
    border,
    borderWidth,
    borderColor,
    borderRadius,
    shadow,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    spaceX,
    spaceY,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    position,
    textAlign,
    top,
    right,
    bottom,
    left,
    overflow,
    overflowX,
    overflowY,
    cursor,
    opacity,
    pointerEvents,
    alignContent,
    alignItems,
    alignSelf,
    justifyContent,
    justifyItems,
    justifySelf,
    flexBasis,
    flexGrow,
    flexShrink,
    fill,
    gridArea,
    gridRow,
    gridColumn,
    order,
    zIndex,
    theme,
    hover,
    focus,
    active,
    as = 'div',
    render,
    className,
    style,
    children,
    ...props
  }: BoxProps,
  ref: Ref<HTMLElement>,
) {
  const Component = as as ElementType;

  // Helper to get inline style value for sizing props (only for non-preset strings)
  const getSizingStyle = (
    value: Responsive<string> | undefined,
    isPreset: (v: string) => boolean,
  ): string | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string' && !isPreset(value)) return value;
    return undefined;
  };

  // Build Tailwind classes
  const classes = cn(
    mapDisplay(display),
    mapTextColor(toStringValue(color)),
    mapBackgroundColor(toStringValue(backgroundColor)),
    mapBorder(border),
    mapBorderWidth(borderWidth as Responsive<string>),
    mapBorderColor(toStringValue(borderColor)),
    mapBorderRadius(borderRadius as Responsive<string>),
    mapShadow(shadow as Responsive<string>),
    mapPadding(padding as Responsive<string>),
    mapPadding(paddingX as Responsive<string>, 'x'),
    mapPadding(paddingY as Responsive<string>, 'y'),
    mapPadding(paddingTop as Responsive<string>, 't'),
    mapPadding(paddingRight as Responsive<string>, 'r'),
    mapPadding(paddingBottom as Responsive<string>, 'b'),
    mapPadding(paddingLeft as Responsive<string>, 'l'),
    mapMargin(margin),
    mapMargin(marginX, 'x'),
    mapMargin(marginY, 'y'),
    mapMargin(marginTop, 't'),
    mapMargin(marginRight, 'r'),
    mapMargin(marginBottom, 'b'),
    mapMargin(marginLeft, 'l'),
    mapSpace(spaceX as Responsive<string>, 'x'),
    mapSpace(spaceY as Responsive<string>, 'y'),
    mapWidth(width as Responsive<string>),
    mapMinWidth(minWidth as Responsive<string>),
    mapMaxWidth(maxWidth as Responsive<string>),
    mapHeight(height as Responsive<string>),
    mapMinHeight(minHeight as Responsive<string>),
    mapMaxHeight(maxHeight as Responsive<string>),
    mapPosition(position),
    mapTextAlign(textAlign),
    mapOverflow(overflow),
    mapOverflow(overflowX, 'x'),
    mapOverflow(overflowY, 'y'),
    mapCursor(cursor),
    mapOpacity(opacity),
    mapPointerEvents(pointerEvents),
    mapAlignContent(alignContent),
    mapAlignItems(alignItems),
    mapAlignSelf(alignSelf),
    mapJustifyContent(justifyContent),
    mapJustifyItems(justifyItems),
    theme && `${theme}-theme`,
    mapStateStyles('hover', hover),
    mapStateStyles('focus', focus),
    mapStateStyles('active', active),
    className,
  );

  // Get inline style values for non-preset sizing
  const widthStyle = getSizingStyle(width as Responsive<string>, isWidthPreset);
  const minWidthStyle = getSizingStyle(minWidth as Responsive<string>, isMinWidthPreset);
  const maxWidthStyle = getSizingStyle(maxWidth as Responsive<string>, isMaxWidthPreset);
  const heightStyle = getSizingStyle(height as Responsive<string>, isHeightPreset);
  const minHeightStyle = getSizingStyle(minHeight as Responsive<string>, isMinHeightPreset);
  const maxHeightStyle = getSizingStyle(maxHeight as Responsive<string>, isMaxHeightPreset);

  // Inline styles for values that can't be mapped to Tailwind utilities
  const inlineStyles: CSSProperties = {
    ...style,
    ...(widthStyle && { width: widthStyle }),
    ...(minWidthStyle && { minWidth: minWidthStyle }),
    ...(maxWidthStyle && { maxWidth: maxWidthStyle }),
    ...(heightStyle && { height: heightStyle }),
    ...(minHeightStyle && { minHeight: minHeightStyle }),
    ...(maxHeightStyle && { maxHeight: maxHeightStyle }),
    ...(top && { top }),
    ...(right && { right }),
    ...(bottom && { bottom }),
    ...(left && { left }),
    ...(flexBasis && { flexBasis }),
    ...(flexGrow !== undefined && { flexGrow }),
    ...(flexShrink !== undefined && { flexShrink }),
    ...(fill && { flex: 1 }),
    ...(gridArea && { gridArea }),
    ...(gridRow && { gridRow }),
    ...(gridColumn && { gridColumn }),
    ...(order !== undefined && { order }),
    ...(zIndex !== undefined && { zIndex }),
    ...(justifySelf && { justifySelf: justifySelf as CSSProperties['justifySelf'] }),
  };

  // Only include style prop if there are inline styles beyond what was passed in
  const hasInlineStyles =
    Object.keys(inlineStyles).length > (style ? Object.keys(style).length : 0);

  const renderProps: BoxRenderProps = {
    ...props,
    className: classes || undefined,
    style: hasInlineStyles || style ? inlineStyles : undefined,
    children,
  };

  const defaultElement = (
    <Component
      ref={ref}
      {...props}
      className={classes || undefined}
      style={hasInlineStyles || style ? inlineStyles : undefined}
    >
      {children}
    </Component>
  );

  return resolveRender(render, renderProps, defaultElement);
});
