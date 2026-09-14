import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useContext,
  useRef,
  useState,
} from 'react';

export type OverlayKind = 'alert-dialog' | 'dialog' | 'popover' | 'menu' | 'tooltip';

export interface OverlayTarget {
  zenOverlayType?: OverlayKind;
}

interface OverlayContextValue {
  close: () => void;
  kind: OverlayKind;
}

const OverlayContext = createContext<OverlayContextValue>({
  close: () => undefined,
  kind: 'dialog',
});

/**
 * True when an overlay surface (`Modal`, `Sheet`, `Popover`, …) is rendered as the second child of
 * one of the compatibility trigger wrappers (`DialogTrigger`, `MenuTrigger`, `HoverTrigger`).
 * When false those components render their own Base UI `Root` so `isOpen`/`onOpenChange`/
 * `defaultOpen` are honored instead of being silently discarded.
 */
export const OverlayTriggerNestedContext = createContext<boolean>(false);

export function useInsideOverlayTrigger() {
  return useContext(OverlayTriggerNestedContext);
}

export type MenuPrimitiveKind = 'context-menu' | 'menu';
export const MenuPrimitiveContext = createContext<MenuPrimitiveKind | null>(null);
/** True when a Menu/MenuItem is rendered inside a Menubar dropdown. */
export const MenubarContext = createContext<boolean>(false);

export function useOverlayTrigger() {
  return useContext(OverlayContext);
}

export function OverlayContentProvider({
  children,
  close,
  kind,
}: {
  children: ReactNode;
  close: () => void;
  kind: OverlayKind;
}) {
  return <OverlayContext.Provider value={{ close, kind }}>{children}</OverlayContext.Provider>;
}

const MAX_OVERLAY_SCAN_DEPTH = 12;

function readOverlayType(node: unknown): OverlayKind | undefined {
  try {
    return (node as { type?: OverlayTarget } | undefined)?.type?.zenOverlayType;
  } catch {
    return undefined;
  }
}

function getChildren(element: ReactElement | undefined): ReactNode {
  try {
    return (element?.props as { children?: ReactNode } | undefined)?.children;
  } catch {
    return undefined;
  }
}

/** Recursively walks a subtree looking for a Zen overlay surface. `alert-dialog` always wins. */
function scanOverlayKind(node: ReactNode, depth: number): OverlayKind | undefined {
  if (depth > MAX_OVERLAY_SCAN_DEPTH) {
    return undefined;
  }

  let found: OverlayKind | undefined;

  for (const child of Children.toArray(node)) {
    if (!isValidElement(child)) {
      continue;
    }

    const own = readOverlayType(child);

    if (own === 'alert-dialog') {
      return 'alert-dialog';
    }

    const nested = scanOverlayKind(getChildren(child), depth + 1);

    if (nested === 'alert-dialog') {
      return 'alert-dialog';
    }

    found ??= own ?? nested;
  }

  return found;
}

/**
 * Best-effort detection of the overlay primitive a trigger should render. Never throws: any
 * unexpected child shape simply yields `undefined` so callers can fall back to `'dialog'`.
 */
export function getOverlayKind(element: ReactElement | undefined): OverlayKind | undefined {
  try {
    if (!element || !isValidElement(element)) {
      return undefined;
    }

    const own = readOverlayType(element);

    if (own === 'alert-dialog') {
      return 'alert-dialog';
    }

    const nested = scanOverlayKind(getChildren(element), 0);

    if (nested === 'alert-dialog') {
      return 'alert-dialog';
    }

    return own ?? nested;
  } catch {
    return undefined;
  }
}

function unwrapMenuContent(element: ReactElement | undefined) {
  if (!element) {
    return element;
  }

  return getOverlayKind(element) === 'popover'
    ? ((element.props as { children?: ReactNode }).children as ReactNode)
    : element;
}

export interface DialogTriggerProps {
  children: ReactNode;
  overlayType?: 'alert-dialog' | 'dialog' | 'popover';
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogTrigger({
  children,
  overlayType,
  isOpen,
  defaultOpen,
  onOpenChange,
}: DialogTriggerProps) {
  const items = Children.toArray(children) as ReactElement[];
  const trigger = items[0];
  const target = items[1] as ReactElement<any>;
  const targetOpen = target?.props?.isOpen as boolean | undefined;
  const targetOpenChange = target?.props?.onOpenChange as ((open: boolean) => void) | undefined;
  const targetNonModal = target?.props?.isNonModal as boolean | undefined;
  const targetTriggerRef = target?.props?.triggerRef as Ref<HTMLElement> | undefined;
  const kind = overlayType ?? getOverlayKind(target) ?? 'dialog';
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const controlledOpen = isOpen ?? targetOpen;
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
    targetOpenChange?.(nextOpen);
  };
  const content = (
    <OverlayTriggerNestedContext.Provider value={true}>
      <OverlayContentProvider close={() => setOpen(false)} kind={kind}>
        {target}
      </OverlayContentProvider>
    </OverlayTriggerNestedContext.Provider>
  );

