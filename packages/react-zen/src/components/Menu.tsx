import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Popover as BasePopover } from '@base-ui/react/popover';
import {
  Children,
  createContext,
  type HTMLAttributes,
  type Key,
  type KeyboardEvent,
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
  OverlayTriggerNestedContext,
} from './OverlayTrigger';
import { Row } from './Row';
import { ScrollArea } from './ScrollArea';
import { Text } from './Text';
import './Overlay.css';

export type MenuSelectionMode = 'none' | 'single' | 'multiple';
export type MenuVariant = 'default' | 'plain';

interface MenuContextValue {
  selected: Set<Key>;
  select: (key: Key) => void;
  selectionMode: MenuSelectionMode;
}

const MenuContext = createContext<MenuContextValue>({
  selected: new Set(),
  select: () => undefined,
  selectionMode: 'none',
});
const MenuSubmenuTriggerContext = createContext<MenuPrimitiveKind | null>(null);

/**
 * Lets a container (such as `Navbar`) opt nested menus out of the standalone popup surface
 * instead of un-styling them with descendant selectors.
 */
export const MenuVariantContext = createContext<MenuVariant | null>(null);

const motionClassName = [
  'origin-(--transform-origin) transition-[transform,opacity] duration-200 ease-out',
  'data-starting-style:opacity-0 data-starting-style:scale-95',
  'data-ending-style:opacity-0 data-ending-style:scale-95 data-ending-style:ease-in',
  'motion-reduce:transition-none',
].join(' ');

const ITEM_ROLES = '[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]';

export interface MenuProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  selectionMode?: MenuSelectionMode;
  selectedKeys?: Iterable<Key>;
  defaultSelectedKeys?: Iterable<Key>;
  onSelectionChange?: (keys: Selection) => void;
  /** `plain` drops the popup surface (border, shadow, background) for embedding in another popup. */
  variant?: MenuVariant;
}

export function Menu({
  className,
  children,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  variant,
  ...props
}: MenuProps) {
  const [uncontrolled, setUncontrolled] = useState(new Set<Key>(defaultSelectedKeys));
  const primitiveKind = useContext(MenuPrimitiveContext);
  const inMenubar = useContext(MenubarContext);
  const inheritedVariant = useContext(MenuVariantContext);
  const resolvedVariant = variant ?? inheritedVariant ?? 'default';
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
    'min-w-[8rem] p-2 outline-none',
    // `overflow-y-auto` (not `overflow-hidden`) so long menus scroll instead of being clipped.
    'max-h-(--available-height) overflow-y-auto overflow-x-hidden',
    resolvedVariant === 'default' && 'border border-edge rounded-md shadow-lg bg-surface',
    className,
  );

  const context: MenuContextValue = { selected, select, selectionMode };

  // In `single` mode Base UI's RadioGroup emits the correct `aria-checked` wiring for its items.
  const wrapSelection = (node: ReactNode) => {
    if (selectionMode !== 'single' || primitiveKind === null) {
      return node;
    }

    // `ContextMenu.RadioGroup` is a re-export of `Menu.RadioGroup`.
    const RadioGroup = BaseMenu.RadioGroup;
    const value = selected.values().next().value ?? null;

    return (
      <RadioGroup value={value} onValueChange={(next: Key) => select(next)}>
        {node}
      </RadioGroup>
    );
  };

  const popupContent = (
    <MenuContext.Provider value={context}>{wrapSelection(children)}</MenuContext.Provider>
  );

  if (primitiveKind === 'context-menu') {
    return (
      <BaseContextMenu.Portal>
        <BaseContextMenu.Positioner className="zen-layer-floating isolate">
          <BaseContextMenu.Popup
            {...props}
            data-slot="menu-content"
            className={cn(motionClassName, popupClassName)}
          >
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
          className="zen-layer-floating isolate"
        >
          <BaseMenu.Popup
            {...props}
            data-slot="menu-content"
            className={cn(motionClassName, popupClassName)}
          >
            {popupContent}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    );
  }

  // Triggerless/static menu: Base UI has no headless popup for this, so implement roving
  // tabindex + arrow key navigation by hand.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    props.onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const container = event.currentTarget;
    const items = Array.from(container.querySelectorAll<HTMLElement>(ITEM_ROLES)).filter(
      item => item.getAttribute('aria-disabled') !== 'true',
    );

    if (!items.length) {
      return;
    }

    const current = items.indexOf(document.activeElement as HTMLElement);
    let next = -1;

    if (event.key === 'ArrowDown') {
      next = current < 0 ? 0 : (current + 1) % items.length;
    } else if (event.key === 'ArrowUp') {
      next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = items.length - 1;
    }

    if (next < 0) {
      return;
    }

    event.preventDefault();
    for (const item of items) {
      item.tabIndex = -1;
    }
    items[next].tabIndex = 0;
    items[next].focus();
  };

  return (
    <MenuContext.Provider value={context}>
      <div
        {...props}
        data-slot="menu-content"
        role="menu"
        tabIndex={0}
        className={popupClassName}
        onKeyDown={handleKeyDown}
        onFocus={event => {
          props.onFocus?.(event);
          if (event.target !== event.currentTarget) {
            return;
          }
          const first = event.currentTarget.querySelector<HTMLElement>(ITEM_ROLES);
          first?.focus();
        }}
      >
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
  /** Shows the selected indicator. Defaults to `true` when the menu has a selection mode. */
  showChecked?: boolean;
  showSubMenuIcon?: boolean;
  isDisabled?: boolean;
  /** Whether picking the item closes the menu. Defaults to `false` for multiple selection. */
  closeOnSelect?: boolean;
  onAction?: (key: Key) => void;
}

