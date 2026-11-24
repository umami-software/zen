import { XIcon } from 'lucide-react';
import {
  type ComponentProps,
  createContext,
  type KeyboardEvent,
  type ReactNode,
  useContext,
  useId,
} from 'react';
import { Badge } from '@/components/ui/badge';
import { FieldTitle } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface TagContextValue {
  removable: boolean;
  remove: (value: string) => void;
}

const TagContext = createContext<TagContextValue>({
  removable: false,
  remove: () => undefined,
});

export interface TagGroupProps extends ComponentProps<'div'> {
  label?: ReactNode;
  /** Makes tags removable. Called with the removed tag's `value`. */
  onRemove?: (value: string) => void;
}

export function TagGroup({ label, children, className, onRemove, ...props }: TagGroupProps) {
  const labelId = useId();

  return (
    <TagContext.Provider
      value={{
        removable: !!onRemove,
        remove: value => onRemove?.(value),
      }}
    >
      <div {...props} data-slot="tag-group" className={cn('flex flex-col gap-3', className)}>
        {label && <FieldTitle id={labelId}>{label}</FieldTitle>}
        <ul
          data-slot="tag-group-list"
          aria-labelledby={label ? labelId : undefined}
          className="m-0 flex list-none flex-wrap gap-1.5 p-0"
        >
          {children}
        </ul>
      </div>
    </TagContext.Provider>
  );
}

export interface TagProps extends Omit<ComponentProps<'li'>, 'value'> {
  /** Identifies the tag in `onRemove`. Defaults to the text content when it is a string. */
  value?: string;
  variant?: ComponentProps<typeof Badge>['variant'];
  disabled?: boolean;
}

export function Tag({
  value,
  variant = 'secondary',
  children,
  className,
  disabled,
  onKeyDown,
  ...props
}: TagProps) {
  const { removable, remove } = useContext(TagContext);
  const tagValue = value ?? (typeof children === 'string' ? children : '');
  const isRemovable = removable && !disabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    onKeyDown?.(event);

    if (event.defaultPrevented || !isRemovable || event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      remove(tagValue);
    }
  };

  return (
    <Badge
      variant={variant}
      data-slot="tag"
      data-disabled={disabled || undefined}
      aria-disabled={disabled || undefined}
      className={cn('outline-none data-disabled:opacity-50', className)}
      render={
        <li
          {...props}
          tabIndex={props.tabIndex ?? (isRemovable ? 0 : undefined)}
          onKeyDown={handleKeyDown}
        />
      }
    >
      {children}
      {isRemovable && (
        <button
          type="button"
          data-slot="tag-remove"
          data-icon="inline-end"
          aria-label={`Remove ${typeof children === 'string' ? children : 'tag'}`}
          className="-mr-0.5 inline-flex size-3.5 cursor-pointer items-center justify-center rounded-full opacity-70 outline-none hover:bg-foreground/10 hover:opacity-100 focus-visible:bg-foreground/10 focus-visible:opacity-100 [&>svg]:size-3"
          onClick={() => remove(tagValue)}
        >
          <XIcon />
        </button>
      )}
    </Badge>
  );
}
