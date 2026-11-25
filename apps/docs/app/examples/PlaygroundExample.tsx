'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  Badge,
  Blockquote,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Calendar,
  Checkbox,
  Code,
  Column,
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  DataCard,
  DataColumn,
  DataTable,
  Dots,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Grid,
  Heading,
  Kbd,
  KbdGroup,
  Label,
  List,
  ListItem,
  LoadingButton,
  Meter,
  PageHeader,
  PageHeaderActions,
  PageHeaderTitle,
  PasswordField,
  Progress,
  ProgressCircle,
  RadioGroup,
  RadioGroupItem,
  Row,
  SearchField,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Skeleton,
  Slider,
  Spinner,
  StatusLight,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tag,
  TagGroup,
  Text,
  TextField,
  Toggle,
  useToast,
} from '@umami/react-zen';
import { FileArchive, Inbox, Layers, Settings, Sparkles, Trash2, Users } from 'lucide-react';
import { useRef, useState } from 'react';

// Tailwind color palette
const tailwindColors = [
  // White/Black
  { label: 'white', value: '#ffffff' },
  { label: 'black', value: '#000000' },
  // Neutral
  { label: 'neutral-50', value: '#fafafa' },
  { label: 'neutral-100', value: '#f5f5f5' },
  { label: 'neutral-200', value: '#e5e5e5' },
  { label: 'neutral-300', value: '#d4d4d4' },
  { label: 'neutral-400', value: '#a3a3a3' },
  { label: 'neutral-500', value: '#737373' },
  { label: 'neutral-600', value: '#525252' },
  { label: 'neutral-700', value: '#404040' },
  { label: 'neutral-800', value: '#262626' },
  { label: 'neutral-900', value: '#171717' },
  { label: 'neutral-950', value: '#0a0a0a' },
  // Slate
  { label: 'slate-50', value: '#f8fafc' },
  { label: 'slate-100', value: '#f1f5f9' },
  { label: 'slate-200', value: '#e2e8f0' },
  { label: 'slate-300', value: '#cbd5e1' },
  { label: 'slate-400', value: '#94a3b8' },
  { label: 'slate-500', value: '#64748b' },
  { label: 'slate-600', value: '#475569' },
  { label: 'slate-700', value: '#334155' },
  { label: 'slate-800', value: '#1e293b' },
  { label: 'slate-900', value: '#0f172a' },
  // Blue
  { label: 'blue-50', value: '#eff6ff' },
  { label: 'blue-100', value: '#dbeafe' },
  { label: 'blue-200', value: '#bfdbfe' },
  { label: 'blue-300', value: '#93c5fd' },
  { label: 'blue-400', value: '#60a5fa' },
  { label: 'blue-500', value: '#3b82f6' },
  { label: 'blue-600', value: '#2563eb' },
  { label: 'blue-700', value: '#1d4ed8' },
  { label: 'blue-800', value: '#1e40af' },
  { label: 'blue-900', value: '#1e3a8a' },
  // Green
  { label: 'green-50', value: '#f0fdf4' },
  { label: 'green-100', value: '#dcfce7' },
  { label: 'green-200', value: '#bbf7d0' },
  { label: 'green-300', value: '#86efac' },
  { label: 'green-400', value: '#4ade80' },
  { label: 'green-500', value: '#22c55e' },
  { label: 'green-600', value: '#16a34a' },
  { label: 'green-700', value: '#15803d' },
  { label: 'green-800', value: '#166534' },
  { label: 'green-900', value: '#14532d' },
  // Yellow
  { label: 'yellow-50', value: '#fefce8' },
  { label: 'yellow-100', value: '#fef9c3' },
  { label: 'yellow-200', value: '#fef08a' },
  { label: 'yellow-300', value: '#fde047' },
  { label: 'yellow-400', value: '#facc15' },
  { label: 'yellow-500', value: '#eab308' },
  { label: 'yellow-600', value: '#ca8a04' },
  { label: 'yellow-700', value: '#a16207' },
  { label: 'yellow-800', value: '#854d0e' },
  { label: 'yellow-900', value: '#713f12' },
  // Red
  { label: 'red-50', value: '#fef2f2' },
  { label: 'red-100', value: '#fee2e2' },
  { label: 'red-200', value: '#fecaca' },
  { label: 'red-300', value: '#fca5a5' },
  { label: 'red-400', value: '#f87171' },
  { label: 'red-500', value: '#ef4444' },
  { label: 'red-600', value: '#dc2626' },
  { label: 'red-700', value: '#b91c1c' },
  { label: 'red-800', value: '#991b1b' },
  { label: 'red-900', value: '#7f1d1d' },
  // Orange
  { label: 'orange-50', value: '#fff7ed' },
  { label: 'orange-100', value: '#ffedd5' },
  { label: 'orange-200', value: '#fed7aa' },
  { label: 'orange-300', value: '#fdba74' },
  { label: 'orange-400', value: '#fb923c' },
  { label: 'orange-500', value: '#f97316' },
  { label: 'orange-600', value: '#ea580c' },
  { label: 'orange-700', value: '#c2410c' },
  { label: 'orange-800', value: '#9a3412' },
  { label: 'orange-900', value: '#7c2d12' },
  // Purple
  { label: 'purple-50', value: '#faf5ff' },
  { label: 'purple-100', value: '#f3e8ff' },
  { label: 'purple-200', value: '#e9d5ff' },
  { label: 'purple-300', value: '#d8b4fe' },
  { label: 'purple-400', value: '#c084fc' },
  { label: 'purple-500', value: '#a855f7' },
  { label: 'purple-600', value: '#9333ea' },
  { label: 'purple-700', value: '#7e22ce' },
  { label: 'purple-800', value: '#6b21a8' },
  { label: 'purple-900', value: '#581c87' },
  // Pink
  { label: 'pink-50', value: '#fdf2f8' },
  { label: 'pink-100', value: '#fce7f3' },
  { label: 'pink-200', value: '#fbcfe8' },
  { label: 'pink-300', value: '#f9a8d4' },
  { label: 'pink-400', value: '#f472b6' },
  { label: 'pink-500', value: '#ec4899' },
  { label: 'pink-600', value: '#db2777' },
  { label: 'pink-700', value: '#be185d' },
  { label: 'pink-800', value: '#9d174d' },
  { label: 'pink-900', value: '#831843' },
];

