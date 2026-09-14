import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cloneElement, isValidElement, type ReactElement } from 'react';

export { mergeProps, useRender };

/**
 * A Base UI compatible `render` prop.
 *
 * Either a React element that the component composes with, or a function that
 * receives the resolved props and the component state and returns an element.
 */
export type RenderProp<P = Record<string, unknown>, S = Record<string, unknown>> =
  | ReactElement
  | ((props: P, state: S) => ReactElement);

/**
 * Resolves a render prop to a React element.
 *
 * Prop merging is delegated to Base UI's `mergeProps` so that event handlers are
 * chained, `style` objects are merged and `className` strings are joined instead
 * of the render element blindly overwriting the component's own props.
 *
 * @param render - Either a React element or a function that returns one
 * @param props - Props to merge/pass to the render prop
 * @param defaultElement - Fallback element if render is not provided
 * @returns The resolved React element
 *
 * @example
 * // Element form - props are merged onto the element
 * <Button render={<a href="/foo" />}>Click</Button>
 *
 * // Function form - you control prop spreading
 * <Button render={(props) => <a {...props} href="/foo">Click</a>} />
 */
export function resolveRender<P extends Record<string, unknown>, S = Record<string, unknown>>(
  render: RenderProp<P, S> | undefined,
  props: P,
  defaultElement: ReactElement,
  state?: S,
): ReactElement {
  if (!render) {
    return defaultElement;
  }

  if (typeof render === 'function') {
    return render(props, (state ?? ({} as S)) as S);
  }

  if (isValidElement<Record<string, unknown>>(render)) {
    const renderProps = render.props as Record<string, unknown>;
    // `mergeProps` chains event handlers, merges `style` and joins `className`,
    // while other conflicting props from the render element win.
    const merged = mergeProps<any>(props as Record<string, unknown>, renderProps) as Record<
      string,
      unknown
    >;
    // Use children from render element if provided, otherwise use children from props
    const children = renderProps.children !== undefined ? renderProps.children : props.children;
    const className =
      [props.className as string | undefined, renderProps.className as string | undefined]
        .filter(Boolean)
        .join(' ') || undefined;

    return cloneElement(render, { ...merged, children, className });
  }

  return defaultElement;
}
