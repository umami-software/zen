'use client';

import { cn, PALETTES, type Palette, useTheme } from '@umami/react-zen';
import { useEffect, useState } from 'react';

interface PaletteSwitcherProps {
  className?: string;
}

const PALETTE_LABELS: Record<Palette, string> = {
  neutral: 'Neutral',
  slate: 'Slate',
  gray: 'Gray',
  zinc: 'Zinc',
  stone: 'Stone',
};

export function PaletteSwitcher({ className }: PaletteSwitcherProps) {
  const { palette, setPalette } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentPalette = mounted ? palette : 'neutral';

  return (
    <div
      className={cn(
        'inline-flex items-center bg-surface-base border border-edge rounded-md overflow-hidden',
        className,
      )}
    >
      {PALETTES.map(paletteOption => (
        <button
          key={paletteOption}
          type="button"
          onClick={() => setPalette(paletteOption)}
          aria-label={PALETTE_LABELS[paletteOption]}
          aria-pressed={currentPalette === paletteOption}
          className={cn(
            'px-3 h-9 flex items-center justify-center cursor-pointer outline-none transition-colors text-sm',
            '[&:not(:first-child)]:border-l [&:not(:first-child)]:border-edge',
            'hover:bg-interactive',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
            currentPalette === paletteOption
              ? 'bg-interactive text-foreground-primary'
              : 'text-foreground-muted',
          )}
        >
          {PALETTE_LABELS[paletteOption]}
        </button>
      ))}
    </div>
  );
}
