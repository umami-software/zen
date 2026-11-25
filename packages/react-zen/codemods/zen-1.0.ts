/**
 * Codemod: migrate consumers of `@umami/react-zen` (0.x) to the shadcn-based 1.0 API.
 *
 * Usage:
 *   pnpm dlx tsx packages/react-zen/codemods/zen-1.0.ts <dir> [--dry]
 *
 * Only JSX elements whose tag resolves to an import from '@umami/react-zen' are touched
 * (aliases such as `import { Button as Btn }` and namespace imports are handled).
 *
 * The transform is computed from the original AST and applied as minimal text edits, so
 * formatting, comments and unrelated code are preserved byte for byte. Every rule is
 * evaluated against the ORIGINAL props, so the Button/Badge default-variant flip can never
 * be confused with a later rename (e.g. `primary` -> no prop).
 *
 * Run it ONCE per codebase: it cannot tell a migrated `<Button>` (shadcn black default)
 * from an unmigrated one (old gray default), so a second run would flip the default again.
 */
import fs from 'node:fs';
import path from 'node:path';
import {
  type JsxAttribute,
  type JsxOpeningElement,
  type JsxSelfClosingElement,
  Node,
  Project,
  type SourceFile,
  SyntaxKind,
  ts,
} from 'ts-morph';

const ZEN_MODULE = '@umami/react-zen';
const TODO = 'TODO(zen-1.0)';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface Flag {
  file: string;
  line: number;
  category: string;
  message: string;
}

export interface Change {
  line: number;
  rule: string;
  description: string;
}

export interface TransformResult {
  output: string;
  changed: boolean;
  counts: Record<string, number>;
  changes: Change[];
  flags: Flag[];
}

interface Edit {
  start: number;
  end: number;
  text: string;
  seq: number;
}

type TagNode = JsxOpeningElement | JsxSelfClosingElement;

interface El {
  tag: TagNode;
  /** The node that occupies the element's position in its parent (JsxElement or self-closing). */
  element: Node;
  comp: string;
  attrs: Map<string, JsxAttribute>;
  line: number;
}

/** `to: undefined` keeps the value, `to: null` means "the shadcn default" (prop omitted). */
interface MapResult {
  to?: string | null;
  flag?: { category: string; message: string };
}

type Mapper = (value: string | undefined) => MapResult;

interface Leaf {
  node: Node;
  value: string | undefined;
}

// ---------------------------------------------------------------------------
// Rule tables
// ---------------------------------------------------------------------------

/** Old default variant was the GRAY `default`; shadcn `default` is the black primary. */
const GRAY_DEFAULT_BUTTONS = new Set(['Button', 'LoadingButton', 'FormResetButton']);
/** Old FormSubmitButton defaulted to `variant='primary'`, which IS the shadcn default. */
const PRIMARY_DEFAULT_BUTTONS = new Set(['FormSubmitButton']);
const BUTTON_FAMILY = new Set([...GRAY_DEFAULT_BUTTONS, ...PRIMARY_DEFAULT_BUTTONS]);
const SIZE_MD_COMPONENTS = new Set([
  ...BUTTON_FAMILY,
  'Toggle',
  'ToggleGroup',
  'ToggleGroupItem',
  'SelectTrigger',
]);

const PALETTE = new Set([
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]);

const COMPONENT_PROP_RENAMES: Record<string, Record<string, string>> = {
  Checkbox: {
    isSelected: 'checked',
    defaultSelected: 'defaultChecked',
    onChange: 'onCheckedChange',
    isIndeterminate: 'indeterminate',
  },
  Switch: { isSelected: 'checked', defaultSelected: 'defaultChecked', onChange: 'onCheckedChange' },
  Toggle: { isSelected: 'pressed', defaultSelected: 'defaultPressed', onChange: 'onPressedChange' },
  TextField: { onChange: 'onValueChange' },
  PasswordField: { onChange: 'onValueChange' },
  SearchField: { onChange: 'onValueChange' },
  NumberField: { onChange: 'onValueChange' },
  ToggleGroup: {
    selectedKeys: 'value',
    defaultSelectedKeys: 'defaultValue',
    onSelectionChange: 'onValueChange',
    onChange: 'onValueChange',
  },
  ToggleGroupItem: { id: 'value' },
  Tabs: {
    selectedKey: 'value',
    defaultSelectedKey: 'defaultValue',
    onSelectionChange: 'onValueChange',
  },
  Tab: { id: 'value' },
  TabPanel: { id: 'value' },
  LoadingButton: { isLoading: 'loading' },
  FormSubmitButton: { isLoading: 'loading' },
};

/** Which rule bucket a component-specific rename is reported under. */
function componentRenameRule(comp: string): string {
  if (comp === 'Tabs' || comp === 'Tab' || comp === 'TabPanel') return 'tabs-props';
  if (comp === 'LoadingButton' || comp === 'FormSubmitButton') return 'loading-prop';
  return 'value-callbacks';
}

const GENERIC_PROP_RENAMES: Record<string, string> = {
  isDisabled: 'disabled',
  isReadOnly: 'readOnly',
  isRequired: 'required',
  isInvalid: 'aria-invalid',
  onPress: 'onClick',
  isOpen: 'open',
};