export function MenuItem({
  id,
  value,
  icon,
  label,
  showChecked,
  showSubMenuIcon,
  isDisabled,
  closeOnSelect,
  onAction,
  children,
  className,
  onClick,
  ...props
}: MenuItemProps) {
  const context = useContext(MenuContext);
  const primitiveKind = useContext(MenuPrimitiveContext);
  const submenuTriggerKind = useContext(MenuSubmenuTriggerContext);
  const { selectionMode } = context;
  const key = value ?? id ?? (typeof children === 'string' ? children : '');
  const isSelected = context.selected.has(key);
  // Space is only reserved for the indicator when the menu actually supports selection.
  const withIndicator = showChecked ?? selectionMode !== 'none';
  const activate = () => {
    if (!isDisabled) {
      context.select(key);
      onAction?.(key);
    }
  };

  const itemClassName = cn(
    'text-sm flex items-center justify-between gap-3 px-2 py-1.5 rounded cursor-pointer outline-none w-full',
    'data-highlighted:bg-interactive focus-visible:bg-interactive',
    'data-disabled:text-fg-disabled data-disabled:cursor-default',
    'data-selected:font-semibold',
    className,
  );

  const body = (
    <Row alignItems="center" gap>
      {icon && <Icon>{icon}</Icon>}
      {label && <Text>{label}</Text>}
      {children}
    </Row>
  );

  const staticIndicator = withIndicator && isSelected && (
    <Icon aria-hidden="true">
      <Check />
    </Icon>
  );

  const subMenuIcon = showSubMenuIcon && (
    <Icon aria-hidden="true">
      <ChevronRight />
    </Icon>
  );

  const sharedProps = {
    ...props,
    'data-slot': 'menu-item',
    id: id === undefined ? undefined : String(id),
    label,
    disabled: isDisabled,
    'data-selected': isSelected || undefined,
    className: itemClassName,
  };

  const withClick = {
    ...sharedProps,
    onClick: (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        activate();
      }
    },
  };

  if (submenuTriggerKind === 'context-menu') {
    return (
      <BaseContextMenu.SubmenuTrigger {...withClick}>
        {body}
        {subMenuIcon}
      </BaseContextMenu.SubmenuTrigger>
    );
  }

  if (submenuTriggerKind === 'menu') {
    return (
      <BaseMenu.SubmenuTrigger {...withClick}>
        {body}
        {subMenuIcon}
      </BaseMenu.SubmenuTrigger>
    );
  }

  if (primitiveKind === 'menu' || primitiveKind === 'context-menu') {
    // `ContextMenu.CheckboxItem`/`RadioItem`/`Item` are re-exports of the `Menu` parts, so the
    // same components are correct in both branches.
    const parts = BaseMenu;

    // `multiple` selection -> CheckboxItem, `single` -> RadioItem (inside Menu's RadioGroup).
    // Both emit `aria-checked`, which a plain `Item` cannot.
    if (selectionMode === 'multiple') {
      return (
        <parts.CheckboxItem
          {...sharedProps}
          checked={isSelected}
          closeOnClick={closeOnSelect ?? false}
          onCheckedChange={() => {
            if (!isDisabled) {
              context.select(key);
              onAction?.(key);
            }
          }}
        >
          {body}
          {withIndicator && (
            <parts.CheckboxItemIndicator
              className="flex items-center"
              keepMounted={true}
              render={
                <span className="data-[unchecked]:invisible">
                  <Icon aria-hidden="true">
                    <Check />
                  </Icon>
                </span>
              }
            />
          )}
        </parts.CheckboxItem>
      );
    }

    if (selectionMode === 'single') {
      return (
        <parts.RadioItem
          {...sharedProps}
          value={key}
          closeOnClick={closeOnSelect ?? true}
          onClick={(event: MouseEvent<HTMLDivElement>) => {
            onClick?.(event);
            if (!event.defaultPrevented && !isDisabled) {
              onAction?.(key);
            }
          }}
        >
          {body}
          {withIndicator && (
            <parts.RadioItemIndicator
              className="flex items-center"
              keepMounted={true}
              render={
                <span className="data-[unchecked]:invisible">
                  <Icon aria-hidden="true">
                    <Check />
                  </Icon>
                </span>
              }
            />
          )}
        </parts.RadioItem>
      );
    }

    return (
      <parts.Item {...withClick} closeOnClick={closeOnSelect}>
        {body}
        {staticIndicator}
        {subMenuIcon}
      </parts.Item>
    );
  }

  const staticRole =
    selectionMode === 'multiple'
      ? 'menuitemcheckbox'
      : selectionMode === 'single'
        ? 'menuitemradio'
        : 'menuitem';

  return (
    <div
      {...props}
      data-slot="menu-item"
      id={id === undefined ? undefined : String(id)}
      role={staticRole}
      tabIndex={isDisabled ? undefined : -1}
      aria-disabled={isDisabled || undefined}
      aria-checked={selectionMode === 'none' ? undefined : isSelected}
      data-selected={isSelected || undefined}
      data-disabled={isDisabled || undefined}
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
      {body}
      {staticIndicator}
      {subMenuIcon}
    </div>
  );
}

