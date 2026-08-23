'use client';

import { Box, Button, DataTable, Flexbox, type FlexboxProps } from '@umami/react-zen';
import { Children, isValidElement, type ReactNode, useState } from 'react';
import { ExampleCode } from '../components/ExampleCode';

function isCodeBlock(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;

  const type = child.type as any;

  // Check for pre element
  if (type === 'pre') return true;

  // Check for component name containing 'Code' or 'Pre'
  const name = type.displayName || type.name || '';
  if (name.includes('Code') || name.includes('Pre')) return true;

  // Check if it has a 'data-rehype-pretty-code-figure' or similar attribute
  if (child.props?.['data-rehype-pretty-code-figure'] !== undefined) return true;

  // Check for wrappers used by documentation code blocks.
  if (type === 'figure') return true;

  // Check className for code-related classes
  const className = (child.props as { className?: string })?.className || '';

  return className.includes('code') || className.includes('highlight');
}

interface SeparatedChildren {
  preview: ReactNode[];
  code: ReactNode | null;
  codeFirst: boolean;
}

function separateChildren(children: ReactNode): SeparatedChildren {
  const preview: ReactNode[] = [];
  let code: ReactNode | null = null;
  let codeFirst = false;
  let foundFirst = false;

  Children.forEach(children, child => {
    if (isCodeBlock(child)) {
      code = child;
      if (!foundFirst) {
        codeFirst = true;
      }
    } else {
      preview.push(child);
    }
    foundFirst = true;
  });

  return { preview, code, codeFirst };
}

export function Example({
  direction = 'column',
  alignItems = 'center',
  justifyContent = 'center',
  gap = '3',
  padding = '8',
  marginY = '6',
  border = true,
  borderRadius = 'lg',
  minHeight = '300px',
  wrap = 'wrap',
  position = 'relative',
  overflow = 'hidden',
  backgroundColor = 'surface-base',
  className,
  children,
  ...props
}: FlexboxProps) {
  const { preview, code, codeFirst } = separateChildren(children);
  // Prop reference tables don't need the demo min-height; without this they
  // get vertically centered inside 300px with dead space above and below.
  const isTableOnly =
    preview.length > 0 &&
    preview.every(child => isValidElement(child) && child.type === DataTable);
  // If code comes first, show preview by default (expanded); otherwise hide code by default
  const [showSecondary, setShowSecondary] = useState(codeFirst);

  const toggleButton = (
    <Box position="absolute" className="bottom-2 right-2">
      <Button size="xs" onPress={() => setShowSecondary(!showSecondary)}>
        {codeFirst
          ? showSecondary
            ? 'Hide preview'
            : 'Show preview'
          : showSecondary
            ? 'Hide code'
            : 'Show code'}
      </Button>
    </Box>
  );

  const codeBlock = (
    <Box position="relative">
      <ExampleCode>{code}</ExampleCode>
      {codeFirst && toggleButton}
    </Box>
  );

  const previewBlock = (
    <Flexbox
      {...props}
      // Exclude live demos from shiso's markdown typography styles.
      className={['not-prose', className].filter(Boolean).join(' ')}
      {...{
        direction,
        alignItems,
        justifyContent,
        gap,
        padding,
        minHeight: isTableOnly ? '0' : minHeight,
        wrap,
        position,
        overflow,
        backgroundColor,
      }}
    >
      {preview}
      {!codeFirst && code && toggleButton}
    </Flexbox>
  );

  if (codeFirst) {
    // Code first: show code always, toggle preview
    return (
      <Box marginY="6" border borderRadius={borderRadius} overflow="hidden">
        {codeBlock}
        {showSecondary && <Box border="top">{previewBlock}</Box>}
      </Box>
    );
  }

  // Preview first (default): show preview always, toggle code
  return (
    <Box marginY="6" border borderRadius={borderRadius} overflow="hidden">
      {previewBlock}
      {showSecondary && code && <Box border="top">{codeBlock}</Box>}
    </Box>
  );
}