/** `placement` here is NOT a side (Loading: absolute/center/inline, Modal: center/fullscreen). */
const PLACEMENT_EXCLUDED = new Set(['Loading', 'Modal']);
const SIDE_MAP: Record<string, string> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  start: 'inline-start',
  end: 'inline-end',
};
const ALIGN_MAP: Record<string, string> = {
  start: 'start',
  left: 'start',
  top: 'start',
  end: 'end',
  right: 'end',
  bottom: 'end',
  center: 'center',
};

const TAG_RENAMES: Record<string, string> = {
  Tab: 'TabsTrigger',
  TabPanel: 'TabsContent',
  TabList: 'TabsList',
};

const COLOR_COMPONENTS = new Set([
  'Box',
  'Flexbox',
  'Row',
  'Column',
  'Grid',
  'Text',
  'Heading',
  'Icon',
]);
const STATE_STYLE_PROPS = new Set(['hover', 'focus', 'active']);

const STRUCTURAL: Record<string, { category: string; message: string }> = {
  Dialog: {
    category: 'dialog',
    message:
      'Dialog is now the shadcn ROOT (old Dialog was the styled content). Restructure to <Dialog open onOpenChange> + <DialogTrigger render={...} /> + <DialogContent> (title -> <DialogHeader><DialogTitle>); render-function children ({ close }) are not supported',
  },
  DialogTrigger: {
    category: 'dialog',
    message:
      'old DialogTrigger wrapped trigger + Modal. Restructure to <Dialog><DialogTrigger render={<Button ... />} /><DialogContent>...</DialogContent></Dialog>',
  },
  Modal: {
    category: 'modal',
    message: 'Modal was removed. Use <DialogContent> inside a <Dialog> root (or <SheetContent> for side panels)',
  },
  AlertDialog: {
    category: 'dialog',
    message:
      'AlertDialog is now the shadcn root (AlertDialog > AlertDialogTrigger + AlertDialogContent > AlertDialogHeader/Footer/Action/Cancel), or use ConfirmationDialog',
  },
  TooltipTrigger: {
    category: 'tooltip',
    message:
      'restructure to <Tooltip><TooltipTrigger render={...} /><TooltipContent>...</TooltipContent></Tooltip> (old <Tooltip> child becomes <TooltipContent>)',
  },
  Tooltip: {
    category: 'tooltip',
    message: 'Tooltip is now the ROOT; the tooltip body goes in <TooltipContent>, the trigger in <TooltipTrigger>',
  },
  MenuTrigger: {
    category: 'menu',
    message:
      'restructure to <DropdownMenu><DropdownMenuTrigger render={...} /><DropdownMenuContent>...</DropdownMenuContent></DropdownMenu> (drop the Popover wrapper)',
  },
  Menu: {
    category: 'menu',
    message:
      'Menu -> DropdownMenuContent; MenuItem -> DropdownMenuItem (onAction/id -> onClick), MenuSection -> DropdownMenuGroup, MenuSeparator -> DropdownMenuSeparator, SubmenuTrigger -> DropdownMenuSub',
  },
  MenuItem: { category: 'menu', message: 'MenuItem -> DropdownMenuItem (onAction/id -> onClick)' },
  MenuSection: { category: 'menu', message: 'MenuSection -> DropdownMenuGroup (+ DropdownMenuLabel)' },
  MenuSeparator: { category: 'menu', message: 'MenuSeparator -> DropdownMenuSeparator' },
  SubmenuTrigger: {
    category: 'menu',
    message: 'SubmenuTrigger -> DropdownMenuSub > DropdownMenuSubTrigger + DropdownMenuSubContent',
  },
  Popover: {
    category: 'popover',
    message:
      'if used with a trigger, restructure to <Popover><PopoverTrigger render={...} /><PopoverContent>...</PopoverContent></Popover>',
  },
  Select: {
    category: 'select',
    message:
      'restructure to <Select value onValueChange><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value>...</SelectItem></SelectContent></Select> (ListItem id -> SelectItem value, onChange -> onValueChange)',
  },
  ComboBox: { category: 'combobox', message: 'ComboBox -> Combobox (shadcn/base-ui composition)' },
  Breadcrumbs: {
    category: 'breadcrumbs',
    message: 'Breadcrumbs -> Breadcrumb > BreadcrumbList > BreadcrumbItem > BreadcrumbLink / BreadcrumbPage',
  },
  ProgressBar: { category: 'progress', message: 'ProgressBar -> Progress' },
  RouterProvider: {
    category: 'router-provider',
    message: 'RouterProvider was removed; delete it and render router links with render={<Link ... />}',
  },
  Sheet: {
    category: 'sheet',
    message: 'Sheet is now the shadcn root: Sheet > SheetTrigger + SheetContent side="..."',
  },
};

/** Inner pieces are only flagged when not already inside their (flagged) parent. */
const FLAG_UNLESS_INSIDE: Record<string, string[]> = {
  Tooltip: ['TooltipTrigger'],
  Modal: ['DialogTrigger'],
  MenuItem: ['Menu', 'MenuTrigger'],
  MenuSection: ['Menu', 'MenuTrigger'],
  MenuSeparator: ['Menu', 'MenuTrigger'],
  SubmenuTrigger: ['Menu', 'MenuTrigger'],
};

// ---------------------------------------------------------------------------
// Value mappers
// ---------------------------------------------------------------------------

