'use client';

import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
  Row,
  Separator,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  type SidebarInsetProps,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  type SidebarProps,
  SidebarProvider,
  type SidebarProviderProps,
  SidebarRail,
  SidebarTrigger,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
} from '@umami/react-zen';
import {
  BarChart3,
  ChevronRight,
  ChevronsUpDown,
  Folder,
  Globe,
  Home,
  Inbox,
  MoreHorizontal,
  Plus,
  Settings2,
  Users,
} from 'lucide-react';
import { useState } from 'react';

const mainItems = [
  { title: 'Home', icon: Home },
  { title: 'Inbox', icon: Inbox, badge: '12' },
  { title: 'Reports', icon: BarChart3 },
  { title: 'Team', icon: Users },
];

const settingsItems = ['General', 'Billing', 'Members'];

const projects = ['Marketing site', 'Docs', 'Mobile app'];

/**
 * Docs demos render inside a bordered frame instead of the full viewport. The provider becomes
 * the positioning context and the sidebar container switches from `fixed` to `absolute`.
 */
function SidebarFrame({ className, ...props }: SidebarProviderProps) {
  return (
    <SidebarProvider
      {...props}
      className={[
        'relative h-[28rem] min-h-0 w-full overflow-hidden rounded-lg border border-edge text-left',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

function DemoSidebar({ active, onSelect, ...props }: SidebarProps & DemoSelection) {
  return (
    <Sidebar {...props} className="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Acme Inc">
              <div className="flex aspect-square size-8 items-center justify-center rounded bg-primary text-primary-fg">
                <Globe />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs text-fg-muted">Analytics</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={active === item.title}
                    tooltip={item.title}
                    onClick={() => onSelect(item.title)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                </SidebarMenuItem>
              ))}
              <Collapsible defaultExpanded render={<SidebarMenuItem />}>
                <CollapsibleTrigger render={<SidebarMenuButton tooltip="Settings" />}>
                  <Settings2 />
                  <span>Settings</span>
                  <ChevronRight className="ml-auto transition-transform group-data-panel-open/menu-button:rotate-90" />
                </CollapsibleTrigger>
                <CollapsiblePanel>
                  <SidebarMenuSub>
                    {settingsItems.map(title => (
                      <SidebarMenuSubItem key={title}>
                        <SidebarMenuSubButton
                          render={<button type="button" />}
                          isActive={active === title}
                          onClick={() => onSelect(title)}
                        >
                          <span>{title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsiblePanel>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarGroupAction title="Add project">
            <Plus />
            <span className="sr-only">Add project</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map(title => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    isActive={active === title}
                    tooltip={title}
                    onClick={() => onSelect(title)}
                  >
                    <Folder />
                    <span>{title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Jane Doe">
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-interactive text-xs font-medium">
                JD
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Jane Doe</span>
                <span className="truncate text-xs text-fg-muted">jane@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

interface DemoSelection {
  active: string;
  onSelect: (title: string) => void;
}

function DemoInset({ active, ...props }: SidebarInsetProps & { active: string }) {
  return (
    <SidebarInset {...props}>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-edge px-3">
        <SidebarTrigger />
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />
        <span className="text-sm font-medium">{active}</span>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 rounded-lg bg-surface-raised" />
          <div className="h-20 rounded-lg bg-surface-raised" />
          <div className="h-20 rounded-lg bg-surface-raised" />
        </div>
        <div className="flex-1 rounded-lg bg-surface-raised" />
      </div>
    </SidebarInset>
  );
}

export function SidebarExample() {
  const [active, setActive] = useState('Home');

  return (
    <SidebarFrame>
      <DemoSidebar collapsible="icon" active={active} onSelect={setActive} />
      <DemoInset active={active} />
    </SidebarFrame>
  );
}

const variants = ['sidebar', 'floating', 'inset'] as const;
const collapsibles = ['offcanvas', 'icon', 'none'] as const;
const sides = ['left', 'right'] as const;

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <ToggleGroup
      label={label}
      value={[value]}
      onChange={keys => {
        if (keys[0]) {
          onChange(keys[0] as T);
        }
      }}
    >
      {options.map(option => (
        <ToggleGroupItem key={option} id={option}>
          {option}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

export function SidebarVariantsExample() {
  const [active, setActive] = useState('Home');
  const [variant, setVariant] = useState<(typeof variants)[number]>('inset');
  const [collapsible, setCollapsible] = useState<(typeof collapsibles)[number]>('icon');
  const [side, setSide] = useState<(typeof sides)[number]>('left');

  return (
    <>
      <Row gap="4" wrap="wrap" justifyContent="center">
        <OptionGroup label="variant" options={variants} value={variant} onChange={setVariant} />
        <OptionGroup
          label="collapsible"
          options={collapsibles}
          value={collapsible}
          onChange={setCollapsible}
        />
        <OptionGroup label="side" options={sides} value={side} onChange={setSide} />
      </Row>
      <SidebarFrame keyboardShortcut={false}>
        <DemoSidebar
          variant={variant}
          collapsible={collapsible}
          side={side}
          active={active}
          onSelect={setActive}
        />
        <DemoInset active={active} />
      </SidebarFrame>
    </>
  );
}

export function SidebarControlledExample() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState('Home');

  return (
    <>
      <Switch isSelected={open} onChange={setOpen}>
        Sidebar open
      </Switch>
      <SidebarFrame open={open} onOpenChange={setOpen} keyboardShortcut={false}>
        <DemoSidebar active={active} onSelect={setActive} />
        <DemoInset active={active} />
      </SidebarFrame>
    </>
  );
}

export function SidebarSkeletonExample() {
  return (
    <SidebarProvider keyboardShortcut={false} className="min-h-0 w-auto">
      <Sidebar
        collapsible="none"
        className="h-auto rounded-lg border border-edge bg-surface text-left"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Loading</SidebarGroupLabel>
            <SidebarMenu>
              {['one', 'two', 'three', 'four'].map(key => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
