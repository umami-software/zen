# SKILL.md - Using @umami/react-zen

This guide covers how to use the zen component library in your React applications.

## Installation

```bash
pnpm add @umami/react-zen
```

Import the stylesheet in your app entry point:

```tsx
import '@umami/react-zen/styles.css';
```

## Setup

Wrap your app with `ZenProvider`:

```tsx
import { ZenProvider } from '@umami/react-zen';

function App() {
  return (
    <ZenProvider theme="light" palette="neutral">
      {children}
    </ZenProvider>
  );
}
```

### Provider Options

| Prop | Values | Description |
|------|--------|-------------|
| `theme` | `'light'` \| `'dark'` | Color theme |
| `colorScheme` | `'light'` \| `'dark'` \| `'system'` | System preference support |
| `palette` | `'neutral'` \| `'slate'` \| `'gray'` \| `'zinc'` \| `'stone'` | Color palette |
| `toast` | `{ duration: number }` | Toast defaults |

## Components

### Layout

#### Box

Universal container with styling props:

```tsx
<Box padding="4" margin="2" backgroundColor="surface-raised" borderRadius="lg">
  Content
</Box>
```

#### Flexbox, Row, Column

Flex layouts with gap, alignment, and justification:

```tsx
<Row gap="4" justifyContent="space-between" alignItems="center">
  <Text>Left</Text>
  <Text>Right</Text>
</Row>

<Column gap="2">
  <Text>First</Text>
  <Text>Second</Text>
</Column>

<Flexbox direction="row" wrap="wrap" gap="2">
  {items.map(item => <Item key={item.id} />)}
</Flexbox>
```

#### Grid

CSS Grid layout:

```tsx
<Grid columns="3" gap="4">
  <Box>1</Box>
  <Box>2</Box>
  <Box>3</Box>
</Grid>
```

### Responsive Props

All layout props support responsive values:

```tsx
<Box
  padding={{ base: '2', md: '4', lg: '6' }}
  display={{ base: 'none', md: 'block' }}
  width={{ base: 'full', md: '1/2', lg: '1/3' }}
>
  Responsive content
</Box>
```

Breakpoints: `base`, `sm`, `md`, `lg`, `xl`, `2xl`

### Buttons

```tsx
// Variants
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="quiet">Quiet</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With loading state
<LoadingButton isLoading={loading} variant="primary">
  Submit
</LoadingButton>

// Copy to clipboard
<CopyButton value="text to copy" />

// Theme toggle
<ThemeButton />
```

### Typography

```tsx
// Headings
<Heading size="6xl">Hero</Heading>
<Heading size="4xl">Page Title</Heading>
<Heading size="2xl">Section</Heading>
<Heading size="lg">Subsection</Heading>

// Text
<Text>Default text</Text>
<Text size="sm" color="muted">Small muted text</Text>
<Text weight="bold" color="primary">Bold primary</Text>

// Code
<Code>inline code</Code>
<CodeBlock language="typescript">{code}</CodeBlock>
```

### Form System

The form system is built on react-hook-form:

```tsx
import { Form, FormField, FormSubmitButton, TextField } from '@umami/react-zen';

function LoginForm() {
  const handleSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit} defaultValues={{ email: '', password: '' }}>
      <FormField
        name="email"
        label="Email"
        description="We'll never share your email"
        rules={{ required: 'Email is required' }}
      >
        <TextField type="email" />
      </FormField>

      <FormField
        name="password"
        label="Password"
        rules={{ required: 'Password is required', minLength: 8 }}
      >
        <PasswordField />
      </FormField>

      <FormButtons>
        <FormResetButton>Reset</FormResetButton>
        <FormSubmitButton variant="primary">Login</FormSubmitButton>
      </FormButtons>
    </Form>
  );
}
```

#### Form Fields

```tsx
// Text input
<TextField placeholder="Enter text" />

// Password with visibility toggle
<PasswordField />

// Search with debouncing
<SearchField onSearch={handleSearch} delay={300} />

// Checkbox
<Checkbox>Remember me</Checkbox>

// Radio group
<RadioGroup label="Size">
  <Radio value="sm">Small</Radio>
  <Radio value="md">Medium</Radio>
  <Radio value="lg">Large</Radio>
</RadioGroup>

// Switch
<Switch>Enable notifications</Switch>

// Toggle buttons
<ToggleGroup>
  <Toggle id="bold">Bold</Toggle>
  <Toggle id="italic">Italic</Toggle>
</ToggleGroup>
```

#### Dynamic Field Arrays

```tsx
<FormFieldArray name="items" label="Items">
  {({ fields, append, remove }) => (
    <>
      {fields.map((field, index) => (
        <Row key={field.id} gap="2">
          <FormField name={`items.${index}.name`}>
            <TextField />
          </FormField>
          <Button onClick={() => remove(index)}>Remove</Button>
        </Row>
      ))}
      <Button onClick={() => append({ name: '' })}>Add Item</Button>
    </>
  )}
</FormFieldArray>
```

