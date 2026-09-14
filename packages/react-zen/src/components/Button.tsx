import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import { isValidElement, type MouseEvent, type ReactNode } from 'react';
import type { RenderProp } from './lib/render';
import { type ButtonVariants, button } from './variants';

export interface ButtonProps extends Omit<BaseButtonProps, 'className' | 'render'>, ButtonVariants {
  /**
   * Replace the rendered element. Accepts a React element to compose with, or a
   * function `(props, state) => ReactElement` following the Base UI contract.
   */
  render?: RenderProp<ButtonRenderProps, ButtonRenderState>;
  /** Render as a link. Ignored when a custom `render` is supplied. */
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  onPress?: (event: MouseEvent<HTMLElement>) => void;
  /**
   * When `true`, the button does not receive focus when pressed with a pointer
   * (the `mousedown` default is prevented).
   *
   * Defaults to `false` to match native/shadcn behavior — buttons are focused on
   * press. Opt in when the button opens an overlay that manages focus itself.
   *
   * @default false
   */
  preventFocusOnPress?: boolean;
}

export interface ButtonRenderProps {
  className: string;
  children: ReactNode;
  [key: string]: unknown;
}

export interface ButtonRenderState {
  disabled: boolean;
  [key: string]: unknown;
}

export function Button({
  variant,
  size = 'md',
  render: renderProp,
  href,
  target,
  rel,
  preventFocusOnPress = false,
  nativeButton,
  isDisabled,
  disabled,
  onPress,
  onClick,
  onMouseDown,
  className,
  children,
  ...props
}: ButtonProps) {
  const buttonClassName = button({ variant, size, className });
  const render =
    renderProp ??
    (href ? (
      <a
        href={href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noreferrer' : undefined)}
      />
    ) : undefined);
  const isNativeButton =
    nativeButton ?? (render === undefined || (isValidElement(render) && render.type === 'button'));

  const handleClick = (event: any) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      onPress?.(event);
    }
  };

  const handleMouseDown = (event: any) => {
    onMouseDown?.(event);
    if (preventFocusOnPress && !event.defaultPrevented) {
      event.preventDefault();
    }
  };

  return (
    <BaseButton
      data-slot="button"
      {...props}
      data-variant={variant ?? 'default'}
      data-size={size}
      render={render as BaseButtonProps['render']}
      nativeButton={isNativeButton}
      disabled={isDisabled ?? disabled}
      className={buttonClassName}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      {children}
    </BaseButton>
  );
}
