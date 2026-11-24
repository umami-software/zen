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
      <DialogTrigger>
        <Button isDisabled={!canTransfer}>{t(labels.transfer)}</Button>
        <Modal>
          <Dialog title={t(labels.transferWebsite)} style={{ width: 400 }}>
            {({ close }: any) => <form onSubmit={handleSave} onReset={close} />}
          </Dialog>
        </Modal>
      </DialogTrigger>
      <TooltipTrigger delay={0}>
        <Button variant="quiet">
          <Icon>
            <svg />
          </Icon>
        </Button>
        <Tooltip placement="right">{t(labels.settings)}</Tooltip>
      </TooltipTrigger>
      <Loading placement="absolute" />
    </>
  );
}

export function WebsiteMenu({ menuItems, handleAction }: any) {
  return (
    <MenuTrigger>
      <Button variant="quiet">...</Button>
      <Popover side="bottom">
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
  return (
    <Select value={value} onChange={(val: any) => onChange?.(val as string)}>
      <ListItem id="path">{t(labels.viewedPage)}</ListItem>
      <ListItem id="event">{t(labels.triggeredEvent)}</ListItem>
    </Select>
  );
}

export const Progress = ({ value }: any) => <ProgressBar value={value} />;

export function Providers({ children, open }: any) {
  return (
    <RouterProvider>
      {open ? <Dialog>{children}</Dialog> : null}
      <ComboBox items={[]} placement="bottom start" />
    </RouterProvider>
  );
}
