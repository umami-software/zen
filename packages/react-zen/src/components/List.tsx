import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Select as BaseSelect } from '@base-ui/react/select';
import {
  createContext,
  type HTMLAttributes,
  type Key,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useFieldId } from '@/components/hooks/useFieldId';
import { Icon } from '@/components/Icon';
import { Check } from '@/components/icons';
import { Label } from '@/components/Label';
import { getHighlightColor } from '@/lib/styles';
import type { Selection } from './lib/interaction';
import { cn } from './lib/tailwind';
import './Overlay.css';

type ListKind = 'native' | 'select' | 'combobox';

interface ListContextValue {
  kind: ListKind;
  selected: Set<Key>;
  toggle: (key: Key) => void;
}

const ListContext = createContext<ListContextValue>({
  kind: 'native',
  selected: new Set(),
  toggle: () => undefined,
});

export function ListPrimitiveProvider({
  kind,
  children,
}: {
  kind: Exclude<ListKind, 'native'>;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ kind, selected: new Set<Key>(), toggle: () => undefined }),
    [kind],
  );
  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export interface ListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  children?: ReactNode;
  highlightColor?: string;
  showCheckmark?: boolean;
  isFullscreen?: boolean;
  label?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (value: Selection) => void;
  renderEmptyState?: (props: object) => ReactNode;
}

export function List({
  id,
  highlightColor,
  isFullscreen,
  label,
  value,
  onChange,
  className,
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  selectionMode = 'none',
  style,
  children,
  renderEmptyState,
  ...props
}: ListProps) {
  const parent = useContext(ListContext);
  const [uncontrolled, setUncontrolled] = useState(
    new Set<Key>(value || selectedKeys || defaultSelectedKeys),
  );
  const selected = new Set<Key>(value || selectedKeys || uncontrolled);
  const fieldId = useFieldId(id);
  const toggle = (key: Key) => {
    if (selectionMode === 'none') {
      return;
    }
    const next = new Set(selectionMode === 'multiple' ? selected : []);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    if (!value && !selectedKeys) {
      setUncontrolled(next);
    }
    onSelectionChange?.(next);
    onChange?.(Array.from(next, String));
  };
  const classes = cn(
    'grid outline-none overflow-auto gap-1',
    isFullscreen &&
      'zen-layer-floating block p-3 rounded-none fixed inset-0 overflow-auto bg-surface-base',
    className,
  );

  if (parent.kind === 'select') {
    return (
      <BaseSelect.List {...props} id={fieldId} className={classes} style={style}>
        {children}
      </BaseSelect.List>
    );
  }

  if (parent.kind === 'combobox') {
    return (
      <BaseCombobox.List {...props} id={fieldId} className={classes} style={style}>
        {children}
      </BaseCombobox.List>
    );
  }

  return (
    <>
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <ListContext.Provider value={{ kind: 'native', selected, toggle }}>
        <div
          id={fieldId}
          role="listbox"
          aria-multiselectable={selectionMode === 'multiple' || undefined}
          {...props}
          className={classes}
          style={{ ...style, ...getHighlightColor(highlightColor) }}
        >
          {children || renderEmptyState?.({})}
        </div>
      </ListContext.Provider>
    </>
  );
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  children?: ReactNode;
  id?: string | number;
  value?: string | number;
  showCheckmark?: boolean;
  isDisabled?: boolean;
  textValue?: string;
}

const itemClasses =
  'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] flex items-center justify-between px-2 py-1.5 gap-3 min-w-[120px] cursor-pointer outline-none rounded hover:bg-interactive data-[highlighted]:bg-interactive data-[disabled]:text-foreground-disabled data-[selected]:font-semibold';

export function ListItem({
  id,
  value,
  children,
  className,
  showCheckmark = true,
  isDisabled,
  onClick,
  ...props
}: ListItemProps) {
  const context = useContext(ListContext);
  const itemValue = value ?? id ?? (typeof children === 'string' ? children : '');

  if (context.kind === 'select') {
    return (
      <BaseSelect.Item
        {...props}
        value={itemValue}
        disabled={isDisabled}
        className={cn(itemClasses, className)}
      >
        <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
        {showCheckmark && (
          <BaseSelect.ItemIndicator>
            <Icon aria-hidden="true">
              <Check />
            </Icon>
          </BaseSelect.ItemIndicator>
        )}
      </BaseSelect.Item>
    );
  }

  if (context.kind === 'combobox') {
    return (
      <BaseCombobox.Item
        {...props}
        value={String(itemValue)}
        disabled={isDisabled}
        className={cn(itemClasses, className)}
      >
        {children}
        {showCheckmark && (
          <BaseCombobox.ItemIndicator>
            <Icon aria-hidden="true">
              <Check />
            </Icon>
          </BaseCombobox.ItemIndicator>
        )}
      </BaseCombobox.Item>
    );
  }

  const isSelected = context.selected.has(itemValue);
  return (
    <div
      {...props}
      id={id === undefined ? undefined : String(id)}
      role="option"
      tabIndex={isDisabled ? undefined : 0}
      aria-disabled={isDisabled || undefined}
      aria-selected={isSelected}
      data-selected={isSelected || undefined}
      className={cn(itemClasses, className)}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented && !isDisabled) {
          context.toggle(itemValue);
        }
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event);
        if (!isDisabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          context.toggle(itemValue);
        }
      }}
    >
      {children}
      {showCheckmark && isSelected && (
        <Icon aria-hidden="true">
          <Check />
        </Icon>
      )}
    </div>
  );
}

export interface ListSeparatorProps extends BaseSelect.Separator.Props {}

export function ListSeparator({ className, ...props }: ListSeparatorProps) {
  return <BaseSelect.Separator {...props} className={cn('block h-px bg-edge-muted', className)} />;
}

export interface ListSectionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  title?: string;
}

export function ListSection({ title, className, children, ...props }: ListSectionProps) {
  const { kind } = useContext(ListContext);

  if (kind === 'select') {
    return (
      <BaseSelect.Group {...props} className={cn('[&:not(:last-child)]:mb-4', className)}>
        {title && (
          <BaseSelect.GroupLabel className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold px-2 py-1.5">
            {title}
          </BaseSelect.GroupLabel>
        )}
        {children}
      </BaseSelect.Group>
    );
  }

  if (kind === 'combobox') {
    return (
      <BaseCombobox.Group {...props} className={cn('[&:not(:last-child)]:mb-4', className)}>
        {title && (
          <BaseCombobox.GroupLabel className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold px-2 py-1.5">
            {title}
          </BaseCombobox.GroupLabel>
        )}
        {children}
      </BaseCombobox.Group>
    );
  }

  return (
    <div {...props} role="group" className={cn('[&:not(:last-child)]:mb-4', className)}>
      {title && (
        <div className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold px-2 py-1.5">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