// Sentinel for "use the value from the active palette and color mode".
const THEME_DEFAULT = 'theme';

const colorOptions = [{ label: 'Theme default', value: THEME_DEFAULT }, ...tailwindColors];

// Preset value options
const radiusOptions = [
  { label: 'Theme default', value: THEME_DEFAULT },
  { label: 'none', value: '0rem' },
  { label: 'sm', value: '0.3rem' },
  { label: 'md', value: '0.5rem' },
  { label: 'lg', value: '0.75rem' },
  { label: 'xl', value: '1rem' },
];

const fontOptions = [
  { label: 'Theme default', value: THEME_DEFAULT },
  { label: 'System', value: 'system-ui, sans-serif' },
  { label: 'Inter', value: "'Inter', sans-serif" },
  { label: 'Roboto', value: "'Roboto', sans-serif" },
  { label: 'Open Sans', value: "'Open Sans', sans-serif" },
  { label: 'Lato', value: "'Lato', sans-serif" },
  { label: 'Montserrat', value: "'Montserrat', sans-serif" },
  { label: 'Poppins', value: "'Poppins', sans-serif" },
  { label: 'Nunito', value: "'Nunito', sans-serif" },
  { label: 'PT Sans', value: "'PT Sans', sans-serif" },
];

const fontMonoOptions = [
  { label: 'Theme default', value: THEME_DEFAULT },
  { label: 'System Mono', value: 'ui-monospace, monospace' },
  { label: 'JetBrains Mono', value: "'JetBrains Mono', monospace" },
  { label: 'Fira Code', value: "'Fira Code', monospace" },
  { label: 'Source Code Pro', value: "'Source Code Pro', monospace" },
  { label: 'IBM Plex Mono', value: "'IBM Plex Mono', monospace" },
  { label: 'Roboto Mono', value: "'Roboto Mono', monospace" },
  { label: 'Inconsolata', value: "'Inconsolata', monospace" },
  { label: 'Space Mono', value: "'Space Mono', monospace" },
];

interface SelectOption {
  label: string;
  value: string;
}

interface CSSVariable {
  name: string;
  label: string;
  type: 'color' | 'select';
  options: SelectOption[];
}

