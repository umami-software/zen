import { Button as BaseButton, type ButtonProps as BaseButtonProps } from '@base-ui/react/button';
import { isValidElement, type MouseEvent, type ReactNode } from 'react';
import type { RenderProp } from './lib/render';
import { type ButtonVariants, button } from './variants';

export interface ButtonProps extends Omit<BaseButtonProps, 'className' | 'render'>, ButtonVariants {
  render?: RenderProp<ButtonRenderProps>;
  /** Render as a link. Ignored when a custom `render` is supplied. */
  href?: string;
  target?: string;
  rel?: string;
  children?: ReactNode;
  className?: string;
  isDisabled?: boolean;
  onPress?: (event: MouseEvent<HTMLElement>) => void;
  preventFocusOnPress?: boolean;
}

export interface ButtonRenderProps {
  className: string;
  children: ReactNode;
  [key: string]: unknown;
}

export function Button({
  variant,
  size = 'md',
  render: renderProp,
  href,
  target,
  rel,
  preventFocusOnPress: _preventFocusOnPress = true,
  nativeButton,
  isDisabled,
  disabled,
  onPress,
  onClick,
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

  return (
    <BaseButton
      {...props}
      data-slot="button"
      render={render as BaseButtonProps['render']}
      nativeButton={isNativeButton}
      disabled={isDisabled ?? disabled}
      className={buttonClassName}
      onClick={handleClick}
    >
      {children}
    </BaseButton>
  );
}
