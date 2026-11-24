# Migrating to @umami/react-zen 1.0

1.0 replaces Zen's custom design system with shadcn/ui's **base-vega** preset (`--preset bIkeymG`)
on Base UI. There is no backward compatibility layer: old prop names and values are removed, so most
breakage shows up as TypeScript errors.

## Run the codemod first

```bash
pnpm dlx tsx packages/react-zen/codemods/zen-1.0.ts <your-src-dir> --dry   # preview
pnpm dlx tsx packages/react-zen/codemods/zen-1.0.ts <your-src-dir> [--wrappers=LinkButton]
```

Run it **once**. It is not idempotent, because it adds `variant="secondary"` to Buttons that have no
variant. Then run `tsc` and work through the errors and the `TODO(zen-1.0)` comments it leaves.

The codemod fixes the changes that would otherwise **compile but behave differently**:

| Silent change | What the codemod does |
| --- | --- |
| Button/Badge with no `variant` (or `variant="default"`) was gray. In shadcn, `default` is the black primary. | Adds `variant="secondary"` first, then maps `primary` → default. |
| Tabs selected by `id`. `id` is still a valid HTML attribute, so it compiles but no longer selects. | `Tab id` → `TabsTrigger value`, `TabPanel id` → `TabsContent value`, ToggleGroupItem `id` → `value`. |
| `onChange` used to hand back a value or boolean. It is now the native event or doesn't exist. | Checkbox/Switch → `onCheckedChange`, Toggle → `onPressedChange`, TextField/PasswordField/SearchField/NumberField/ToggleGroup → `onValueChange`. |
| `Dialog` used to be the styled content. It is now the shadcn root, and `<Dialog>{children}</Dialog>` still compiles. | Flags every `Dialog`, `Modal`, `DialogTrigger` and `AlertDialog`. |
| Checkbox/Switch labels passed as children are silently dropped by shadcn. | Flags them. |

## Setup

- **Styles:** keep importing `@umami/react-zen/styles.css` (Tailwind apps) or `styles.full.css`.
  The `@umami/react-zen/tailwind-preset` export is removed. Tailwind apps must `@source` the zen
  `dist` folder.