function colorVariable(name: string, label: string): CSSVariable {
  return { name, label, type: 'color', options: colorOptions };
}

// Shape and fonts
const defaultsVariables: CSSVariable[] = [
  { name: '--radius', label: 'Radius', type: 'select', options: radiusOptions },
  { name: '--font-sans', label: 'Font Sans', type: 'select', options: fontOptions },
  { name: '--font-mono', label: 'Font Mono', type: 'select', options: fontMonoOptions },
];

// Brand color for default buttons, badges, switches and sliders
const primaryVariables: CSSVariable[] = [
  colorVariable('--primary', 'Primary'),
  colorVariable('--primary-foreground', 'Primary foreground'),
];

// Backgrounds
const surfaceVariables: CSSVariable[] = [
  colorVariable('--background', 'Background'),
  colorVariable('--card', 'Card'),
  colorVariable('--popover', 'Popover'),
  colorVariable('--secondary', 'Secondary'),
  colorVariable('--muted', 'Muted'),
  colorVariable('--accent', 'Accent'),
];

// Text colors
const textVariables: CSSVariable[] = [
  colorVariable('--foreground', 'Foreground'),
  colorVariable('--muted-foreground', 'Muted foreground'),
  colorVariable('--secondary-foreground', 'Secondary foreground'),
  colorVariable('--accent-foreground', 'Accent foreground'),
];

// Borders, inputs and focus rings
const borderVariables: CSSVariable[] = [
  colorVariable('--border', 'Border'),
  colorVariable('--input', 'Input'),
  colorVariable('--ring', 'Ring'),
];

// Status colors (destructive is shadcn, the rest are Zen extensions)
const statusVariables: CSSVariable[] = [
  colorVariable('--destructive', 'Destructive'),
  colorVariable('--success', 'Success'),
  colorVariable('--warning', 'Warning'),
  colorVariable('--info', 'Info'),
];

const allVariables = [
  ...defaultsVariables,
  ...primaryVariables,
  ...surfaceVariables,
  ...textVariables,
  ...borderVariables,
  ...statusVariables,
];

function ColorChip({ color }: { color: string }) {
  return (
    <Box
      width="4"
      height="4"
      borderRadius="sm"
      border
      flexShrink="0"
      style={{ backgroundColor: color === THEME_DEFAULT ? 'transparent' : color }}
    />
  );
}

