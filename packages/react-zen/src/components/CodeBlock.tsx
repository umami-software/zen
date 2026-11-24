import { type HTMLAttributes, useRef, useState } from 'react';
import { Check, Copy } from '@/components/icons';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';

export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {}

export function CodeBlock({ className, children, ...props }: CodeBlockProps) {
  const textInput = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    navigator?.clipboard?.writeText(textInput.current?.textContent ?? '');

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <pre
      {...props}
      ref={textInput}
      className={cn(
        'relative rounded-lg bg-muted p-4 pr-12 font-mono text-sm whitespace-pre-wrap break-words',
        '[&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:font-mono',
        className,
      )}
    >
      {children}
      <button
        type="button"
        aria-label="Copy code"
        className="absolute top-4 right-4 cursor-pointer rounded-md border-0 bg-transparent text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={handleCopy}
      >
        <Icon>{copied ? <Check className="text-success" /> : <Copy />}</Icon>
      </button>
    </pre>
  );
}