### Select & ComboBox

```tsx
// Basic select
<Select label="Country">
  <ListItem id="us">United States</ListItem>
  <ListItem id="uk">United Kingdom</ListItem>
  <ListItem id="ca">Canada</ListItem>
</Select>

// Searchable select
<Select label="Country" allowSearch onSearch={handleSearch}>
  <ListItem id="us">United States</ListItem>
  <ListItem id="uk">United Kingdom</ListItem>
</Select>

// With sections
<Select label="Location">
  <ListSection title="North America">
    <ListItem id="us">United States</ListItem>
    <ListItem id="ca">Canada</ListItem>
  </ListSection>
  <ListSection title="Europe">
    <ListItem id="uk">United Kingdom</ListItem>
    <ListItem id="de">Germany</ListItem>
  </ListSection>
</Select>

// ComboBox (allows custom input)
<ComboBox label="Fruit" allowsCustomValue>
  <ListItem id="apple">Apple</ListItem>
  <ListItem id="banana">Banana</ListItem>
</ComboBox>
```

### List

```tsx
<List selectionMode="single" onSelectionChange={handleSelect}>
  <ListItem id="1">Option 1</ListItem>
  <ListItem id="2">Option 2</ListItem>
  <ListSeparator />
  <ListItem id="3">Option 3</ListItem>
</List>
```

### Dialogs & Modals

```tsx
// Confirmation dialog
<ConfirmationDialog
  title="Delete item?"
  message="This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
>
  <Button variant="danger">Delete</Button>
</ConfirmationDialog>

// Alert dialog
<AlertDialog title="Error" message="Something went wrong">
  <Button>Show Error</Button>
</AlertDialog>

// Custom dialog
<DialogTrigger>
  <Button>Open</Button>
  <Modal position="center">
    <Dialog>
      <Heading slot="title">Dialog Title</Heading>
      <Text>Dialog content</Text>
    </Dialog>
  </Modal>
</DialogTrigger>
```

Modal positions: `center`, `left`, `right`, `top`, `bottom`, `fullscreen`

### Feedback Components

```tsx
// Alert
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>Informational message</AlertDescription>
</Alert>
<Alert variant="danger">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

// Empty state
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon"><Inbox /></EmptyMedia>
    <EmptyTitle>No messages</EmptyTitle>
    <EmptyDescription>New messages will appear here.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button>Compose</Button></EmptyContent>
</Empty>

// Loading indicators
<Loading />
<Spinner size="lg" />
<ProgressBar value={75} />
<ProgressCircle value={50} />

// Status light
<StatusLight variant="success">Active</StatusLight>
<StatusLight variant="error">Failed</StatusLight>
```

### Toast Notifications

```tsx
import { useToast } from '@umami/react-zen';

function MyComponent() {
  const { toast } = useToast();

  const showToast = () => {
    toast('Operation successful', {
      variant: 'success',
      duration: 3000,
    });
  };

  const showToastWithActions = () => {
    toast('File deleted', {
      title: 'Deleted',
      variant: 'info',
      actions: ['Undo', 'Dismiss'],
      onClose: (action) => {
        if (action === 'Undo') {
          // Handle undo
        }
      },
    });
  };

  return <Button onClick={showToast}>Show Toast</Button>;
}
```

### Tooltips & Popovers

```tsx
// Tooltip
<Tooltip content="Helpful information">
  <Button>Hover me</Button>
</Tooltip>

// Popover
<Popover trigger={<Button>Click me</Button>}>
  <Text>Popover content</Text>
</Popover>
```

### Menu

```tsx
<MenuTrigger>
  <Button>Options</Button>
  <Menu onAction={handleAction}>
    <MenuItem id="edit">Edit</MenuItem>
    <MenuItem id="duplicate">Duplicate</MenuItem>
    <MenuSeparator />
    <MenuItem id="delete">Delete</MenuItem>
  </Menu>
</MenuTrigger>
```

### Sidebar

Composable app sidebar (shadcn/ui port on Base UI). Collapses off canvas or to icons on desktop, renders as a `Sheet` below `md`, and toggles with Cmd/Ctrl+B.

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
              <SidebarMenuBadge>12</SidebarMenuBadge>
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

// Read or change state from any child
const { state, open, setOpen, isMobile, toggleSidebar } = useSidebar();
```

`variant`: `sidebar` | `floating` | `inset`. `collapsible`: `offcanvas` | `icon` | `none`. `side`: `left` | `right`. Control with `open`/`onOpenChange` on `SidebarProvider`; disable the shortcut with `keyboardShortcut={false}`.

### Tables

```tsx
<Table>
  <TableHeader>
    <TableColumn>Name</TableColumn>
    <TableColumn>Email</TableColumn>
    <TableColumn>Status</TableColumn>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell><StatusLight variant="success">Active</StatusLight></TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Icons