export interface MenuSeparatorProps extends BaseMenu.Separator.Props {}

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  const primitiveKind = useContext(MenuPrimitiveContext);
  const separatorClassName = cn('block h-px bg-edge-muted my-2 -mx-2', className as string);

  if (primitiveKind === 'context-menu') {
    return (
      <BaseContextMenu.Separator
        {...props}
        data-slot="menu-separator"
        className={separatorClassName}
      />
    );
  }

  if (primitiveKind === 'menu') {
    return (
      <BaseMenu.Separator {...props} data-slot="menu-separator" className={separatorClassName} />
    );
  }

  return (
    <div
      {...(props as HTMLAttributes<HTMLDivElement>)}
      data-slot="menu-separator"
      role="separator"
      className={separatorClassName}
    />
  );
}

export interface MenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {}

export function MenuShortcut({ className, ...props }: MenuShortcutProps) {
  return (
    <span
      {...props}
      data-slot="menu-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-fg-muted', className)}
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
          <BaseContextMenu.GroupLabel className="text-sm font-bold px-2 py-1.5">
            {title}
          </BaseContextMenu.GroupLabel>
        ) : primitiveKind === 'menu' ? (
          <BaseMenu.GroupLabel className="text-sm font-bold px-2 py-1.5">
            {title}
          </BaseMenu.GroupLabel>
        ) : (
          <div className="text-sm font-bold px-2 py-1.5">{title}</div>
        ))}
      {body}
    </>
  );

  if (primitiveKind === 'context-menu') {
    return (
      <BaseContextMenu.Group
        {...props}
        data-slot="menu-group"
        className={groupClassName}
        style={groupStyle}
      >
        {content}
      </BaseContextMenu.Group>
    );
  }

  if (primitiveKind === 'menu') {
    return (
      <BaseMenu.Group
        {...props}
        data-slot="menu-group"
        className={groupClassName}
        style={groupStyle}
      >
        {content}
      </BaseMenu.Group>
    );
  }

  return (
    <div
      {...props}
      data-slot="menu-group"
      role="group"
      className={groupClassName}
      style={groupStyle}
    >
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
      <BasePopover.Trigger data-slot="submenu-trigger" render={items[0]} />
      <OverlayTriggerNestedContext.Provider value={true}>
        {items[1]}
      </OverlayTriggerNestedContext.Provider>
    </BasePopover.Root>
  );
}
