import {
  Button,
  ComboBox,
  Dialog,
  DialogTrigger,
  Icon,
  ListItem,
  Loading,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  Modal,
  Popover,
  ProgressBar,
  RouterProvider,
  Select,
  Text,
  Tooltip,
  TooltipTrigger,
} from '@umami/react-zen';
import { Fragment } from 'react';

export function WebsiteData({ t, labels, handleSave, canTransfer }: any) {
  return (
    <>
      {/* TODO(zen-1.0): <DialogTrigger>: old DialogTrigger wrapped trigger + Modal. Restructure to <Dialog><DialogTrigger render={<Button ... />} /><DialogContent>...</DialogContent></Dialog> */}
      <DialogTrigger>
        <Button variant="secondary" disabled={!canTransfer}>{t(labels.transfer)}</Button>
        <Modal>
          {/* TODO(zen-1.0): <Dialog>: Dialog is now the shadcn ROOT (old Dialog was the styled content). Restructure to <Dialog open onOpenChange> + <DialogTrigger render={...} /> + <DialogContent> (title -> <DialogHeader><DialogTitle>); render-function children ({ close }) are not supported */}
          <Dialog title={t(labels.transferWebsite)} style={{ width: 400 }}>
            {({ close }: any) => <form onSubmit={handleSave} onReset={close} />}
          </Dialog>
        </Modal>
      </DialogTrigger>
      {/* TODO(zen-1.0): <TooltipTrigger>: restructure to <Tooltip><TooltipTrigger render={...} /><TooltipContent>...</TooltipContent></Tooltip> (old <Tooltip> child becomes <TooltipContent>) */}
      <TooltipTrigger delay={0}>
        <Button variant="ghost">
          <Icon>
            <svg />
          </Icon>
        </Button>
        <Tooltip side="right">{t(labels.settings)}</Tooltip>
      </TooltipTrigger>
      <Loading placement="absolute" />
    </>
  );
}

export function WebsiteMenu({ menuItems, handleAction }: any) {
  // TODO(zen-1.0): <MenuTrigger>: restructure to <DropdownMenu><DropdownMenuTrigger render={...} /><DropdownMenuContent>...</DropdownMenuContent></DropdownMenu> (drop the Popover wrapper)
  return (
    <MenuTrigger>
      <Button variant="ghost">...</Button>
      {/* TODO(zen-1.0): <Popover>: if used with a trigger, restructure to <Popover><PopoverTrigger render={...} /><PopoverContent>...</PopoverContent></Popover> */}
      <Popover side="bottom">
        {/* TODO(zen-1.0): <Menu>: Menu -> DropdownMenuContent; MenuItem -> DropdownMenuItem (onAction/id -> onClick), MenuSection -> DropdownMenuGroup, MenuSeparator -> DropdownMenuSeparator, SubmenuTrigger -> DropdownMenuSub */}
        <Menu>
          {menuItems.map(({ id, label, seperator }: any, index: number) => {
            return (
              <Fragment key={index}>
                {seperator && <MenuSeparator />}
                <MenuItem id={id} onAction={handleAction}>
                  <Text>{label}</Text>
                </MenuItem>
              </Fragment>
            );
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function ActionSelect({ value, onChange, t, labels }: any) {
  // TODO(zen-1.0): <Select>: restructure to <Select value onValueChange><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value>...</SelectItem></SelectContent></Select> (ListItem id -> SelectItem value, onChange -> onValueChange)
  return (
    <Select value={value} onChange={(val: any) => onChange?.(val as string)}>
      <ListItem id="path">{t(labels.viewedPage)}</ListItem>
      <ListItem id="event">{t(labels.triggeredEvent)}</ListItem>
    </Select>
  );
}

// TODO(zen-1.0): <ProgressBar>: ProgressBar -> Progress
export const Progress = ({ value }: any) => <ProgressBar value={value} />;

export function Providers({ children, open }: any) {
  // TODO(zen-1.0): <RouterProvider>: RouterProvider was removed; delete it and render router links with render={<Link ... />}
  return (
    <RouterProvider>
      {/* TODO(zen-1.0): <Dialog>: Dialog is now the shadcn ROOT (old Dialog was the styled content). Restructure to <Dialog open onOpenChange> + <DialogTrigger render={...} /> + <DialogContent> (title -> <DialogHeader><DialogTitle>); render-function children ({ close }) are not supported */}
      {open ? <Dialog>{children}</Dialog> : null}
      {/* TODO(zen-1.0): <ComboBox>: ComboBox -> Combobox (shadcn/base-ui composition) */}
      <ComboBox items={[]} side="bottom" align="start" />
    </RouterProvider>
  );
}
