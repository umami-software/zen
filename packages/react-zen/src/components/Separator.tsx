import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { cn } from './lib/tailwind';

export interface SeparatorProps extends BaseSeparator.Props {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ orientation = 'horizontal', className, ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      {...props}
      data-slot="separator"
      orientation={orientation}
      className={cn(
        'shrink-0 bg-edge-muted',
        'data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full',
        'data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
        className,
      )}
    />
  );
}