function buttonVariantMapper(comp: string): Mapper {
  const grayDefault = GRAY_DEFAULT_BUTTONS.has(comp);
  return v => {
    if (v === undefined) return { to: grayDefault ? 'secondary' : undefined };
    switch (v) {
      case 'default':
        return { to: 'secondary' };
      case 'primary':
        return { to: null };
      case 'quiet':
        return { to: 'ghost' };
      case 'danger':
        return { to: 'destructive' };
      case 'outline':
      case 'link':
        return {};
      case 'zero':
        return {
          to: 'ghost',
          flag: {
            category: 'variant-zero',
            message:
              'variant="zero" (borderless, transparent, no hover) has no shadcn equivalent; mapped to "ghost" which HAS a hover background. Consider className="h-auto p-0 hover:bg-transparent"',
          },
        };
      default:
        return {
          flag: { category: 'variant-unknown', message: `unknown ${comp} variant "${v}" left as is` },
        };
    }
  };
}

const badgeVariantMapper: Mapper = v => {
  if (v === undefined || v === 'default') return { to: 'secondary' };
  if (v === 'primary') return { to: null };
  if (v === 'error') return { to: 'destructive' };
  if (v === 'outline') return {};
  if (['success', 'warning', 'info'].includes(v) || PALETTE.has(v)) {
    return {
      flag: {
        category: 'badge-variant',
        message: `Badge variant "${v}" does not exist in shadcn Badge (default/secondary/destructive/outline/ghost/link); use className for color`,
      },
    };
  }
  return { flag: { category: 'variant-unknown', message: `unknown Badge variant "${v}" left as is` } };
};

const alertVariantMapper: Mapper = v => (v === 'danger' ? { to: 'destructive' } : {});

function sizeMapper(comp: string): Mapper {
  return v => {
    if (v === 'md') return { to: null };
    if (v === 'xl' && BUTTON_FAMILY.has(comp)) {
      return {
        to: 'lg',
        flag: {
          category: 'size-xl',
          message: 'size="xl" has no shadcn equivalent; mapped to "lg" (one step smaller)',
        },
      };
    }
    return {};
  };
}

// `muted` keeps its name: text color props resolve it to the `muted-foreground` token.
const TEXT_COLOR: Record<string, string> = {
  'muted-foreground': 'muted',
  primary: 'foreground',
  inverted: 'background',
  disabled: 'muted',
};
const BG_COLOR: Record<string, string> = {
  surface: 'background',
  'surface-raised': 'muted',
  'surface-sunken': 'muted',
  'surface-overlay': 'popover',
  'surface-inverted': 'foreground',
  'surface-disabled': 'muted',
  interactive: 'muted',
  'interactive-hover': 'accent',
  'interactive-pressed': 'accent',
  inverted: 'foreground',
  disabled: 'muted',
};
const BORDER_COLOR: Record<string, string> = {
  muted: 'border',
  strong: 'input',
  disabled: 'border',
};

function colorMapper(prop: string): Mapper | undefined {
  const table =
    prop === 'color'
      ? TEXT_COLOR
      : prop === 'backgroundColor'
        ? BG_COLOR
        : prop === 'borderColor'
          ? BORDER_COLOR
          : undefined;
  if (!table) return undefined;
  return v => {
    if (v === undefined || !(v in table)) return {};
    const res: MapResult = { to: table[v] };
    if (v === 'disabled' || v === 'surface-disabled') {
      res.flag = {
        category: 'color-disabled',
        message: `${prop}="${v}" has no shadcn token; mapped to "${table[v]}" (consider opacity-50)`,
      };
    }
    return res;
  };
}

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

const project = new Project({
  useInMemoryFileSystem: true,
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { jsx: ts.JsxEmit.Preserve, allowJs: true, noLib: true },
});

