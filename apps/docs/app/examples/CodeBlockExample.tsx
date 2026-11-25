'use client';

import {
  Box,
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
  useHighlightedCode,
} from '@umami/react-zen';
import { FileCode } from 'lucide-react';
import type { ReactNode } from 'react';

type LineVariant = 'default' | 'added' | 'removed' | 'highlighted';

function renderLines(lines: ReactNode[], getVariant?: (index: number) => LineVariant) {
  return lines.map((line, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: lines are identified by their position
    <CodeBlockLine key={index} variant={getVariant?.(index)}>
      {line}
    </CodeBlockLine>
  ));
}

const buttonCode = `import { Button } from '@umami/react-zen';

export function SaveButton() {
  return <Button onClick={() => save()}>Save</Button>;
}
`;

const configCode = `export default {
  name: 'zen',
  theme: 'neutral',
  darkMode: 'class',
  plugins: [],
};
`;

const diffCode = `export function Greeting({ name }) {
  return <p>Hello, {name}</p>;
  return <Text>Hello, {name}</Text>;
}
`;

const diffVariants = ['default', 'removed', 'added', 'default'] as const;

const installCode = 'pnpm add @umami/react-zen';

export function CodeBlockExample() {
  const lines = useHighlightedCode(buttonCode, 'tsx');

  return (
    <Box width="100%">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <FileCode />
            SaveButton.tsx
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={buttonCode} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{renderLines(lines)}</CodeBlockContent>
      </CodeBlock>
    </Box>
  );
}

export function CodeBlockLineNumbersExample() {
  const lines = useHighlightedCode(configCode, 'ts');

  return (
    <Box width="100%">
      <CodeBlock>
        <CodeBlockContent lineNumbers>
          {renderLines(lines, index => (index === 2 ? 'highlighted' : 'default'))}
        </CodeBlockContent>
      </CodeBlock>
    </Box>
  );
}

export function CodeBlockDiffExample() {
  const lines = useHighlightedCode(diffCode, 'tsx');

  return (
    <Box width="100%">
      <CodeBlock>
        <CodeBlockContent>{renderLines(lines, index => diffVariants[index])}</CodeBlockContent>
      </CodeBlock>
    </Box>
  );
}

export function CodeBlockFloatingActionsExample() {
  const lines = useHighlightedCode(installCode, 'bash');

  return (
    <Box width="100%">
      <CodeBlock>
        <CodeBlockActions>
          <CodeBlockCopyButton value={installCode} />
        </CodeBlockActions>
        <CodeBlockContent>{renderLines(lines)}</CodeBlockContent>
      </CodeBlock>
    </Box>
  );
}
