# SKILL.md - Using @umami/react-zen 1.0

This guide covers how to use the zen component library in your React applications.

Zen 1.0 is built on [shadcn/ui](https://ui.shadcn.com/) (**base-vega** style) on
[Base UI](https://base-ui.com/), styled with Tailwind CSS v4. It has two kinds of components:

- **shadcn components** (Button, Badge, Dialog, DropdownMenu, Select, Tabs, Tooltip, Checkbox,
  Switch, Table, Sidebar, …) are the unmodified shadcn base-vega components, exported with shadcn's
  names and parts. Their shadcn docs apply as written.
- **Zen components** add layout and typography primitives with style props (Box, Row, Column, Grid,
  Text, Heading), richer fields (TextField, PasswordField, SearchField, NumberField, DatePicker),
  react-hook-form forms, DataTable, List, TagGroup, toasts, ConfirmationDialog and theming.

Upgrading from 0.x? Read `MIGRATION-1.0.md` and run its codemod once.

## Installation

```bash
pnpm add @umami/react-zen
```

### With Tailwind CSS (recommended)

In your main stylesheet:

```css
@import "tailwindcss";
@import "@umami/react-zen/styles.css";

@source "../node_modules/@umami/react-zen/dist";
```

The `@source` path is relative to the stylesheet. There is no Tailwind config or preset.

### Without Tailwind CSS

```tsx
import '@umami/react-zen/styles.full.css';
```

## Setup

Wrap your app with `ZenProvider`:

```tsx
import { ZenProvider } from '@umami/react-zen';

function App({ children }) {
  return <ZenProvider palette="neutral">{children}</ZenProvider>;
}
```

### Provider Options

| Prop | Values | Description |
|------|--------|-------------|
| `theme` | `'light'` \| `'dark'` | Force a theme |
| `colorScheme` | `'light'` \| `'dark'` \| `'system'` | Initial scheme when nothing is stored |
| `palette` | `'neutral'` \| `'stone'` \| `'zinc'` \| `'mauve'` \| `'olive'` \| `'mist'` \| `'taupe'` | Color palette (shadcn base colors) |
| `toast` | `{ duration?: number, position?: ... }` | Toast defaults |
| `tooltip` | `TooltipProvider` props (`delay`, `closeDelay`, `timeout`) | Shared tooltip settings |

`ZenProvider` wraps children in `TooltipProvider` and `ToastProvider`.

## Theme

- **Tokens** are the shadcn CSS variables: `--background`, `--foreground`, `--card`, `--popover`,
  `--primary`, `--secondary`, `--muted`, `--muted-foreground`, `--accent`, `--destructive`,
  `--border`, `--input`, `--ring`, `--chart-1..5`, `--sidebar-*`, `--radius`. Zen adds
  `--success`, `--warning` and `--info`. Each is also a Tailwind color (`bg-muted`,
  `text-muted-foreground`, `bg-success/10`).
- **Dark mode** is the `.dark` class (on `<html>`, or any ancestor). `data-theme` is not used.
- **Palettes** are selected with `<html data-palette="zinc">` (or `ZenProvider palette`).
- **Fonts**: Zen ships none. Components inherit the app font; set `--font-sans` / `--font-mono`
  in your Tailwind `@theme`.
- **Customize** by overriding the shadcn variables on `:root` and `.dark` after importing Zen's
  stylesheet. Any shadcn theme works.

```css
:root {
  --primary: oklch(0.546 0.245 262.881);
  --radius: 0.5rem;
}
.dark {
  --primary: oklch(0.707 0.165 254.624);
}
```

## Layout

### Box

Universal container with styling props:

```tsx
<Box padding="4" margin="2" backgroundColor="muted" borderRadius="lg" border>
  Content
</Box>
```

### Flexbox, Row, Column

```tsx
<Row gap="4" justifyContent="space-between" alignItems="center">
  <Text>Left</Text>
  <Text>Right</Text>
</Row>

<Column gap="2">
  <Text>First</Text>
  <Text>Second</Text>
</Column>

<Flexbox direction={{ base: 'column', md: 'row' }} wrap="wrap" gap="2">
  {items.map(item => <Item key={item.id} />)}
</Flexbox>
```

### Grid and Container

```tsx
<Grid columns={{ base: '1', md: '3' }} gap="4">
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
</Grid>

<Container>Centered, max-width content</Container>
<Container fluid>Full width</Container>
```

### Responsive Props

Most style props take a responsive object. Breakpoints: `base`, `sm`, `md`, `lg`, `xl`, `2xl`.

```tsx
<Box
  padding={{ base: '2', md: '4', lg: '6' }}
  display={{ base: 'none', md: 'block' }}
  width={{ base: 'full', md: '1/2', lg: '1/3' }}
>
  Responsive content
</Box>
```

### Color props

`color`, `backgroundColor`, `borderColor` (and their `hover`/`focus`/`active` versions),
`decorationColor`, and Icon `strokeColor`/`fillColor` take **a theme token name or a Tailwind palette
color**. The value becomes the class: `backgroundColor="muted"` → `bg-muted`. The exception is text
`color="muted"`, which renders `text-muted-foreground`.

- Text: `foreground`, `muted`, `primary`, `primary-foreground`, `secondary-foreground`,
  `accent-foreground`, `background`, `card-foreground`, `popover-foreground`
- Background: `background`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`,
  `foreground`, `sidebar`
- Border: `border`, `input`, `ring`, `primary`
- All three: `destructive`, `success`, `warning`, `info`, `transparent`, any Tailwind color
  (`red`, `blue-500`), or `true` for the default (`foreground` / `muted` / `border`)

```tsx
<Text color="muted">Muted text</Text>
<Box backgroundColor="card" border borderColor="input">Card-like panel</Box>
<Box backgroundColor="blue-50">Palette color (doesn't follow dark mode)</Box>
```

## Typography

```tsx
<Heading size="4xl">Page Title</Heading>
<Heading size="lg">Subsection</Heading>

<Text>Default text</Text>
<Text size="sm" color="muted">Small muted text</Text>
<Text weight="bold" color="destructive">Bold error text</Text>

<Code>inline code</Code>
<Blockquote>Quoted text</Blockquote>
```

## Buttons

shadcn Button. Variants: `default` (primary, the default), `secondary`, `outline`, `ghost`,
`destructive`, `link`. Sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`.

```tsx
<Button>Save</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline" size="icon" aria-label="Settings"><Settings /></Button>
<Button disabled onClick={handleClick}>Disabled</Button>

// Zen buttons take the same props
<LoadingButton loading={saving}>Submit</LoadingButton>
<CopyButton value="text to copy" />
<ThemeButton />            // toggles .dark; `target` scopes it to one element
```

Icons come from `lucide-react` (`import { Settings } from 'lucide-react'`). Wrap them in `Icon` for
size and color props: `<Icon size="lg" color="muted"><Check /></Icon>`.

## Forms

The form system is built on react-hook-form. `Form` takes `useForm` options (`defaultValues`,
`mode`, …) or a `form` instance.

```tsx
import {
  Button,
  Form,
  FormButtons,
  FormField,
  FormResetButton,
  FormSubmitButton,
  PasswordField,
  TextField,
} from '@umami/react-zen';

function LoginForm() {
  return (
    <Form onSubmit={data => console.log(data)} defaultValues={{ email: '', password: '' }}>
      <FormField
        name="email"
        label="Email"
        description="We'll never share your email"
        rules={{ required: 'Email is required' }}
      >
        <TextField type="email" />
      </FormField>

      <FormField name="password" label="Password" rules={{ required: 'Password is required' }}>
        <PasswordField />
      </FormField>

      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton>Login</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
```

`FormField` binds its child by type: `checked`/`onCheckedChange` (Checkbox, Switch),
`pressed`/`onPressedChange` (Toggle), native `value`/`onChange` (Input, Textarea, native elements),
and `value`/`onValueChange` for everything else (TextField, Select, RadioGroup, NumberField, …).
A render-function child gets `{ field, fieldState, context, controlProps }` and wires the control
itself. `FormSubmitButton` takes `loading`, `disabled` and Button variants; `FormButtons` is a plain
`flex justify-end gap-3` div.

### Fields

```tsx
<TextField label="Name" placeholder="Enter text" onValueChange={setName} />
<TextField label="Notes" asTextArea />
<PasswordField label="Password" />
<SearchField label="Search" delay={300} onSearch={handleSearch} />
<NumberField label="Quantity" min={0} max={10} onValueChange={setQty} />
<DatePicker label="Date" value={date} onValueChange={setDate} />
```

`onChange` on these fields is the native input event; use `onValueChange` for the value.

### shadcn controls

Checkbox and Switch take no label children. Pair them with `Field` + `FieldLabel` (or `Label`):

```tsx
<Field orientation="horizontal">
  <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} />
  <FieldLabel htmlFor="terms">Accept terms</FieldLabel>
</Field>

<RadioGroup value={size} onValueChange={setSize}>
  <Field orientation="horizontal">
    <RadioGroupItem value="sm" id="size-sm" />
    <FieldLabel htmlFor="size-sm">Small</FieldLabel>
  </Field>
</RadioGroup>

<ToggleGroup value={formats} onValueChange={setFormats} multiple>
  <ToggleGroupItem value="bold" aria-label="Bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic"><Italic /></ToggleGroupItem>
</ToggleGroup>

<Select value={country} onValueChange={setCountry}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Country" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>
```

For a searchable select use the `Combobox` parts.

### Dynamic Field Arrays

```tsx
<FormFieldArray name="items" label="Items">
  {({ fields, append, remove }) => (
    <>
      {fields.map((field, index) => (
        <Row key={field.id} gap="2">
          <FormField name={`items.${index}.name`}>
            <TextField />
          </FormField>
          <Button variant="ghost" onClick={() => remove(index)}>Remove</Button>
        </Row>
      ))}
      <Button variant="outline" onClick={() => append({ name: '' })}>Add Item</Button>
    </>
  )}
</FormFieldArray>
```

## List and TagGroup

```tsx
<List selectionMode="single" value={selected} onValueChange={setSelected}>
  <ListItem value="1">Option 1</ListItem>
  <ListItem value="2">Option 2</ListItem>
  <ListSeparator />
  <ListItem value="3">Option 3</ListItem>
</List>

<TagGroup label="Skills" onRemove={value => removeTag(value)}>
  <Tag value="react">React</Tag>
  <Tag value="ts" variant="outline">TypeScript</Tag>
</TagGroup>
```

List `value` is always a `string[]`.

## Overlays

All overlays are shadcn parts. Triggers use Base UI's `render` prop to render your own element.

```tsx
<Dialog>
  <DialogTrigger render={<Button variant="outline" />}>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>Make changes to your profile.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="outline" />}>Options</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={edit}>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" onClick={remove}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

<Tooltip>
  <TooltipTrigger render={<Button variant="outline" />}>Hover me</TooltipTrigger>
  <TooltipContent>Helpful information</TooltipContent>
</Tooltip>

<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Click me</PopoverTrigger>
  <PopoverContent>Popover content</PopoverContent>
</Popover>

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
  <TabsContent value="password">…</TabsContent>
</Tabs>
```

Also available: `AlertDialog`, `Sheet`, `Drawer`, `HoverCard`, `ContextMenu`, `Menubar`, `Command`.

### ConfirmationDialog

A Zen AlertDialog that makes the user type a value before confirming:

```tsx
<ConfirmationDialog
  trigger={<Button variant="destructive">Delete</Button>}
  title="Delete website?"
  description="This action cannot be undone."
  value="my-website"
  confirmLabel="Delete"
  onConfirm={handleDelete}   // a returned promise keeps the dialog open until it resolves
/>
```

Or control it with `open` / `onOpenChange`. `variant` sets the confirm button (default
`destructive`).

## Feedback

```tsx
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Informational message</AlertDescription>
</Alert>
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>

<Loading />
<Spinner />
<Progress value={75} />
<ProgressCircle value={50} />
<Skeleton className="h-4 w-32" />

<StatusLight variant="success">Active</StatusLight>      // success | warning | destructive | info | muted
<StatusLight variant="destructive">Failed</StatusLight>
```

## Toast Notifications

```tsx
import { useToast } from '@umami/react-zen';

function MyComponent() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast('File deleted', {
          title: 'Deleted',
          variant: 'success', // default | success | destructive
          actions: ['Undo'],
          onClose: action => {
            if (action === 'Undo') restore();
          },
        })
      }
    >
      Delete
    </Button>
  );
}
```

## Data

```tsx
<DataTable data={rows} selectionMode="multiple" selectedRows={ids} onSelectedRowsChange={setIds}>
  <DataColumn id="name" label="Name" />
  <DataColumn id="email" label="Email" />
  <DataColumn id="status" label="Status">
    {row => <StatusLight variant="success">{row.status}</StatusLight>}
  </DataColumn>
</DataTable>

<SearchField value={search} onValueChange={setSearch} />
<DataTable data={rows} filter={search} pageSize={20} defaultSorting={[{ id: 'name', desc: false }]}>
  <DataColumn id="name" label="Name" sortable />
  <DataColumn id="created" label="Created" sortable value={row => new Date(row.created)}>
    {row => formatDate(row.created)}
  </DataColumn>
</DataTable>

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

DataTable is built on TanStack Table. Rows are keyed by their `id` (or index; override with
`getRowId`). `sortable` columns sort on header click; `filter` matches text and number columns
(`filterable={false}` opts out); `pageSize` adds Previous/Next paging; `value` gives a column with a
custom cell a value to sort and filter by; `emptyState` replaces "No results.".

## Sidebar

The shadcn Sidebar. Collapses off canvas or to icons on desktop, renders as a `Sheet` below `md`,
and toggles with Cmd/Ctrl+B.

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon" variant="sidebar">
    <SidebarHeader>{/* logo / team switcher */}</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Home" render={<a href="/" />}>
                <Home />
                <span>Home</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>{/* user menu */}</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger />
    {children}
  </SidebarInset>
</SidebarProvider>

const { state, open, setOpen, isMobile, toggleSidebar } = useSidebar();
```

## Theming Hooks

```tsx
import { PALETTES, useTheme } from '@umami/react-zen';

function ThemeControls() {
  const { theme, palette, setTheme, setPalette } = useTheme();

  return (
    <Row gap="2">
      <Button variant="outline" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </Button>
      <Select value={palette} onValueChange={setPalette}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PALETTES.map(p => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Row>
  );
}
```

`ThemeSwitcher` is a ready-made light/dark switch.

## Utility Hooks

```tsx
const breakpoint = useBreakpoint();         // 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
const debouncedQuery = useDebounce(query, 300);
const isMobile = useIsMobile();
```

## Render Prop

Base UI components take a `render` prop to swap the rendered element, which is how you use a router
link:

```tsx
<Button render={<a href="/page" />}>Go to page</Button>
<Button render={<Link to="/page" />}>Navigate</Button>
```

## TypeScript

Component prop types are exported (`BoxProps`, `TextProps`, `FormFieldProps`, …), as are `Theme`
and `Palette`. Derive prop value types from them:

```tsx
import type { BoxProps, Palette, TextProps, Theme } from '@umami/react-zen';

type BackgroundColor = BoxProps['backgroundColor'];
type TextColor = TextProps['color'];
```

## Best Practices

1. **Use theme tokens** (`muted`, `border`) rather than palette colors so UI
   follows dark mode and the palette.
2. **Prefer component props over raw `className`** on Zen layout components
   (`<Text color="muted">` rather than `<Text className="text-muted-foreground">`).
   shadcn components are styled with `variant`, `size` and `className`.
3. **Use responsive props** for mobile-first responsive design.
4. **Use FormField** for form inputs to get labels, descriptions and error handling.
5. **Use Row/Column** for simple layouts, Flexbox for complex ones.
6. **Follow shadcn's docs** for shadcn components: names, parts and props are unchanged.

## Component Reference

| Category | Components |
|----------|------------|
| Layout | Box, Flexbox, Row, Column, Grid, Container, Navbar, Sidebar, Separator, ScrollArea, Resizable, AspectRatio |
| Buttons | Button, ButtonGroup, LoadingButton, CopyButton, ThemeButton, Toggle, ToggleGroup, Toolbar |
| Typography | Text, Heading, Code, Blockquote, Label, Kbd |
| Forms | Form, FormField, FormFieldArray, FormController, FormButtons, FormSubmitButton, FormResetButton, Field |
| Inputs | TextField, PasswordField, SearchField, NumberField, DatePicker, Input, InputGroup, Textarea, InputOTP, Checkbox, CheckboxGroup, RadioGroup, Switch, Slider |
| Selection | Select, Combobox, Autocomplete, Command, List, TagGroup |
| Feedback | Alert, Badge, Empty, Toast, Loading, Spinner, Skeleton, Progress, ProgressCircle, Meter, StatusLight |
| Overlays | Dialog, AlertDialog, ConfirmationDialog, Sheet, Drawer, Popover, HoverCard, Tooltip, FloatingTooltip, DropdownMenu, ContextMenu, Menubar |
| Data | Table, DataTable, DataCard, Card, Breadcrumb, Pagination, Carousel, Calendar, Accordion, Collapsible, Tabs |
| Media | Image, Icon, Avatar |
| Theme | ZenProvider, ThemeButton, ThemeSwitcher, useTheme |
