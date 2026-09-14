import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Popover as BasePopover } from '@base-ui/react/popover';
import type { HTMLAttributes, ReactNode } from 'react';
import { Column } from './Column';
import { Heading } from './Heading';
import { cn } from './lib/tailwind';
import { useOverlayTrigger } from './OverlayTrigger';
import { Text } from './Text';

export interface DialogRenderProps {
  close: () => void;
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  children?: ReactNode | ((props: DialogRenderProps) => ReactNode);
  title?: ReactNode;
  description?: ReactNode;
}

let warnedMissingLabel = false;

function warnMissingLabel() {
  if (process.env.NODE_ENV !== 'production' && !warnedMissingLabel) {
    warnedMissingLabel = true;
    // eslint-disable-next-line no-console
    console.warn(
      '[react-zen] <Dialog> is missing an accessible name. Pass a `title` or an `aria-label`.',
    );
  }
}

export function Dialog({ title, description, children, className, ...props }: DialogProps) {
  const { close, kind } = useOverlayTrigger();
  const ariaLabel = props['aria-label'];

  if (!title && !ariaLabel && !props['aria-labelledby']) {
    warnMissingLabel();
  }

  // Never synthesize the literal string "Dialog". Use the title when present, otherwise fall back
  // to the caller's `aria-label` rendered visually hidden so the popup still has an accessible name.
  const titleContent = title ?? ariaLabel;
  const titleClassName = title ? undefined : 'sr-only';
  const heading = <Heading size="xl">{titleContent}</Heading>;

  const primitiveTitle = !titleContent ? null : kind === 'alert-dialog' ? (
    <BaseAlertDialog.Title className={titleClassName} render={heading} />
  ) : kind === 'dialog' ? (
    <BaseDialog.Title className={titleClassName} render={heading} />
  ) : kind === 'popover' ? (
    <BasePopover.Title className={titleClassName} render={heading} />
  ) : title ? (
    heading
  ) : null;

  const descriptionNode = description ? (
    kind === 'alert-dialog' ? (
      <BaseAlertDialog.Description render={<Text color="muted" />}>
        {description}
      </BaseAlertDialog.Description>
    ) : kind === 'dialog' ? (
      <BaseDialog.Description render={<Text color="muted" />}>{description}</BaseDialog.Description>
    ) : kind === 'popover' ? (
      <BasePopover.Description render={<Text color="muted" />}>
        {description}
      </BasePopover.Description>
    ) : (
      <Text color="muted">{description}</Text>
    )
  ) : null;

  return (
    <div
      {...props}
      data-slot="dialog"
      className={cn(
        'p-6 shadow-xl bg-surface border border-edge rounded relative outline-none overflow-auto',
        // Inside a popover the `Popover` popup already provides the surface, so the dialog would
        // otherwise paint a second border/shadow on top of it.
        kind === 'popover' &&
          'p-0 bg-transparent border-0 shadow-none rounded-none overflow-visible',
        // A fullscreen `Modal` should not show rounded corners or a border on its inner surface.
        'group-data-[placement=fullscreen]/modal:rounded-none group-data-[placement=fullscreen]/modal:border-0 group-data-[placement=fullscreen]/modal:shadow-none group-data-[placement=fullscreen]/modal:size-full',
        className,
      )}
    >
      <Column height="100%" gap>
        {primitiveTitle}
        {descriptionNode}
        {typeof children === 'function' ? children({ close }) : children}
      </Column>
    </div>
  );
}