- **Tokens:** shadcn variables (`--background`, `--foreground`, `--primary`, `--muted`,
  `--muted-foreground`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`, …)
  plus Zen's `--success`, `--warning`, `--info`. All `--zen-*` variables are removed.
- **Dark mode:** the `.dark` class only. `data-theme` is no longer read or written.
- **Palettes:** `palette` is `neutral | stone | zinc | mauve | olive | mist | taupe` (shadcn base
  colors). `slate` and `gray` are removed.
- **Fonts:** none are shipped. The app's font applies.
- **Tooltips:** `ZenProvider` wraps children in shadcn's `TooltipProvider`. Its `tooltip` prop takes
  `TooltipProvider` props.

## Token mapping (classes and CSS variables)

| Old | New |
| --- | --- |
| `bg-surface` | `bg-background` |
| `bg-surface-raised`, `bg-surface-sunken` | `bg-muted` |
| `bg-surface-overlay` | `bg-popover` |
| `bg-surface-inverted` | `bg-foreground` |
| `bg-interactive(-hover)` | `bg-muted` / `bg-accent` |
| `text-fg` | `text-foreground` |
| `text-fg-muted`, `text-fg-disabled` | `text-muted-foreground` |
| `border-edge(-muted)` | `border-border` |
| `border-edge-strong` | `border-input` |
| `focus-ring` | `ring` |
| `primary-fg` | `primary-foreground` |
| `status-error*` | `destructive` |
| `status-success/warning/info` | `success` / `warning` / `info` (soft backgrounds: `bg-X/10`) |

## Components replaced by shadcn

These are now the unmodified shadcn base-vega components. They are exported with shadcn's names and
parts, and documented at ui.shadcn.com.

| Removed | Use |
| --- | --- |
| `Dialog` (content) + `Modal` + `DialogTrigger` | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` |
| `AlertDialog` (old shape) | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, … |
| `Tooltip` + `TooltipTrigger` | `Tooltip`, `TooltipTrigger`, `TooltipContent` |
| `Menu`, `MenuItem`, `MenuSection`, `MenuSeparator`, `MenuTrigger`, `SubmenuTrigger` | `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuGroup`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuSub*` |
| `Tabs`, `TabList`, `Tab`, `TabPanel` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` (keyed by `value`) |
| `Select` with `items` / `ListItem` | `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`, `SelectGroup`, `SelectLabel` |
| `ComboBox` | `Combobox` parts |
| `Popover` + trigger wrapper | `Popover`, `PopoverTrigger`, `PopoverContent` |
| `HoverTrigger`, `PreviewCard` | `HoverCard`, `HoverCardTrigger`, `HoverCardContent` |
| `Breadcrumbs` | `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator` |
| `ProgressBar` | `Progress` |
| `OTPField` | `InputOTP`, `InputOTPGroup`, `InputOTPSlot`, `InputOTPSeparator` |
| `RouterProvider`, `FileTrigger`, `Focusable`, `Pressable` | removed. Use `render={<Link />}` for router links. |
| Accordion, Alert, AspectRatio, Avatar, Badge, Button, ButtonGroup, Calendar, Carousel, Checkbox, Collapsible, Command, ContextMenu, Drawer, Empty, Field, Input, InputGroup, Kbd, Label, Menubar, Pagination, RadioGroup, Resizable, ScrollArea, Separator, Sheet, Sidebar, Skeleton, Slider, Spinner, Switch, Table, Textarea, Toggle, ToggleGroup | the shadcn component of the same name (parts as in shadcn) |

New in 1.0: `Card` (and its parts).

### Variant and size values

| Component | Old | New |
| --- | --- | --- |
| Button | (none) / `default` (gray) | `secondary` |
| Button | `primary` | `default` (or omit) |
| Button | `quiet` | `ghost` |
| Button | `danger` | `destructive` (now a red tint, not solid red) |
| Button | `zero` | removed (closest is `ghost`) |
| Button | `size="md"` / `"xl"` | `default` / removed |
| Badge | (none) / `default` | `secondary` |
| Badge | `primary` / `error` | `default` / `destructive` |
| Badge | `success`, `warning`, `info`, palette colors, `size` | removed |
| Alert | `danger` | `destructive` |
| Toggle, ToggleGroup, SelectTrigger | `size="md"` | `default` |

### State props (everywhere)

`isDisabled` → `disabled`, `isReadOnly` → `readOnly`, `isRequired` → `required`, `isInvalid` →
`aria-invalid`, `isOpen` → `open`, `onPress` → `onClick`, `placement` → `side` (+ `align`),
`isSelected` → `checked` / `pressed`, `selectedKey(s)` → `value`, `onSelectionChange` →
`onValueChange`, `onAction` → `onClick` on the item.

## Zen components (kept, restyled)

**Layout and typography** (Box, Flexbox, Row, Column, Grid, Container, Text, Heading, Icon, Image)

- Color props (`color`, `backgroundColor`, `borderColor`, their `hover`/`focus`/`active` versions,
  `decorationColor`, Icon `strokeColor`/`fillColor`) take **a shadcn token name or a Tailwind
  palette color**. The value is the token: `color="muted-foreground"` → `text-muted-foreground`,
  `backgroundColor="muted"` → `bg-muted`, `color="red-500"`.
- Text color: `muted` → `muted-foreground`, `primary` → `foreground` (`primary` now means the brand
  color), `inverted` → `background`, `disabled` → `muted-foreground`. `secondary` and `strong` are
  removed.
- Background: `surface` → `background`, `surface-raised`/`surface-sunken` → `muted`,
  `surface-overlay` → `popover`, `surface-inverted`/`inverted` → `foreground`, `interactive*` →
  `muted`/`accent`. `surface-disabled` and `disabled` are removed.
- Border: `muted`/`disabled` → `border`, `strong` → `input`.
- Container: `isFluid` → `fluid`, `isCentered` → `centered`. Image: `isCentered` → `centered`.
- Box: `theme` only accepts `'dark'`.

**Fields**

- TextField, PasswordField, SearchField: `onChange(value)` → `onValueChange(value)`. `onChange` is
  now the native input event.
- PasswordField: `isRevealed` → `revealed`, `onRevealChange` → `onRevealedChange`.
- NumberField, Meter, DatePicker: `minValue`/`maxValue` → `min`/`max`. NumberField and Meter: `formatOptions` → `format` (DatePicker keeps `formatOptions`).
  NumberField and DatePicker use `onValueChange`.
- DatePicker: `isOpen` → `open`, `buttonProps` → `triggerProps`.
- Autocomplete, CheckboxGroup: `onChange` → Base UI `onValueChange(value, details)`. In CheckboxGroup,
  each Checkbox needs its own label (`Field` + `FieldLabel`).
- TagGroup: `onRemove(keys)` → `onRemove(value)`. Tag: `id` → `value`. Tag `variant` takes Badge
  values.
- List / ListItem: `selectedKeys`/`defaultSelectedKeys`/`onSelectionChange` →
  `value`/`defaultValue`/`onValueChange` (always `string[]`). ListItem `id` → `value`.
  `highlightColor`, `isFullscreen`, `renderEmptyState` and `textValue` are removed.

**Forms**

- FormField binds the child control by type: `checked`/`onCheckedChange` (Checkbox, Switch),
  `pressed`/`onPressedChange` (Toggle), native `value`/`onChange` (Input, Textarea, native elements),
  `value`/`onValueChange` (everything else, including TextField). A render-function child receives
  `{ field, fieldState, context, controlProps }` and wires the control itself.
- FormSubmitButton/LoadingButton: `isLoading` → `loading`, `isDisabled` → `disabled`, shadcn Button
  variants. FormResetButton: `onPress` → `onClick`.
- FormButtons is a plain `div` (`flex justify-end gap-3`). The Row layout props are removed.

**Other**

- ConfirmationDialog renders its own `AlertDialog`. Pass `trigger={<Button …/>}` or control it with
  `open`/`onOpenChange`. `isDanger` → `variant` (default `destructive`). The `children({ close })`
  render function is removed.
- CopyButton, ThemeButton, Toolbar/ToolbarButton: shadcn Button props (`onClick`, `disabled`,
  shadcn variants).
- StatusLight `variant`: `success | warning | destructive | info | muted`. `error` → `destructive`,
  `active` → `success`, `inactive` → `muted`.
- DataTable: `selectedKeys`/`defaultSelectedKeys`/`onSelectionChange` →
  `selectedRows`/`defaultSelectedRows`/`onSelectedRowsChange`, plus `selectionMode`.
- Toast `variant`: `default | success | destructive` (`error` → `destructive`).
- FloatingTooltip: `isOpen` → `open`.
- Navbar: put dropdown items in `NavbarLink` children instead of `Menu` inside `NavbarItem`.
