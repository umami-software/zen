import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Popover as BasePopover } from '@base-ui/react/popover';
import type { HTMLAttributes, ReactNode } from 'react';
import { Column } from './Column';
import { Heading } from './Heading';
import { cn } from './lib/tailwind';
import { useOverlayTrigger } from './OverlayTrigger';

export interface DialogRenderProps {
  close: () => void;
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  children?: ReactNode | ((props: DialogRenderProps) => ReactNode);
  title?: ReactNode;
}

export function Dialog({ title, children, className, ...props }: DialogProps) {
  const { close, kind } = useOverlayTrigger();
  const titleContent = title ?? 'Dialog';
  const titleClassName = title ? undefined : 'sr-only';
  const heading = <Heading size="xl">{titleContent}</Heading>;
  const primitiveTitle =
    kind === 'alert-dialog' ? (
      <BaseAlertDialog.Title className={titleClassName} render={heading} />
    ) : kind === 'dialog' ? (
      <BaseDialog.Title className={titleClassName} render={heading} />
    ) : kind === 'popover' ? (
      <BasePopover.Title className={titleClassName} render={heading} />
    ) : (
      title && heading
    );

  return (
    <div
      {...props}
      className={cn(
        'p-6 shadow-xl bg-surface border border-edge rounded relative outline-none overflow-auto',
        className,
      )}
    >
      <Column height="100%" gap>
        {primitiveTitle}
        {typeof children === 'function' ? children({ close }) : children}
      </Column>
    </div>
  );
}