```tsx
import { Icon, Check, ChevronRight, X } from '@umami/react-zen';

// Built-in icons
<Check />
<ChevronRight />
<X />

// Icon wrapper with props
<Icon size="lg" color="primary">
  <Check />
</Icon>

// Icon sizes: xs, sm, md, lg, xl
// Icon colors: primary, muted, disabled, or any theme color
```

### Badges

```tsx
// Semantic variants
<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>

// Color variants — every Tailwind base color is supported:
// slate, gray, zinc, neutral, stone, red, orange, amber, yellow, lime,
// green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia,
// pink, rose
<Badge variant="blue">Blue</Badge>
<Badge variant="emerald">Emerald</Badge>
<Badge variant="rose">Rose</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

Color variants use a soft tint that stays readable in both light and dark themes.

### Tags

```tsx
<TagGroup
  label="Skills"
  items={[
    { id: '1', name: 'React' },
    { id: '2', name: 'TypeScript' },
  ]}
  onRemove={handleRemove}
/>
```

### Calendar

```tsx
<Calendar
  value={selectedDate}
  onChange={setSelectedDate}
  minValue={today}
/>
```

## Theming

### useTheme Hook

```tsx
import { useTheme } from '@umami/react-zen';

function ThemeControls() {
  const { theme, palette, setTheme, setPalette } = useTheme();

  return (
    <Row gap="2">
      <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </Button>
      <Select value={palette} onChange={setPalette}>
        <ListItem id="neutral">Neutral</ListItem>
        <ListItem id="slate">Slate</ListItem>
        <ListItem id="zinc">Zinc</ListItem>
      </Select>
    </Row>
  );
}
```

### Semantic Colors

Use semantic color tokens for consistent theming:

**Text colors:** `foreground-primary`, `foreground-muted`, `foreground-disabled`

**Background colors:** `surface-base`, `surface-raised`, `surface-sunken`, `surface-overlay`, `surface-inverted`

**Interactive colors:** `interactive`, `interactive-hover`, `interactive-pressed`

**Status colors:** `status-error`, `status-success`, `status-warning`, `status-info`

```tsx
<Text color="foreground-muted">Muted text</Text>
<Box backgroundColor="surface-raised">Raised surface</Box>
<Box backgroundColor="status-success">Success background</Box>
```

## Utility Hooks

### useBreakpoint

```tsx
import { useBreakpoint } from '@umami/react-zen';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();

  if (breakpoint === 'base' || breakpoint === 'sm') {
    return <MobileView />;
  }
  return <DesktopView />;
}
```

### useDebounce

```tsx
import { useDebounce } from '@umami/react-zen';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      search(debouncedQuery);
    }
  }, [debouncedQuery]);

  return <TextField value={query} onChange={setQuery} />;
}
```

## Render Props Pattern

Many components support custom rendering via the `render` prop:

```tsx
// Render as a link
<Button render={<a href="/page" />}>Go to page</Button>

// Render with router Link
<Button render={<Link to="/page" />}>Navigate</Button>

// Render function for full control
<Button render={(props) => <CustomComponent {...props} />}>
  Custom
</Button>
```

## TypeScript

All components are fully typed. Key types:

```tsx
import type {
  ButtonProps,
  TextProps,
  BoxProps,
  FormFieldProps,
  Responsive,
  FontColor,
  BackgroundColor,
} from '@umami/react-zen';

// Responsive type for props
type Responsive<T> = T | Partial<Record<'base'|'sm'|'md'|'lg'|'xl'|'2xl', T>>;
```

## Best Practices

1. **Use semantic colors** instead of raw Tailwind colors for theme consistency
2. **Prefer component props over raw `className`** — reach for a component's built-in props (e.g. `<Box color="muted">` rather than `<Box className="text-foreground-muted">`) so styling stays theme-aware and consistent
3. **Use responsive props** for mobile-first responsive design
4. **Use FormField** wrapper for all form inputs to get labels, descriptions, and error handling
5. **Use Row/Column** for simple layouts, Flexbox for complex ones
6. **Use composition** - components are designed to work together
7. **Leverage render props** when you need custom element rendering

## Component Reference

| Category | Components |
|----------|------------|
| Layout | Box, Flexbox, Row, Column, Grid, Container, Navbar, Sidebar |
| Buttons | Button, LoadingButton, CopyButton, ThemeButton |
| Typography | Text, Heading, Label, Code, CodeBlock, Blockquote |
| Forms | Form, FormField, FormFieldArray, FormSubmitButton, FormResetButton |
| Inputs | TextField, PasswordField, SearchField, Checkbox, RadioGroup, Switch, Toggle |
| Selection | Select, ComboBox, List, ListItem, ListSection, TagGroup |
| Feedback | Alert, Empty, Toast, Loading, Spinner, ProgressBar, StatusLight, Badge |
| Overlays | Dialog, Modal, AlertDialog, ConfirmationDialog, Popover, Tooltip, Menu |
| Data | Table, DataTable, DataCard, Breadcrumbs |
| Media | Image, Icon |
| Theme | ZenProvider, ThemeSwitcher, PaletteSwitcher |
