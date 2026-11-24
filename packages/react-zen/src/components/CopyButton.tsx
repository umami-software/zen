import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { Check, Copy } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TIMEOUT = 2000;

export interface CopyButtonProps
  extends Omit<ComponentProps<typeof Button>, 'children' | 'value' | 'type'> {
  /** Text to copy, or a function that returns it at click time. */
  value?: string | (() => string);
  /** How long the copied state is shown, in milliseconds. */
  timeout?: number;
}

export function CopyButton({
  value,
  timeout = TIMEOUT,
  variant = 'ghost',
  size = 'icon-xs',
  className,
  onClick,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick: CopyButtonProps['onClick'] = async event => {
    onClick?.(event);

    const text = typeof value === 'function' ? value() : value;
    if (text) {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => setCopied(false), timeout);
    }
  };

  return (
    <Button
      {...props}
      type="button"
      variant={variant}
      size={size}
      data-slot="copy-button"
      data-copied={copied || undefined}
      aria-label={props['aria-label'] ?? 'Copy'}
      className={cn('shrink-0', className)}
      onClick={handleClick}
    >
      {copied ? <Check className="animate-in zoom-in-50" /> : <Copy />}
    </Button>
  );
}