function scriptKindFor(fileName: string) {
  if (fileName.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (fileName.endsWith('.jsx')) return ts.ScriptKind.JSX;
  if (fileName.endsWith('.js') || fileName.endsWith('.mjs')) return ts.ScriptKind.JS;
  return ts.ScriptKind.TS;
}

export function transformSource(text: string, fileName = 'input.tsx'): TransformResult {
  const result: TransformResult = { output: text, changed: false, counts: {}, changes: [], flags: [] };
  if (!text.includes(ZEN_MODULE)) return result;

  const virtualName = `/__zen__/${path.basename(fileName).replace(/\.[cm]?[jt]sx?$/, '')}${
    fileName.endsWith('.ts') || fileName.endsWith('.js') ? '.ts' : '.tsx'
  }`;
  const sf = project.createSourceFile(virtualName, text, {
    overwrite: true,
    scriptKind: scriptKindFor(fileName),
  });
  try {
    new FileTransform(sf, text, fileName, result).run();
  } finally {
    project.removeSourceFile(sf);
  }
  return result;
}

class FileTransform {
  private edits: Edit[] = [];
  private seq = 0;
  /** element node -> pending TODO messages */
  private todos = new Map<Node, string[]>();
  /** local identifier -> imported name */
  private named = new Map<string, string>();
  private namespaces = new Set<string>();
  private zenTagCache = new Map<Node, string | undefined>();

  constructor(
    private sf: SourceFile,
    private text: string,
    private fileName: string,
    private result: TransformResult,
  ) {}

  run() {
    this.collectImports();
    if (this.named.size === 0 && this.namespaces.size === 0) return;

    const tags: TagNode[] = [
      ...this.sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
      ...this.sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ].sort((a, b) => a.getStart() - b.getStart());

    for (const tag of tags) {
      const comp = this.resolve(tag);
      if (!comp) continue;
      const attrs = new Map<string, JsxAttribute>();
      for (const a of tag.getAttributes()) {
        if (Node.isJsxAttribute(a)) attrs.set(a.getNameNode().getText(), a);
      }
      const element = Node.isJsxOpeningElement(tag) ? tag.getParentOrThrow() : tag;
      const el: El = { tag, element, comp, attrs, line: this.lineOf(tag.getStart()) };
      this.processElement(el);
    }

    this.renameTabImportsAndTags();
    this.emitTodos();

    if (this.edits.length === 0) return;
    this.result.output = applyEdits(this.text, this.edits);
    this.result.changed = this.result.output !== this.text;
  }

  // ---- imports / resolution ------------------------------------------------

  private collectImports() {
    for (const decl of this.sf.getImportDeclarations()) {
      if (decl.getModuleSpecifierValue() !== ZEN_MODULE) continue;
      const ns = decl.getNamespaceImport();
      if (ns) this.namespaces.add(ns.getText());
      for (const spec of decl.getNamedImports()) {
        const imported = spec.getNameNode().getText();
        const local = spec.getAliasNode()?.getText() ?? imported;
        this.named.set(local, imported);
      }
    }
  }

  private resolve(tag: TagNode): string | undefined {
    if (this.zenTagCache.has(tag)) return this.zenTagCache.get(tag);
    const name = tag.getTagNameNode();
    let comp: string | undefined;
    if (Node.isIdentifier(name)) {
      comp = this.named.get(name.getText());
    } else if (Node.isPropertyAccessExpression(name)) {
      const obj = name.getExpression();
      if (Node.isIdentifier(obj) && this.namespaces.has(obj.getText())) comp = name.getName();
    }
    this.zenTagCache.set(tag, comp);
    return comp;
  }

  private hasZenAncestor(el: El, comps: string[]): boolean {
    let cur: Node | undefined = el.element.getParent();
    while (cur) {
      if (Node.isJsxElement(cur)) {
        const c = this.resolve(cur.getOpeningElement());
        if (c && comps.includes(c)) return true;
      }
      cur = cur.getParent();
    }
    return false;
  }

  private hasZenDescendant(el: El, comps: string[]): boolean {
    if (!Node.isJsxElement(el.element)) return false;
    const found = [
      ...el.element.getDescendantsOfKind(SyntaxKind.JsxOpeningElement),
      ...el.element.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ].some(t => t !== el.tag && comps.includes(this.resolve(t) ?? ''));
    return found;
  }

  // ---- per element ------------------------------------------------------------

  private processElement(el: El) {
    const { comp } = el;
    const handled = new Set<string>();

    // Rule 6: structural changes -> TODO
    const structural = STRUCTURAL[comp];
    if (structural) {
      const parents = FLAG_UNLESS_INSIDE[comp];
      const skip =
        (parents && this.hasZenAncestor(el, parents)) ||
        (comp === 'Select' && this.hasZenDescendant(el, ['SelectTrigger', 'SelectContent']));
      if (!skip) this.flag(el, structural.category, `<${comp}>: ${structural.message}`);
    }

    // Checkbox / Switch labels passed as children are silently dropped by shadcn.
    if ((comp === 'Checkbox' || comp === 'Switch') && Node.isJsxElement(el.element)) {
      const hasContent = el.element
        .getJsxChildren()
        .some(c => !(Node.isJsxText(c) && c.containsOnlyTriviaWhiteSpaces()));
      if (hasContent) {
        this.flag(
          el,
          'label-children',
          `<${comp}> children are no longer rendered as a label (shadcn ${comp} ignores children). Wrap in <Label> / <Field orientation="horizontal"> with the text as a sibling`,
        );
      }
    }

    // Rule 1: variants
    const variantMapper = BUTTON_FAMILY.has(comp)
      ? buttonVariantMapper(comp)
      : comp === 'Badge'
        ? badgeVariantMapper
        : comp === 'Alert'
          ? alertVariantMapper
          : undefined;
    if (variantMapper) {
      handled.add('variant');
      const attr = el.attrs.get('variant');
      if (attr) {
        this.mapAttrValue(el, attr, variantMapper, 'variant', 'default');
      } else if (GRAY_DEFAULT_BUTTONS.has(comp) || comp === 'Badge') {
        const hasSpread = el.tag.getAttributes().some(a => Node.isJsxSpreadAttribute(a));
        this.insertAttr(el, 'variant="secondary"');
        this.change(
          el,
          'variant',
          hasSpread
            ? `${comp}: add variant="secondary" before spread (old gray default)`
            : `${comp}: add variant="secondary" (old gray default)`,
        );
      }
    }
    if (SIZE_MD_COMPONENTS.has(comp)) {
      handled.add('size');
      const attr = el.attrs.get('size');
      if (attr) this.mapAttrValue(el, attr, sizeMapper(comp), 'size', 'default', true);
    }

    // Rules 2 + 3: component specific prop renames
    const renames = COMPONENT_PROP_RENAMES[comp];
    if (renames) {
      for (const [from, to] of Object.entries(renames)) {
        const attr = el.attrs.get(from);
        if (!attr) continue;
        handled.add(from);
        if (comp === 'ToggleGroupItem' && from === 'id' && el.attrs.has('value')) continue;
        this.renameAttr(el, attr, to, componentRenameRule(comp));
        if (comp === 'ToggleGroup' && (from === 'selectedKeys' || from === 'onSelectionChange')) {
          this.flag(
            el,
            'togglegroup-selection',
            `<ToggleGroup ${from}> -> ${to}: value is now a string[] (was a Set/Iterable); check the value / callback argument`,
          );
        }
      }
    }

    // Rule 4: generic renames on any zen element
    for (const [from, to] of Object.entries(GENERIC_PROP_RENAMES)) {
      const attr = el.attrs.get(from);
      if (!attr || handled.has(from)) continue;
      this.renameAttr(el, attr, to, 'generic-props');
    }
    const placement = el.attrs.get('placement');
    if (placement && !PLACEMENT_EXCLUDED.has(comp)) this.handlePlacement(el, placement);

    // Rule 5: color tokens
    if (COLOR_COMPONENTS.has(comp)) {
      for (const prop of ['color', 'backgroundColor', 'borderColor']) {
        const attr = el.attrs.get(prop);
        const mapper = colorMapper(prop);
        if (attr && mapper) this.mapAttrValue(el, attr, mapper, 'colors', undefined, false, true);
      }
      for (const prop of STATE_STYLE_PROPS) {
        const attr = el.attrs.get(prop);
        if (attr) this.mapStateStyles(el, attr);
      }
    }
  }

  // ---- value mapping -------------------------------------------------------------

  /**
   * Map a prop's literal value(s). Handles `"x"`, `{'x'}`, `{`x`}`, parenthesised values and
   * conditional expressions whose leaves are all literals / undefined / null.
   */
  private mapAttrValue(
    el: El,
    attr: JsxAttribute,
    mapper: Mapper,
    rule: string,
    defaultToken: string | undefined,
    silentNonLiteral = false,
    silentUnknownLeaves = false,
  ) {
    const prop = attr.getNameNode().getText();
    const init = attr.getInitializer();
    const leaves = init ? collectLeaves(init) : undefined;
    if (!leaves) {
      if (!silentNonLiteral && !silentUnknownLeaves) {
        this.flag(
          el,
          'variant-nonliteral',
          `<${el.comp} ${prop}={...}> is not a literal; map old values by hand (default->secondary, primary->default, quiet->ghost, danger->destructive, zero->ghost)`,
        );
      }
      return;
    }
    const isTopLevel = leaves.length === 1 && !leaves.conditional;
    let changed = false;
    for (const leaf of leaves) {
      const res = mapper(leaf.value);
      if (res.flag) this.flag(el, res.flag.category, `<${el.comp}>: ${res.flag.message}`);
      if (res.to === undefined) continue;
      if (res.to === null) {
        if (isTopLevel) {
          this.removeAttr(el, attr);
          this.change(el, rule, `${el.comp}: remove ${prop}="${leaf.value}"`);
          return;
        }
        if (leaf.value === undefined || defaultToken === undefined) continue;
        this.replaceLeaf(leaf, defaultToken);
        changed = true;
        continue;
      }
      if (res.to === leaf.value) continue;
      this.replaceLeaf(leaf, res.to);
      changed = true;
    }
    if (changed) {
      const before = init?.getText() ?? '';
      this.change(el, rule, `${el.comp}: ${prop} ${compact(before)} -> mapped`);
    }
  }

  private mapStateStyles(el: El, attr: JsxAttribute) {
    const init = attr.getInitializer();
    if (!init || !Node.isJsxExpression(init)) return;
    const obj = init.getExpression();
    if (!obj || !Node.isObjectLiteralExpression(obj)) return;
    for (const p of obj.getProperties()) {
      if (!Node.isPropertyAssignment(p)) continue;
      const key = p.getName().replace(/^['"]|['"]$/g, '');
      const mapper = colorMapper(key);
      const value = p.getInitializer();
      if (!mapper || !value) continue;
      const leaves = collectLeaves(value);
      if (!leaves) continue;
      for (const leaf of leaves) {
        const res = mapper(leaf.value);
        if (res.flag) this.flag(el, res.flag.category, `<${el.comp}>: ${res.flag.message}`);
        if (typeof res.to === 'string' && res.to !== leaf.value) {
          this.replaceLeaf(leaf, res.to);
          this.change(
            el,
            'colors',
            `${el.comp}: ${attr.getNameNode().getText()}.${key} "${leaf.value}" -> "${res.to}"`,
          );
        }
      }
    }
  }

  private handlePlacement(el: El, attr: JsxAttribute) {
    if (el.attrs.has('side')) {
      this.flag(el, 'prop-conflict', `<${el.comp}> has both placement and side; remove placement`);
      return;
    }
    const init = attr.getInitializer();
    const leaves = init ? collectLeaves(init) : undefined;
    if (!leaves) {
      this.renameAttr(el, attr, 'side', 'generic-props');
      this.flag(
        el,
        'placement-value',
        `<${el.comp} placement={...}> renamed to side; check the values are top|bottom|left|right|inline-start|inline-end (alignment now goes in align)`,
      );
      return;
    }
    const isTopLevel = leaves.length === 1 && !leaves.conditional;
    const valueEdits: Array<{ leaf: Leaf; side: string }> = [];
    let align: string | undefined;
    for (const leaf of leaves) {
      if (leaf.value === undefined) continue;
      const [sidePart, alignPart, ...rest] = leaf.value.trim().split(/\s+/);
      const side = SIDE_MAP[sidePart];
      const alignValue = alignPart ? ALIGN_MAP[alignPart] : undefined;
      if (!side || rest.length || (alignPart && (!alignValue || !isTopLevel))) {
        this.flag(
          el,
          'placement-value',
          `<${el.comp} placement="${leaf.value}"> could not be mapped to side/align; left unchanged`,
        );
        return;
      }
      if (alignValue) align = alignValue;
      if (side !== leaf.value) valueEdits.push({ leaf, side });
    }
    if (align && el.attrs.has('align')) {
      this.flag(el, 'prop-conflict', `<${el.comp}> placement has an alignment but align is already set`);
      return;
    }
    this.renameAttr(el, attr, 'side', 'generic-props');
    for (const { leaf, side } of valueEdits) this.replaceLeaf(leaf, side);
    if (align) this.addEdit(attr.getEnd(), attr.getEnd(), ` align="${align}"`);
  }

  // ---- Tabs import/tag renames ------------------------------------------------

  private renameTabImportsAndTags() {
    const decls = this.sf
      .getImportDeclarations()
      .filter(d => d.getModuleSpecifierValue() === ZEN_MODULE);
    const unaliased = new Set<string>();
    for (const d of decls) {
      for (const s of d.getNamedImports()) {
        if (!s.getAliasNode()) unaliased.add(s.getNameNode().getText());
      }
    }

    for (const decl of decls) {
      const specs = decl.getNamedImports();
      for (const [idx, spec] of specs.entries()) {
        const imported = spec.getNameNode().getText();
        const next = TAG_RENAMES[imported];
        if (!next) continue;
        const alias = spec.getAliasNode();
        if (!alias && unaliased.has(next)) {
          // Duplicate after rename: drop this specifier.
          if (specs.length === 1) {
            const end = this.text.slice(decl.getEnd()).match(/^\r?\n/)?.[0].length ?? 0;
            this.addEdit(decl.getStart(), decl.getEnd() + end, '');
          } else if (idx < specs.length - 1) {
            this.addEdit(spec.getStart(), specs[idx + 1].getStart(), '');
          } else {
            this.addEdit(specs[idx - 1].getEnd(), spec.getEnd(), '');
          }
        } else {
          const nameNode = spec.getNameNode();
          this.addEdit(nameNode.getStart(), nameNode.getEnd(), next);
          if (!alias) unaliased.add(next);
        }
        this.count('tabs-import');

        // Rename references of the local binding (only when not aliased).
        if (!alias) this.renameLocalReferences(spec.getNameNode(), imported, next);
      }
    }

    // Namespace usages: <Zen.Tab> -> <Zen.TabsTrigger>
    if (this.namespaces.size) {
      for (const pa of this.sf.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)) {
        const obj = pa.getExpression();
        const next = TAG_RENAMES[pa.getName()];
        if (!next || !Node.isIdentifier(obj) || !this.namespaces.has(obj.getText())) continue;
        const nameNode = pa.getNameNode();
        this.addEdit(nameNode.getStart(), nameNode.getEnd(), next);
        this.count('tabs-tags');
      }
    }
  }

  private renameLocalReferences(nameNode: Node, oldName: string, newName: string) {
    const symbol = nameNode.getSymbol();
    for (const id of this.sf.getDescendantsOfKind(SyntaxKind.Identifier)) {
      if (id.getText() !== oldName || id === nameNode) continue;
      if (id.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) continue;
      const parent = id.getParent();
      if (
        (Node.isPropertyAccessExpression(parent) && parent.getNameNode() === id) ||
        (Node.isPropertyAssignment(parent) && parent.getNameNode() === id) ||
        (Node.isQualifiedName(parent) && parent.getRight() === id) ||
        Node.isJsxAttribute(parent) ||
        Node.isShorthandPropertyAssignment(parent)
      ) {
        continue;
      }
      const idSymbol = id.getSymbol();
      if (symbol && idSymbol && idSymbol !== symbol) continue;
      this.addEdit(id.getStart(), id.getEnd(), newName);
      const isTag =
        Node.isJsxOpeningElement(parent) ||
        Node.isJsxClosingElement(parent) ||
        Node.isJsxSelfClosingElement(parent);
      if (isTag && !Node.isJsxClosingElement(parent)) {
        this.count('tabs-tags');
        this.result.changes.push({
          line: this.lineOf(id.getStart()),
          rule: 'tabs-tags',
          description: `<${oldName}> -> <${newName}>`,
        });
      }
    }
  }

  // ---- edit helpers -----------------------------------------------------------------

  private addEdit(start: number, end: number, text: string) {
    this.edits.push({ start, end, text, seq: this.seq++ });
  }

  private replaceLeaf(leaf: Leaf, value: string) {
    const raw = leaf.node.getText();
    const q = raw[0] === '"' || raw[0] === "'" || raw[0] === '`' ? raw[0] : "'";
    this.addEdit(leaf.node.getStart(), leaf.node.getEnd(), `${q}${value}${q}`);
  }

  private renameAttr(el: El, attr: JsxAttribute, to: string, rule: string) {
    const from = attr.getNameNode().getText();
    if (el.attrs.has(to)) {
      this.flag(el, 'prop-conflict', `<${el.comp}> has both ${from} and ${to}; merge them by hand`);
      return;
    }
    const n = attr.getNameNode();
    this.addEdit(n.getStart(), n.getEnd(), to);
    this.change(el, rule, `${el.comp}: ${from} -> ${to}`);
  }

  private removeAttr(el: El, attr: JsxAttribute) {
    const props = el.tag.getAttributes();
    const idx = props.indexOf(attr);
    const prevEnd = idx > 0 ? props[idx - 1].getEnd() : el.tag.getTagNameNode().getEnd();
    this.addEdit(prevEnd, attr.getEnd(), '');
  }

  /**
   * Insert an attribute as the first prop. It always lands before any spread, so a value
   * carried by the spread still wins (same semantics as the old component default).
   */
  private insertAttr(el: El, attrText: string) {
    const props = el.tag.getAttributes();
    const tagEnd = el.tag.getTagNameNode().getEnd();
    if (props.length) {
      // Inserted right after the tag name (not at the first prop) so it can't overlap the
      // removal of that prop, reusing the whitespace that precedes the first prop.
      const ws = this.text.slice(tagEnd, props[0].getStart()) || ' ';
      this.addEdit(tagEnd, tagEnd, ws + attrText);
    } else {
      this.addEdit(tagEnd, tagEnd, ` ${attrText}`);
    }
  }

  private count(rule: string) {
    this.result.counts[rule] = (this.result.counts[rule] ?? 0) + 1;
  }

  private change(el: El, rule: string, description: string) {
    this.count(rule);
    this.result.changes.push({ line: el.line, rule, description });
  }

  private flag(el: El, category: string, message: string) {
    const list = this.todos.get(el.element) ?? [];
    if (!list.includes(message)) list.push(message);
    this.todos.set(el.element, list);
    this.result.flags.push({ file: this.fileName, line: el.line, category, message });
    this.result.counts[`TODO:${category}`] = (this.result.counts[`TODO:${category}`] ?? 0) + 1;
  }

  private lineOf(pos: number) {
    return this.sf.getLineAndColumnAtPos(pos).line;
  }

  /** Insert the TODO comments: a JSX comment when the element is a JSX child, otherwise a line comment above the statement. */
  private emitTodos() {
    const byPos = new Map<number, { kind: 'jsx' | 'line'; messages: string[]; indent: string; ownLine: boolean }>();
    for (const [element, messages] of this.todos) {
      const anchor = findCommentAnchor(element);
      if (!anchor) continue;
      const start = anchor.node.getStart();
      const lineStart = this.text.lastIndexOf('\n', start - 1) + 1;
      const before = this.text.slice(lineStart, start);
      const ownLine = /^\s*$/.test(before);
      const indent = ownLine ? before : '';
      const entry = byPos.get(start) ?? { kind: anchor.kind, messages: [], indent, ownLine };
      for (const m of messages) if (!entry.messages.includes(m)) entry.messages.push(m);
      byPos.set(start, entry);
    }
    for (const [pos, entry] of byPos) {
      const lines = entry.messages.map(m =>
        entry.kind === 'jsx' ? `{/* ${TODO}: ${m.replace(/\*\//g, '* /')} */}` : `// ${TODO}: ${m}`,
      );
      const eol = this.text.includes('\r\n') ? '\r\n' : '\n';
      let text: string;
      if (entry.kind === 'jsx' && !entry.ownLine) {
        text = lines.join('');
      } else {
        text = lines.map(l => `${l}${eol}${entry.indent}`).join('');
        if (!entry.ownLine) text = `${eol}${text}`;
      }
      this.addEdit(pos, pos, text);
    }
  }
}

/**
 * Walk up from an element to the nearest place a comment can legally go:
 * before a JSX child (as `{/* *\/}`) or before a statement (as `//`).
 */
function findCommentAnchor(element: Node): { node: Node; kind: 'jsx' | 'line' } | undefined {
  let cur: Node = element;
  while (true) {
    const parent = cur.getParent();
    if (!parent) return undefined;
    if (
      (Node.isJsxElement(parent) || Node.isJsxFragment(parent)) &&
      !Node.isJsxOpeningElement(cur) &&
      !Node.isJsxClosingElement(cur) &&
      !Node.isJsxOpeningFragment(cur) &&
      !Node.isJsxClosingFragment(cur)
    ) {
      return { node: cur, kind: 'jsx' };
    }
    if (
      Node.isBlock(parent) ||
      Node.isSourceFile(parent) ||
      Node.isCaseClause(parent) ||
      Node.isDefaultClause(parent) ||
      Node.isModuleBlock(parent)
    ) {
      return { node: cur, kind: 'line' };
    }
    cur = parent;
  }
}

/** Literal leaves of a prop value, or undefined when any leaf is not a literal. */
function collectLeaves(node: Node): (Leaf[] & { conditional?: boolean }) | undefined {
  const leaves: Leaf[] & { conditional?: boolean } = [];
  const visit = (n: Node | undefined): boolean => {
    if (!n) return false;
    if (Node.isStringLiteral(n) || Node.isNoSubstitutionTemplateLiteral(n)) {
      leaves.push({ node: n, value: n.getLiteralValue() });
      return true;
    }
    if (Node.isJsxExpression(n)) return visit(n.getExpression());
    if (Node.isParenthesizedExpression(n)) return visit(n.getExpression());
    if (Node.isIdentifier(n) && n.getText() === 'undefined') {
      leaves.push({ node: n, value: undefined });
      return true;
    }
    if (n.getKind() === SyntaxKind.NullKeyword) {
      leaves.push({ node: n, value: undefined });
      return true;
    }
    if (Node.isConditionalExpression(n)) {
      leaves.conditional = true;
      return visit(n.getWhenTrue()) && visit(n.getWhenFalse());
    }
    return false;
  };
  return visit(node) ? leaves : undefined;
}

function compact(s: string) {
  const one = s.replace(/\s+/g, ' ');
  return one.length > 60 ? `${one.slice(0, 57)}...` : one;
}

function applyEdits(text: string, edits: Edit[]): string {
  const sorted = [...edits].sort((a, b) => a.start - b.start || a.end - b.end || a.seq - b.seq);
  // Identical edits (same range + text) can come from two rules; keep one.
  const unique = sorted.filter(
    (e, i) =>
      i === 0 ||
      !(e.start === sorted[i - 1].start && e.end === sorted[i - 1].end && e.text === sorted[i - 1].text),
  );
  let lastEnd = -1;
  for (const e of unique) {
    if (e.start < lastEnd) {
      throw new Error(`overlapping edits at ${e.start} (previous edit ends at ${lastEnd})`);
    }
    lastEnd = Math.max(lastEnd, e.end);
  }
  let out = '';
  let pos = 0;
  for (const e of unique) {
    out += text.slice(pos, e.start) + e.text;
    pos = e.end;
  }
  return out + text.slice(pos);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git', '.turbo', 'coverage']);
const EXTENSIONS = /\.(tsx|jsx|ts|js|mjs)$/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (EXTENSIONS.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

function main(argv: string[]) {
  const dry = argv.includes('--dry');
  const quiet = argv.includes('--quiet');
  const target = argv.find(a => !a.startsWith('--'));
  if (!target) {
    console.error('Usage: pnpm dlx tsx packages/react-zen/codemods/zen-1.0.ts <dir> [--dry] [--quiet]');
    process.exit(1);
  }
  const root = path.resolve(target);
  const files = fs.statSync(root).isDirectory() ? walk(root) : [root];

  const totals: Record<string, number> = {};
  const flags: Flag[] = [];
  let changedFiles = 0;
  let errors = 0;

  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (!text.includes(ZEN_MODULE)) continue;
    const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
    let res: TransformResult;
    try {
      res = transformSource(text, rel);
    } catch (e) {
      errors++;
      console.error(`ERROR ${rel}: ${(e as Error).message}`);
      continue;
    }
    for (const [k, v] of Object.entries(res.counts)) totals[k] = (totals[k] ?? 0) + v;
    flags.push(...res.flags);
    if (!res.changed) continue;
    changedFiles++;
    if (dry && !quiet) {
      console.log(`\n${rel}`);
      for (const c of res.changes) console.log(`  L${c.line}  [${c.rule}] ${c.description}`);
      for (const f of res.flags) console.log(`  L${f.line}  TODO [${f.category}] ${f.message}`);
    }
    if (!dry) fs.writeFileSync(file, res.output);
  }

  const ruleCounts = Object.entries(totals)
    .filter(([k]) => !k.startsWith('TODO:'))
    .sort((a, b) => b[1] - a[1]);
  const flagCounts = Object.entries(totals)
    .filter(([k]) => k.startsWith('TODO:'))
    .map(([k, v]) => [k.slice(5), v] as const)
    .sort((a, b) => b[1] - a[1]);

  console.log(`\n=== zen-1.0 codemod report${dry ? ' (dry run, nothing written)' : ''} ===`);
  console.log(`Files scanned: ${files.length}`);
  console.log(`Files ${dry ? 'that would change' : 'changed'}: ${changedFiles}`);
  if (errors) console.log(`Files with errors (skipped): ${errors}`);
  console.log('\nChanges per rule:');
  for (const [k, v] of ruleCounts) console.log(`  ${k.padEnd(20)} ${v}`);
  console.log(`\nTODO(zen-1.0) flags: ${flags.length}`);
  for (const [k, v] of flagCounts) console.log(`  ${k.padEnd(22)} ${v}`);
  if (flags.length) {
    console.log('\nFlagged locations:');
    const byCat = new Map<string, Flag[]>();
    for (const f of flags) byCat.set(f.category, [...(byCat.get(f.category) ?? []), f]);
    for (const [cat, list] of byCat) {
      console.log(`  [${cat}]`);
      for (const f of list) console.log(`    ${f.file}:${f.line}`);
    }
  }
}

if (/zen-1\.0\.[cm]?[jt]s$/.test(process.argv[1] ?? '')) {
  main(process.argv.slice(2));
}
