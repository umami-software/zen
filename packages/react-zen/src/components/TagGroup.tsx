import { createContext, type HTMLAttributes, type Key, type ReactNode, useContext } from 'react';
import { X } from '@/components/icons';
import { Icon } from './Icon';
import { Label } from './Label';
import { cn } from './lib/tailwind';
import { type TagVariants, tag } from './variants';

interface TagContextValue {
  allowsRemoving: boolean;
  remove: (key: Key) => void;
}

const TagContext = createContext<TagContextValue>({
  allowsRemoving: false,
  remove: () => undefined,
});

export interface TagGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  children?: ReactNode;
  onRemove?: (keys: Set<Key>) => void;
}

export function TagGroup({ label, children, className, onRemove, ...props }: TagGroupProps) {
  return (
    <TagContext.Provider
      value={{
        allowsRemoving: !!onRemove,
        remove: key => onRemove?.(new Set([key])),
      }}
    >
      <div {...props} className={cn('flex flex-col gap-1', className)}>
        {label && <Label>{label}</Label>}
        <div role="list" className="flex flex-wrap gap-1">
          {children}
        </div>
      </div>
    </TagContext.Provider>
  );
}

export interface TagProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'>, TagVariants {
  id?: string | number;
  children?: ReactNode;
  isDisabled?: boolean;
}

export function Tag({ id, variant, children, className, isDisabled, ...props }: TagProps) {
  const styles = tag({ variant });
  const { allowsRemoving, remove } = useContext(TagContext);

  return (
    <div
      {...props}
      role="listitem"
      aria-disabled={isDisabled || undefined}
      className={cn(styles.base(), className)}
    >
      {children}
      {allowsRemoving && !isDisabled && (
        <button
          type="button"
          className={styles.removeButton()}
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
          onClick={() => remove(id ?? String(children))}
        >
          <Icon size="xs">
            <X />
          </Icon>
        </button>
      )}
    </div>
  );
}
