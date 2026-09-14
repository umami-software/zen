import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from '@/components/icons';
import { Button, type ButtonProps } from './Button';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';

const TIMEOUT = 2000;

export interface CopyButtonProps
  extends Omit<
    ButtonProps,
    'children' | 'onClick' | 'onPress' | 'size' | 'type' | 'value' | 'variant'
  > {
  value?: string | (() => string);
  timeout?: number;
}

export function CopyButton({ value, timeout = TIMEOUT, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
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
      variant="quiet"
      size="icon-xs"
      data-slot="copy-button"
      data-copied={copied || undefined}
      aria-label={props['aria-label'] ?? 'Copy'}
      className={cn('shrink-0', className)}
      onClick={handleCopy}
    >
      <Icon className="animate-icon-pop">{copied ? <Check /> : <Copy />}</Icon>
    </Button>
  );
}