  if (kind === 'popover') {
    return (
      <BasePopover.Root
        open={open}
        modal={targetNonModal === undefined ? undefined : !targetNonModal}
        onOpenChange={setOpen}
      >
        <BasePopover.Trigger
          data-slot="popover-trigger"
          ref={targetTriggerRef as Ref<HTMLButtonElement>}
          render={trigger}
        />
        {content}
      </BasePopover.Root>
    );
  }

  if (kind === 'alert-dialog') {
    return (
      <BaseAlertDialog.Root open={open} onOpenChange={setOpen}>
        <BaseAlertDialog.Trigger data-slot="alert-dialog-trigger" render={trigger} />
        {content}
      </BaseAlertDialog.Root>
    );
  }

  return (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <BaseDialog.Trigger data-slot="dialog-trigger" render={trigger} />
      {content}
    </BaseDialog.Root>
  );
}

export interface TooltipTriggerProps {
  children: ReactNode;
  delay?: number;
  closeDelay?: number;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDisabled?: boolean;
}

export function TooltipTrigger({
  children,
  delay,
  closeDelay,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDisabled,
}: TooltipTriggerProps) {
  const items = Children.toArray(children) as ReactElement[];

  // No `Tooltip.Provider` here: one is mounted by `ZenProvider`. Base UI's `Tooltip.Root` works
  // without a provider, so standalone usage keeps working.
  return (
    <BaseTooltip.Root
      {...(isOpen === undefined ? { defaultOpen } : { open: isOpen })}
      disabled={isDisabled}
      onOpenChange={onOpenChange}
    >
      <BaseTooltip.Trigger
        data-slot="tooltip-trigger"
        delay={delay}
        closeDelay={closeDelay}
        render={items[0]}
      />
      {items[1]}
    </BaseTooltip.Root>
  );
}

export interface MenuTriggerProps {
  children: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MenuTrigger({ children, isOpen, defaultOpen, onOpenChange }: MenuTriggerProps) {
  const items = Children.toArray(children) as ReactElement[];
  const content = unwrapMenuContent(items[1]);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen ?? false);
  const open = isOpen ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (isOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  return (
    <BaseMenu.Root open={open} onOpenChange={setOpen}>
      <BaseMenu.Trigger data-slot="menu-trigger" render={items[0]} />
      <OverlayTriggerNestedContext.Provider value={true}>
        <MenuPrimitiveContext.Provider value="menu">{content}</MenuPrimitiveContext.Provider>
      </OverlayTriggerNestedContext.Provider>
    </BaseMenu.Root>
  );
}

export interface FileTriggerProps {
  children: ReactElement;
  acceptedFileTypes?: string[];
  allowsMultiple?: boolean;
  onSelect?: (files: FileList | null) => void;
}

export function FileTrigger({
  children,
  acceptedFileTypes,
  allowsMultiple,
  onSelect,
}: FileTriggerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const child = children as ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;

  return (
    <>
      {isValidElement(child) &&
        cloneElement(child, {
          onClick: (event: MouseEvent<HTMLElement>) => {
            child.props.onClick?.(event);
            if (!event.defaultPrevented) {
              const input = inputRef.current;
              if (input) {
                // Reset first so picking the same file twice in a row still fires `change`.
                input.value = '';
                input.click();
              }
            }
          },
        })}
      <input
        ref={inputRef}
        data-slot="file-trigger-input"
        className="sr-only"
        type="file"
        hidden={true}
        tabIndex={-1}
        aria-hidden="true"
        accept={acceptedFileTypes?.join(',')}
        multiple={allowsMultiple}
        onChange={event => onSelect?.(event.target.files)}
      />
    </>
  );
}

export function Focusable({ children }: { children: ReactElement }) {
  const element = children as ReactElement<any>;
  return cloneElement(element, { tabIndex: element.props.tabIndex ?? 0 } as object);
}

export function Pressable({
  children,
  onPress,
}: {
  children: ReactElement;
  onPress?: (event: MouseEvent<HTMLElement>) => void;
}) {
  const child = children as ReactElement<{
    onClick?: (event: MouseEvent<HTMLElement>) => void;
  }>;

  return cloneElement(child, {
    onClick: (event: MouseEvent<HTMLElement>) => {
      child.props.onClick?.(event);
      if (!event.defaultPrevented) {
        onPress?.(event);
      }
    },
  });
}

export function RouterProvider({ children }: { children?: ReactNode }) {
  return children;
}
