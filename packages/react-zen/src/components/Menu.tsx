import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Popover as BasePopover } from '@base-ui/react/popover';
import {
  Children,
  createContext,
  type HTMLAttributes,
  type Key,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import { Check, ChevronRight } from '@/components/icons';
import { Icon } from './Icon';
import type { Selection } from './lib/interaction';
import { cn } from './lib/tailwind';
import {
  MenubarContext,
  MenuPrimitiveContext,
  type MenuPrimitiveKind,
  type OverlayTarget,
} from './OverlayTrigger';
import { Row } from './Row';
import { ScrollArea } from './ScrollArea';
import { Text } from './Text';
import './Overlay.css';

interface MenuContextValue {
  selected: Set<Key>;
  select: (key: Key) => void;
}

const MenuContext = createContext<MenuContextValue>({
  selected: new Set(),
  select: () => undefined,
});
const MenuSubmenuTriggerContext = createContext<MenuPrimitiveKind | null>(null);

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selectionMode?: 'none' | 'single' | 'multiple';
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (keys: Selection) => void;
}

export function Menu({
  className,
  children,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  ...props
}: MenuProps) {
  const [uncontrolled, setUncontrolled] = useState(new Set<Key>(defaultSelectedKeys));
  const primitiveKind = useContext(MenuPrimitiveContext);
  const inMenubar = useContext(MenubarContext);
  const selected = new Set<Key>(selectedKeys || uncontrolled);
  const select = (key: Key) => {
    if (selectionMode === 'none') {
      return;
    }
    const next = new Set(selectionMode === 'multiple' ? selected : []);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    if (!selectedKeys) {
      setUncontrolled(next);
    }
    onSelectionChange?.(next);
  };

  const popupClassName = cn(
    'min-w-[200px] p-2 border border-edge rounded-md shadow-lg bg-surface-base overflow-hidden outline-none',
    className,
  );

  const popupContent = (
    <MenuContext.Provider value={{ selected, select }}>{children}</MenuContext.Provider>
  );

  if (primitiveKind === 'context-menu') {
    return (
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner className="zen-layer-floating">
          <BaseContextMenu.Popup {...props} className={cn('zen-popover', popupClassName)}>
            {popupContent}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    );
  }

  if (primitiveKind === 'menu') {
    return (
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          sideOffset={4}
          {...(inMenubar ? { align: 'start' as const } : {})}
          className="zen-layer-floating"
        >
          <BaseMenu.Popup {...props} className={cn('zen-popover', popupClassName)}>
            {popupContent}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    );
  }

  return (
    <MenuContext.Provider value={{ selected, select }}>
      <div {...props} role="menu" className={popupClassName}>
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'id'> {
  id?: string | number;
  value?: string;
  icon?: ReactNode;
  label?: string;
  showChecked?: boolean;
  showSubMenuIcon?: boolean;
  isDisabled?: boolean;
  onAction?: (key: Key) => void;
}

export function MenuItem({
  id,
  value,
  icon,
  label,
  showChecked = true,
  showSubMenuIcon,
  isDisabled,
  onAction,
  children,
  className,
  onClick,
  ...props
}: MenuItemProps) {
  const context = useContext(MenuContext);
  const primitiveKind = useContext(MenuPrimitiveContext);
  const submenuTriggerKind = useContext(MenuSubmenuTriggerContext);
  const key = value ?? id ?? (typeof children === 'string' ? children : '');
  const isSelected = context.selected.has(key);
  const activate = () => {
    if (!isDisabled) {
      context.select(key);
      onAction?.(key);
    }
  };

  const itemClassName = cn(
    'text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] flex items-center justify-between gap-3 px-2 py-1.5 rounded cursor-pointer outline-none w-full',
    'hover:bg-interactive focus:bg-interactive data-[highlighted]:bg-interactive',
    'data-[disabled]:text-foreground-disabled',
    'data-[selected]:font-semibold',
    className,
  );
  const content = (
    <>
      <Row alignItems="center" gap>
        {icon && <Icon>{icon}</Icon>}
        {label && <Text>{label}</Text>}
        {children}
      </Row>
      {showChecked && isSelected && (
        <Icon aria-hidden="true">
          <Check />
        </Icon>
      )}
      {showSubMenuIcon && (
        <Icon aria-hidden="true">
          <ChevronRight />
        </Icon>
      )}
    </>
  );

  const primitiveProps = {
    ...props,
    id: id === undefined ? undefined : String(id),
    label,
    disabled: isDisabled,
    'data-selected': isSelected || undefined,
    className: itemClassName,
    onClick: (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        activate();
      }
    },
    children: content,
  };

  if (submenuTriggerKind === 'context-menu') {
    return <BaseContextMenu.SubmenuTrigger {...primitiveProps} />;
  }

  if (submenuTriggerKind === 'menu') {
    return <BaseMenu.SubmenuTrigger {...primitiveProps} />;
  }

  if (primitiveKind === 'context-menu') {
    return <BaseContextMenu.Item {...primitiveProps} />;
  }

  if (primitiveKind === 'menu') {
    return <BaseMenu.Item {...primitiveProps} />;
  }

  return (
    <div
      {...props}
      id={id === undefined ? undefined : String(id)}
      role="menuitem"
      tabIndex={isDisabled ? undefined : -1}
      aria-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      className={itemClassName}
      onClick={event => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          activate();
        }
      }}
      onKeyDown={event => {
        props.onKeyDown?.(event);
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      }}
    >
      {content}
    </div>
  );
}

