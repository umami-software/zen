import {
  createContext,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
  type LiHTMLAttributes,
  type ReactNode,
  useContext,
} from 'react';
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
      <div {...props} data-slot="tag-group" className={cn('flex flex-col gap-2', className)}>
        {label && <Label>{label}</Label>}
        <ul data-slot="tag-group-list" className="flex list-none flex-wrap gap-1 p-0 m-0">
          {children}
        </ul>
      </div>
    </TagContext.Provider>
  );
}

export interface TagProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'id'>, TagVariants {
  id?: string | number;
  children?: ReactNode;
  isDisabled?: boolean;
}

export function Tag({ id, variant, children, className, isDisabled, ...props }: TagProps) {
  const styles = tag({ variant });
  const { allowsRemoving, remove } = useContext(TagContext);
  const key = id ?? String(children);
  const isRemovable = allowsRemoving && !isDisabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    props.onKeyDown?.(event);

    if (event.defaultPrevented || !isRemovable) {
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      remove(key);
    }
  };

  return (
    <li
      {...props}
      data-slot="tag"
      data-disabled={isDisabled || undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={props.tabIndex ?? (isRemovable ? 0 : undefined)}
      className={cn(
        styles.base(),
        'list-none',
        'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
        isDisabled && 'opacity-50',
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      {children}
      {isRemovable && (
        <button
          type="button"
          data-slot="tag-remove"
          className={cn(
            styles.removeButton(),
            'focus-visible:ring-[3px] focus-visible:ring-focus-ring/50',
          )}
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
          onClick={() => remove(key)}
        >
          <Icon size="xs">
            <X />
          </Icon>
        </button>
      )}
    </li>
  );
}
