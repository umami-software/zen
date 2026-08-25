import { useRef, useState } from 'react';
import { Check, Copy } from '@/components/icons';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';

export function CodeBlock(props: any) {
  const textInput = useRef<any>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);

    navigator?.clipboard?.writeText(textInput?.current?.textContent);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <pre
      ref={textInput}
      className={cn(
        'relative p-4 px-5 rounded-md whitespace-pre-wrap break-words',
        '[&_code]:font-mono [&_code]:p-0 [&_code]:border-0 [&_code]:bg-transparent',
      )}
    >
      {props.children}
      <button
        aria-label="Copy code"
        className="absolute right-5 top-4 border-0 cursor-pointer bg-transparent"
        onClick={handleCopy}
      >
        <Icon size="sm">
          {copied ? (
            <Check className="text-green-500" />
          ) : (
            <Copy className="text-gray-400 hover:text-gray-600" />
          )}
        </Icon>
      </button>
    </pre>
  );
}
