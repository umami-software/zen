'use client';

import { cn, PALETTES, type Palette, useTheme } from '@umami/react-zen';
import { useEffect, useState } from 'react';

interface PaletteSwitcherProps {
  className?: string;
}

const PALETTE_LABELS: Record<Palette, string> = {
  neutral: 'Neutral',
  stone: 'Stone',
  zinc: 'Zinc',
  mauve: 'Mauve',
  olive: 'Olive',
  mist: 'Mist',
  taupe: 'Taupe',
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
        'inline-flex flex-wrap items-center overflow-hidden rounded-lg border border-border bg-background',
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
            'flex h-8 cursor-pointer items-center justify-center px-3 text-sm outline-none transition-colors',
            '[&:not(:first-child)]:border-l [&:not(:first-child)]:border-border',
            'hover:bg-muted',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
            currentPalette === paletteOption
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground',
          )}
        >
          {PALETTE_LABELS[paletteOption]}
        </button>
      ))}
    </div>
  );
}