function VariableInput({
  variable,
  value,
  onChange,
}: {
  variable: CSSVariable;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  const id = `playground${variable.name}`;

  return (
    <Field>
      <FieldLabel htmlFor={id}>{variable.label}</FieldLabel>
      <Select
        items={variable.options}
        value={value}
        onValueChange={next => onChange(variable.name, (next as string) ?? THEME_DEFAULT)}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue>
            {(current: string) => {
              const option = variable.options.find(opt => opt.value === current);
              if (variable.type === 'color') {
                return (
                  <Row gap="2" alignItems="center">
                    <ColorChip color={current} />
                    <Text size="sm">{option?.label ?? current}</Text>
                  </Row>
                );
              }
              return option?.label ?? current;
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {variable.options.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {variable.type === 'color' ? (
                <Row gap="2" alignItems="center">
                  <ColorChip color={opt.value} />
                  <Text size="sm">{opt.label}</Text>
                </Row>
              ) : (
                opt.label
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function VariableSection({
  title,
  variables,
  values,
  onChange,
}: {
  title: string;
  variables: CSSVariable[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <Column gap="3" paddingX="1" paddingY="2">
          {variables.map(variable => (
            <VariableInput
              key={variable.name}
              variable={variable}
              value={values[variable.name] ?? THEME_DEFAULT}
              onChange={onChange}
            />
          ))}
        </Column>
      </AccordionContent>
    </AccordionItem>
  );
}

// Load Google Font dynamically
const loadGoogleFont = (fontFamily: string) => {
  // Extract font name from value like "'Inter', sans-serif"
  const match = fontFamily.match(/'([^']+)'/);
  if (!match) return; // Skip system fonts

  const fontName = match[1];
  const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;

  // Check if already loaded
  if (document.getElementById(fontId)) return;

  // Create and append link element
  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
  document.head.appendChild(link);
};

const frameworks = ['React', 'Vue', 'Svelte', 'Solid', 'Angular'];

const roles = [
  { label: 'Designer', value: 'designer' },
  { label: 'Engineer', value: 'engineer' },
  { label: 'Manager', value: 'manager' },
];

const plans = [
  { label: 'Starter', value: 'starter' },
  { label: 'Professional', value: 'pro' },
  { label: 'Enterprise', value: 'enterprise' },
];

function SectionTitle({ children }: { children: string }) {
  return (
    <Text size="xs" weight="semibold" color="muted">
      {children}
    </Text>
  );
}

export function PlaygroundExample() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});

  const [watching, setWatching] = useState(true);
  const [notifyTeammates, setNotifyTeammates] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [sliderValue, setSliderValue] = useState(65);
  const [calendarValue, setCalendarValue] = useState<Date | undefined>(new Date());
  const [menuView, setMenuView] = useState('overview');

  const handleChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));

    const container = containerRef.current;
    if (!container) return;

    if (value === THEME_DEFAULT) {
      container.style.removeProperty(name);
      return;
    }

    // Load Google Font if it's a font-family change
    if (name === '--font-sans' || name === '--font-mono') {
      loadGoogleFont(value);
    }

    container.style.setProperty(name, value);
  };

  const handleReset = () => {
    setValues({});
    allVariables.forEach(v => {
      containerRef.current?.style.removeProperty(v.name);
    });
  };

  const handleExport = () => {
    const css = Object.entries(values)
      .filter(([, value]) => value !== THEME_DEFAULT)
      .map(([name, value]) => `  ${name}: ${value};`)
      .join('\n');
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    toast('CSS variables copied to clipboard');
  };

  return (
    <Box
      ref={containerRef}
      backgroundColor="background"
      color="foreground"
      borderRadius="lg"
      border
      overflow="hidden"
      className="font-sans"
    >
      <Row alignItems="stretch">
        {/* Controls Sidebar */}
        <Box
          backgroundColor="muted"
          padding="6"
          width="300px"
          border="left"
          flexShrink="0"
          order={2}
        >
          <Column gap="3">
            <Row justifyContent="space-between" alignItems="center">
              <SectionTitle>CSS VARIABLES</SectionTitle>
              <Row gap="2">
                <Button variant="outline" size="xs" onClick={handleExport}>
                  Copy
                </Button>
                <Button variant="outline" size="xs" onClick={handleReset}>
                  Reset
                </Button>
              </Row>
            </Row>

            <Accordion multiple defaultValue={['Defaults', 'Primary']}>
              <VariableSection
                title="Defaults"
                variables={defaultsVariables}
                values={values}
                onChange={handleChange}
              />
              <VariableSection
                title="Primary"
                variables={primaryVariables}
                values={values}
                onChange={handleChange}
              />
              <VariableSection
                title="Surfaces"
                variables={surfaceVariables}
                values={values}
                onChange={handleChange}
              />
              <VariableSection
                title="Text"
                variables={textVariables}
                values={values}
                onChange={handleChange}
              />
              <VariableSection
                title="Borders"
                variables={borderVariables}
                values={values}
                onChange={handleChange}
              />
              <VariableSection
                title="Status"
                variables={statusVariables}
                values={values}
                onChange={handleChange}
              />
            </Accordion>
          </Column>
        </Box>

        {/* Preview Content */}
        <Box padding="8" flexGrow="1" minWidth="0">
          <Column gap="12">
            {/* Page structure */}
            <Column gap="3">
              <SectionTitle>PAGE STRUCTURE & NAVIGATION</SectionTitle>
              <Column gap="6">
                <PageHeader>
                  <PageHeaderTitle
                    breadcrumb={
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="#playground">Workspace</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbPage>Overview</BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    }
                    title="Design system preview"
                    description="See token changes across the component library."
                  />
                  <PageHeaderActions>
                    <Button variant="outline">Share</Button>
                    <Button>Create</Button>
                  </PageHeaderActions>
                </PageHeader>
                <Tabs defaultValue="preview">
                  <TabsList>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="tokens">Tokens</TabsTrigger>
                    <TabsTrigger value="disabled" disabled>
                      Disabled
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                    <Text>Components inherit the variables configured in the sidebar.</Text>
                  </TabsContent>
                  <TabsContent value="tokens">
                    <Text>Token values update immediately.</Text>
                  </TabsContent>
                  <TabsContent value="disabled">
                    <Text>Disabled tab content.</Text>
                  </TabsContent>
                </Tabs>
              </Column>
            </Column>

            {/* Typography */}
            <Column gap="3">
              <SectionTitle>TYPOGRAPHY</SectionTitle>
              <Heading size="2xl">The quick brown fox</Heading>
              <Text>Regular text using the --font-sans variable.</Text>
              <Text size="sm" color="muted">
                Muted text provides supporting context and secondary information.
              </Text>
              <Text>
                Inline values such as <Code>--muted-foreground</Code> use the monospace font.
              </Text>
              <Blockquote>
                Good design makes the relationship between content and action feel obvious.
              </Blockquote>
            </Column>

            {/* Surfaces and layout defaults */}
            <Column gap="3">
              <SectionTitle>LAYOUT, SURFACES & DEFAULTS</SectionTitle>
              <Grid columns={{ base: '1', xl: '3' }} gap="3">
                <Box backgroundColor="background" border borderRadius padding="3" minWidth="100px">
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Background
                    </Text>
                    <Text>Foreground text</Text>
                  </Column>
                </Box>
                <Box backgroundColor="card" border borderRadius padding="3" minWidth="100px">
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Card
                    </Text>
                    <Text color="card-foreground">Card foreground</Text>
                  </Column>
                </Box>
                <Box backgroundColor="muted" border borderRadius padding="3" minWidth="100px">
                  <Column gap="1">
                    <Text size="xs" color="muted">
                      Muted
                    </Text>
                    <Text color="muted">Muted foreground</Text>
                  </Column>
                </Box>
              </Grid>
              <Row gap="3" wrap="wrap">
                <Box border borderRadius padding shadow>
                  <Text>borderRadius, padding, shadow</Text>
                </Box>
                <Row gap border borderRadius padding>
                  <Text>Item 1</Text>
                  <Text>Item 2</Text>
                  <Text>Item 3</Text>
                </Row>
              </Row>
            </Column>

            {/* Borders */}
            <Column gap="3">
              <SectionTitle>BORDERS</SectionTitle>
              <Row gap="3" wrap="wrap">
                <Box border borderRadius padding="3">
                  <Text>Border</Text>
                </Box>
                <Box borderColor="input" border borderRadius padding="3">
                  <Text>Input border</Text>
                </Box>
                <Box borderColor="ring" border borderRadius padding="3">
                  <Text>Ring border</Text>
                </Box>
              </Row>
            </Column>

            {/* Actions */}
            <Column gap="3">
              <SectionTitle>ACTIONS</SectionTitle>
              <Row gap="3" wrap="wrap" alignItems="center">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <LoadingButton loading>Loading</LoadingButton>
              </Row>
              <Row gap="3" wrap="wrap">
                <Button variant="outline" onClick={() => toast('The toast component is working')}>
                  Show toast
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </Row>
            </Column>

            {/* Form fields */}
            <Column gap="3">
              <SectionTitle>FORM FIELDS</SectionTitle>
              <Grid columns={{ base: '1', xl: '2' }} gap="4">
                <TextField label="Name" placeholder="Ada Lovelace" />
                <PasswordField label="Password" defaultValue="password" />
                <SearchField label="Search" placeholder="Search components..." />
                <Field>
                  <FieldLabel htmlFor="playground-role">Role</FieldLabel>
                  <Select items={roles} defaultValue="designer">
                    <SelectTrigger id="playground-role" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="playground-framework">Framework</FieldLabel>
                  <Combobox items={frameworks} defaultValue="React">
                    <ComboboxInput id="playground-framework" placeholder="Select a framework" />
                    <ComboboxContent>
                      <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item: string) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </Field>
                <TextField label="Read only" value="Locked value" readOnly />
              </Grid>
            </Column>

            {/* Selection controls */}
            <Column gap="3">
              <SectionTitle>SELECTION CONTROLS</SectionTitle>
              <Column gap="6">
                <Row gap="5" wrap="wrap" alignItems="center">
                  <Toggle variant="outline" pressed={watching} onPressedChange={setWatching}>
                    {watching ? 'Watching' : 'Watch'}
                  </Toggle>
                  <Field orientation="horizontal" className="w-auto">
                    <Checkbox
                      id="playground-notify"
                      checked={notifyTeammates}
                      onCheckedChange={setNotifyTeammates}
                    />
                    <FieldLabel htmlFor="playground-notify">Notify teammates</FieldLabel>
                  </Field>
                  <Field orientation="horizontal" className="w-auto">
                    <Switch
                      id="playground-public"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                    <FieldLabel htmlFor="playground-public">Public project</FieldLabel>
                  </Field>
                </Row>
                <FieldSet>
                  <FieldLegend variant="label">Plan</FieldLegend>
                  <RadioGroup defaultValue="pro">
                    {plans.map(plan => (
                      <Field key={plan.value} orientation="horizontal">
                        <RadioGroupItem value={plan.value} id={`playground-plan-${plan.value}`} />
                        <FieldLabel htmlFor={`playground-plan-${plan.value}`}>
                          {plan.label}
                        </FieldLabel>
                      </Field>
                    ))}
                  </RadioGroup>
                </FieldSet>
                <Column maxWidth="md" gap="3">
                  <Label>Upload progress: {sliderValue}%</Label>
                  <Slider
                    aria-label="Upload progress"
                    value={sliderValue}
                    onValueChange={value =>
                      setSliderValue(Array.isArray(value) ? value[0] : (value as number))
                    }
                    min={0}
                    max={100}
                  />
                </Column>
              </Column>
            </Column>

            {/* Data display */}
            <Column gap="3">
              <SectionTitle>DATA DISPLAY</SectionTitle>
              <Column gap="6">
                <Grid columns={{ base: '1', xl: '2' }} gap="5">
                  <DataCard
                    data={[
                      { label: 'Owner', value: 'Ada Lovelace' },
                      { label: 'Status', value: 'Active' },
                      { label: 'Updated', value: 'Today' },
                    ]}
                  />
                  <Box border borderRadius="lg" padding="3">
                    <List
                      label="Recent projects"
                      selectionMode="single"
                      defaultValue={['analytics']}
                    >
                      <ListItem value="analytics">Analytics dashboard</ListItem>
                      <ListItem value="commerce">Commerce storefront</ListItem>
                      <ListItem value="docs">Documentation site</ListItem>
                    </List>
                  </Box>
                </Grid>
                <TagGroup label="Technologies">
                  <Tag value="react">React</Tag>
                  <Tag value="typescript" variant="outline">
                    TypeScript
                  </Tag>
                  <Tag value="css" variant="secondary">
                    CSS
                  </Tag>
                </TagGroup>
                <Box overflow="auto">
                  <DataTable
                    data={[
                      { id: 'one', component: 'Button', category: 'Actions', status: 'Stable' },
                      { id: 'two', component: 'DataTable', category: 'Data', status: 'Stable' },
                      { id: 'three', component: 'Calendar', category: 'Input', status: 'Stable' },
                    ]}
                  >
                    <DataColumn id="component" label="Component" width="1.5fr" />
                    <DataColumn id="category" label="Category" />
                    <DataColumn id="status" label="Status" />
                  </DataTable>
                </Box>
              </Column>
            </Column>

            {/* Menu and calendar */}
            <Column gap="3">
              <SectionTitle>MENU & CALENDAR</SectionTitle>
              <Column gap="6">
                <Row gap="3" wrap="wrap" alignItems="center">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                      <Layers />
                      Workspace
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>View</DropdownMenuLabel>
                        <DropdownMenuRadioGroup value={menuView} onValueChange={setMenuView}>
                          <DropdownMenuRadioItem value="overview">
                            <Layers />
                            Overview
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="activity">
                            <Sparkles />
                            Activity
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Settings />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>Disabled item</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Row>
                <Box border borderRadius="lg" width="fit">
                  <Calendar mode="single" selected={calendarValue} onSelect={setCalendarValue} />
                </Box>
              </Column>
            </Column>

            {/* Progress and loading */}
            <Column gap="3">
              <SectionTitle>PROGRESS & LOADING</SectionTitle>
              <Column gap="6">
                <Grid columns="1" gap="5">
                  <Box border borderRadius="lg" padding="5">
                    <Column gap="4">
                      <Row gap="3" alignItems="center">
                        <Box backgroundColor="muted" borderRadius="md" padding="2">
                          <FileArchive size={20} />
                        </Box>
                        <Column gap="1" flexGrow="1">
                          <Text weight="semibold">Uploading brand-assets.zip</Text>
                          <Text size="sm" color="muted">
                            42.6 MB of 65.5 MB
                          </Text>
                        </Column>
                        <Text size="sm" weight="semibold">
                          {sliderValue}%
                        </Text>
                      </Row>
                      <Progress value={sliderValue} aria-label="Upload progress" />
                      <Row justifyContent="space-between" alignItems="center">
                        <Row gap="2" alignItems="center">
                          <Spinner />
                          <Text size="sm" color="muted">
                            Encrypting and uploading
                          </Text>
                        </Row>
                        <Button variant="ghost" size="xs">
                          Cancel
                        </Button>
                      </Row>
                    </Column>
                  </Box>
                  <Box border borderRadius="lg" padding="5">
                    <Row gap="5" alignItems="center">
                      <ProgressCircle value={sliderValue} showPercentage />
                      <Column gap="2">
                        <Row gap="2" alignItems="center">
                          <Users size={18} />
                          <Text weight="semibold">Importing contacts</Text>
                        </Row>
                        <Text size="sm" color="muted">
                          650 of 1,000 records imported
                        </Text>
                        <Row gap="2" alignItems="center">
                          <Dots size="sm" />
                          <Text size="sm" color="muted">
                            Checking for duplicates
                          </Text>
                        </Row>
                      </Column>
                    </Row>
                  </Box>
                </Grid>
                <Grid columns="1" gap="5">
                  <Box border borderRadius="lg" padding="4">
                    <Row gap="3" alignItems="center">
                      <Skeleton className="size-10 shrink-0 rounded-full" />
                      <Column gap="2" flexGrow="1">
                        <Skeleton className="h-4 w-[45%]" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </Column>
                    </Row>
                  </Box>
                  <Box border borderRadius="lg">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Inbox />
                        </EmptyMedia>
                        <EmptyTitle>No messages</EmptyTitle>
                        <EmptyDescription>New messages will appear here.</EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button>Compose</Button>
                      </EmptyContent>
                    </Empty>
                  </Box>
                </Grid>
              </Column>
            </Column>

            {/* Display */}
            <Column gap="3">
              <SectionTitle>DISPLAY</SectionTitle>
              <Column gap="6">
                <Row gap="5" wrap="wrap" alignItems="center">
                  <AvatarGroup>
                    <Avatar>
                      <AvatarFallback>AL</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>GH</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                  </AvatarGroup>
                  <Avatar size="sm">
                    <AvatarFallback>LT</AvatarFallback>
                  </Avatar>
                  <Text size="sm" color="muted">
                    Press{' '}
                    <KbdGroup>
                      <Kbd>⌘</Kbd>
                      <Kbd>K</Kbd>
                    </KbdGroup>{' '}
                    to search
                  </Text>
                </Row>
                <Column maxWidth="md">
                  <Meter label="Storage used" value={60} showValue />
                </Column>
                <Separator />
                <Box overflow="auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Ada Lovelace</TableCell>
                        <TableCell>Designer</TableCell>
                        <TableCell>
                          <StatusLight variant="success">Active</StatusLight>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Grace Hopper</TableCell>
                        <TableCell>Engineer</TableCell>
                        <TableCell>
                          <StatusLight variant="warning">Invited</StatusLight>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Column>
            </Column>

            {/* Status */}
            <Column gap="3">
              <SectionTitle>STATUS</SectionTitle>
              <Column gap="6">
                <Row gap="3" wrap="wrap">
                  <StatusLight variant="info">Info</StatusLight>
                  <StatusLight variant="success">Success</StatusLight>
                  <StatusLight variant="warning">Warning</StatusLight>
                  <StatusLight variant="destructive">Destructive</StatusLight>
                  <StatusLight variant="muted">Muted</StatusLight>
                </Row>
                <Row gap="2" wrap="wrap" alignItems="center">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="ghost">Ghost</Badge>
                </Row>
                <Column gap="2">
                  <Alert>
                    <AlertTitle>Heads up!</AlertTitle>
                    <AlertDescription>This is a default alert message.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong.</AlertDescription>
                  </Alert>
                </Column>
              </Column>
            </Column>
          </Column>
        </Box>
      </Row>
    </Box>
  );
}
