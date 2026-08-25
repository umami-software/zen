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

function getOverlayKind(element: ReactElement | undefined): OverlayKind | undefined {
  if (!element) {
    return undefined;
  }

  const nestedKinds = Children.toArray((element.props as { children?: ReactNode }).children)
    .filter(isValidElement)
    .map(child => getOverlayKind(child));

  if (nestedKinds.includes('alert-dialog')) {
    return 'alert-dialog';
  }

  return (element.type as OverlayTarget).zenOverlayType;
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
    <OverlayContentProvider close={() => setOpen(false)} kind={kind}>
      {target}
    </OverlayContentProvider>
  );

  if (kind === 'popover') {
    return (
      <BasePopover.Root
        open={open}
        modal={targetNonModal === undefined ? undefined : !targetNonModal}
        onOpenChange={setOpen}
      >
        <BasePopover.Trigger ref={targetTriggerRef as Ref<HTMLButtonElement>} render={trigger} />
        {content}
      </BasePopover.Root>
    );
  }

  if (kind === 'alert-dialog') {
    return (
      <BaseAlertDialog.Root open={open} onOpenChange={setOpen}>
        <BaseAlertDialog.Trigger render={trigger} />
        {content}
      </BaseAlertDialog.Root>
    );
  }

  return (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <BaseDialog.Trigger render={trigger} />
      {content}
    </BaseDialog.Root>
  );
}

export interface TooltipTriggerProps {
  children: ReactNode;
  delay?: number;
  closeDelay?: number;
}

export function TooltipTrigger({ children, delay, closeDelay }: TooltipTriggerProps) {
  const items = Children.toArray(children) as ReactElement[];
  return (
    <BaseTooltip.Provider delay={delay} closeDelay={closeDelay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={items[0]} />
        {items[1]}
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
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
      <BaseMenu.Trigger render={items[0]} />
      <MenuPrimitiveContext.Provider value="menu">{content}</MenuPrimitiveContext.Provider>
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
              inputRef.current?.click();
            }
          },
        })}
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
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
