'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Field,
  FieldLabel,
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
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
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
import { type ComponentProps, useState } from 'react';

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
function SidebarFrame({ className, ...props }: ComponentProps<typeof SidebarProvider>) {
  return (
    <SidebarProvider
      {...props}
      className={[
        'relative h-[28rem] min-h-0 w-full overflow-hidden rounded-lg border border-border text-left',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  );
}

interface DemoSelection {
  active: string;
  onSelect: (title: string) => void;
}

function DemoSidebar({
  active,
  onSelect,
  ...props
}: ComponentProps<typeof Sidebar> & DemoSelection) {
  return (
    <Sidebar {...props} className="absolute h-full">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Acme Inc">
              <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Globe />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Acme Inc</span>
                <span className="truncate text-xs text-muted-foreground">Analytics</span>
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
              <Collapsible defaultOpen render={<SidebarMenuItem />}>
                <CollapsibleTrigger render={<SidebarMenuButton tooltip="Settings" />}>
                  <Settings2 />
                  <span>Settings</span>
                  <ChevronRight className="ml-auto transition-transform group-data-panel-open/menu-button:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                </CollapsibleContent>
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
              <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
                JD
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium">Jane Doe</span>
                <span className="truncate text-xs text-muted-foreground">jane@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function DemoInset({ active, ...props }: ComponentProps<typeof SidebarInset> & { active: string }) {
  return (
    <SidebarInset {...props}>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="data-vertical:h-4 data-vertical:self-center" />
        <span className="text-sm font-medium">{active}</span>
      </header>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 rounded-lg bg-muted" />
          <div className="h-20 rounded-lg bg-muted" />
          <div className="h-20 rounded-lg bg-muted" />
        </div>
        <div className="flex-1 rounded-lg bg-muted" />
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
      aria-label={label}
      variant="outline"
      size="sm"
      spacing={0}
      value={[value]}
      onValueChange={values => {
        if (values[0]) {
          onChange(values[0] as T);
        }
      }}
    >
      {options.map(option => (
        <ToggleGroupItem key={option} value={option}>
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
      <SidebarFrame>
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
      <Field orientation="horizontal" className="w-fit">
        <Switch id="sidebar-open" checked={open} onCheckedChange={setOpen} />
        <FieldLabel htmlFor="sidebar-open">Sidebar open</FieldLabel>
      </Field>
      <SidebarFrame open={open} onOpenChange={setOpen}>
        <DemoSidebar active={active} onSelect={setActive} />
        <DemoInset active={active} />
      </SidebarFrame>
    </>
  );
}

export function SidebarSkeletonExample() {
  return (
    <SidebarProvider className="min-h-0 w-auto">
      <Sidebar
        collapsible="none"
        className="h-auto rounded-lg border border-border bg-background text-left"
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
