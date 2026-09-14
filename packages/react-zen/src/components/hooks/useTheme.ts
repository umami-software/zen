import { useEffect, useLayoutEffect } from 'react';
import { create } from 'zustand';

export type Theme = 'light' | 'dark';
export type Palette = 'neutral' | 'slate' | 'gray' | 'zinc' | 'stone';

export const PALETTES: Palette[] = ['neutral', 'slate', 'gray', 'zinc', 'stone'];

interface ThemeState {
  theme: Theme;
  palette: Palette;
  setTheme: (theme: Theme) => void;
  setPalette: (palette: Palette) => void;
  syncTheme: () => void;
  initTheme: (preferred?: Theme, colorScheme?: 'light' | 'dark' | 'system') => void;
  initPalette: (preferred?: Palette) => void;
}

// Use 'theme' key to sync with next-themes (used by Nextra)
const THEME_STORAGE_KEY = 'theme';
const PALETTE_STORAGE_KEY = 'zen.palette';

function getThemeFromDOM(): Theme {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getPaletteFromDOM(): Palette {
  if (typeof window === 'undefined') return 'neutral';
  const palette = document.documentElement.getAttribute('data-palette') as Palette | null;
  return palette && PALETTES.includes(palette) ? palette : 'neutral';
}

function getStoredPalette(): Palette {
  if (typeof window === 'undefined') return 'neutral';
  const stored = localStorage.getItem(PALETTE_STORAGE_KEY) as Palette | null;
  return stored && PALETTES.includes(stored) ? stored : 'neutral';
}

function resolveTheme(preferred?: Theme, colorScheme?: 'light' | 'dark' | 'system'): Theme {
  if (preferred) {
    return preferred;
  }
  if (colorScheme === 'light' || colorScheme === 'dark') {
    return colorScheme;
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function applyPalette(palette: Palette) {
  if (typeof window === 'undefined') return;
  document.documentElement.setAttribute('data-palette', palette);
}

export const useTheme = create<ThemeState>((set, get) => ({
  theme: 'light',
  palette: 'neutral',
  setTheme: theme => {
    set({ theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      applyTheme(theme);
    }
  },
  setPalette: palette => {
    set({ palette });
    if (typeof window !== 'undefined') {
      localStorage.setItem(PALETTE_STORAGE_KEY, palette);
      applyPalette(palette);
    }
  },
  syncTheme: () => {
    // Sync state from DOM (when next-themes changes the theme)
    const theme = getThemeFromDOM();
    const palette = getPaletteFromDOM();
    const state = get();
    if (theme !== state.theme) {
      set({ theme });
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (palette !== state.palette) {
      set({ palette });
    }
  },
  initTheme: (preferred?: Theme, colorScheme?: 'light' | 'dark' | 'system') => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const initial = resolveTheme(preferred || stored || undefined, colorScheme);

    set({ theme: initial });
    applyTheme(initial);
  },
  initPalette: (preferred?: Palette) => {
    if (typeof window === 'undefined') return;

    const initial = preferred || getStoredPalette();

    set({ palette: initial });
    applyPalette(initial);
  },
}));

export function useInitTheme(
  preferred?: Theme,
  colorScheme?: 'light' | 'dark' | 'system',
  preferredPalette?: Palette,
) {
  const initTheme = useTheme(s => s.initTheme);
  const initPalette = useTheme(s => s.initPalette);
  const syncTheme = useTheme(s => s.syncTheme);

  useLayoutEffect(() => {
    initTheme(preferred, colorScheme);
    initPalette(preferredPalette);
  }, [preferred, colorScheme, preferredPalette, initTheme, initPalette]);

  // Watch for DOM changes from next-themes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'data-palette') {
          syncTheme();
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, [syncTheme]);
}
