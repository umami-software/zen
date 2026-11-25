# Zen

Zen is the design system and React component collection used by [Umami](https://umami.is).
It contains the theme, layout primitives, controls, and interface patterns used across Umami
products.

Zen 1.0 is built on [shadcn/ui](https://ui.shadcn.com/) with the **base-vega** style, uses
[Base UI](https://base-ui.com/) primitives for interactive behavior, and is styled with
[Tailwind CSS](https://tailwindcss.com/) v4.

[Documentation](https://zen.umami.is/) ·
[Component source](./packages/react-zen/src/components) ·
[Migrating from 0.x](./MIGRATION-1.0.md)

## Contents

- The shadcn/ui components (base-vega), unmodified and exported with shadcn's names and parts
- Layout and typography primitives with style props (Box, Row, Column, Grid, Text, Heading)
- Fields, react-hook-form forms, DataTable, toasts and other Zen components
- The shadcn theme tokens with seven palettes (neutral, stone, zinc, mauve, olive, mist, taupe),
  `.dark` mode, and Zen's `success`, `warning` and `info` colors

## Installation

```shell
pnpm add @umami/react-zen
```

### With Tailwind CSS

For projects using Tailwind CSS v4, import Zen's stylesheet after Tailwind and add the package to
Tailwind's sources:

```css
@import "tailwindcss";
@import "@umami/react-zen/styles.css";

@source "../node_modules/@umami/react-zen/dist";
```

There is no Tailwind config or preset to add.

### Without Tailwind CSS

Import the prebuilt stylesheet:

```js
import '@umami/react-zen/styles.full.css';
```

## Usage

Wrap the application with `ZenProvider`, then import components from the package:

```jsx
import { Button, ZenProvider } from '@umami/react-zen';

export function App() {
  return (
    <ZenProvider palette="neutral">
      <Button>Save</Button>
    </ZenProvider>
  );
}
```

Dark mode is the `.dark` class on `<html>`. Color props on layout components take theme token names
(`<Text color="muted">`, `<Box backgroundColor="muted">`). Zen ships no font; components
use your app's `--font-sans`. To customize the theme, override the shadcn CSS variables
(`--primary`, `--radius`, …); any shadcn theme works.

See the [documentation](https://zen.umami.is/docs) for component APIs, the theme, and patterns.

## Migrating from 0.x

1.0 has no backward compatibility layer. Read [MIGRATION-1.0.md](./MIGRATION-1.0.md) and run the
codemod once:

```shell
pnpm dlx tsx packages/react-zen/codemods/zen-1.0.ts <your-src-dir> --dry   # preview
pnpm dlx tsx packages/react-zen/codemods/zen-1.0.ts <your-src-dir>
```

## Development

This repository is a pnpm and Turborepo monorepo:

- `packages/react-zen` contains the component package
- `apps/docs` contains the documentation site

Install dependencies:

```shell
pnpm install
```

Run the workspace in development:

```shell
pnpm dev
```

Build all packages and apps:

```shell
pnpm build
```

Lint the workspace:

```shell
pnpm lint
```

To run a command for one workspace:

```shell
pnpm --filter @umami/react-zen build
pnpm --filter react-zen-docs dev
```

The documentation development server runs at `http://localhost:9001`.

## License

[MIT](./LICENSE)