export interface MenuSeparatorProps extends BaseMenu.Separator.Props {}

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return (
    <BaseMenu.Separator
      {...props}
      className={cn('block h-px bg-edge-muted my-2 -mx-2', className)}
    />
  );
}

export interface MenuSectionProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  maxHeight?: number;
}

export function MenuSection({
  title,
  maxHeight,
  className,
  style,
  children,
  ...props
}: MenuSectionProps) {
  const primitiveKind = useContext(MenuPrimitiveContext);
  const groupClassName = cn('[&:not(:last-child)]:mb-4', className);
  const groupStyle = style;
  const body = maxHeight ? <ScrollArea maxHeight={maxHeight}>{children}</ScrollArea> : children;
  const content = (
    <>
      {title &&
        (primitiveKind === 'context-menu' ? (
          <BaseContextMenu.GroupLabel className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold px-2 py-1.5">
            {title}
          </BaseContextMenu.GroupLabel>
        ) : primitiveKind === 'menu' ? (
          <BaseMenu.GroupLabel className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold px-2 py-1.5">
            {title}
          </BaseMenu.GroupLabel>
        ) : (
          <div className="text-[length:var(--zen-font-size-base)]/[var(--zen-line-height-base)] font-bold px-2 py-1.5">
            {title}
          </div>
        ))}
      {body}
    </>
  );

  if (primitiveKind === 'context-menu') {
    return (
      <BaseContextMenu.Group {...props} className={groupClassName} style={groupStyle}>
        {content}
      </BaseContextMenu.Group>
    );
  }

  if (primitiveKind === 'menu') {
    return (
      <BaseMenu.Group {...props} className={groupClassName} style={groupStyle}>
        {content}
      </BaseMenu.Group>
    );
  }

  return (
    <div {...props} role="group" className={groupClassName} style={groupStyle}>
      {content}
    </div>
  );
}

export interface SubmenuTriggerProps {
  children?: ReactNode;
}

export function SubMenuTrigger({ children }: SubmenuTriggerProps) {
  const items = Children.toArray(children) as ReactElement[];
  const primitiveKind = useContext(MenuPrimitiveContext);
  const targetKind = (items[1]?.type as OverlayTarget | undefined)?.zenOverlayType;
  const content =
    targetKind === 'popover'
      ? ((items[1].props as { children?: ReactNode }).children as ReactNode)
      : items[1];

  if (primitiveKind === 'context-menu') {
    return (
      <BaseContextMenu.SubmenuRoot>
        <MenuSubmenuTriggerContext.Provider value="context-menu">
          {items[0]}
        </MenuSubmenuTriggerContext.Provider>
        <MenuPrimitiveContext.Provider value="context-menu">
          {content}
        </MenuPrimitiveContext.Provider>
      </BaseContextMenu.SubmenuRoot>
    );
  }

  if (primitiveKind === 'menu') {
    return (
      <BaseMenu.SubmenuRoot>
        <MenuSubmenuTriggerContext.Provider value="menu">
          {items[0]}
        </MenuSubmenuTriggerContext.Provider>
        <MenuPrimitiveContext.Provider value="menu">{content}</MenuPrimitiveContext.Provider>
      </BaseMenu.SubmenuRoot>
    );
  }

  return (
    <BasePopover.Root>
      <BasePopover.Trigger render={items[0]} />
      {items[1]}
    </BasePopover.Root>
  );
}
