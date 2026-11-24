import { useEffect, useState } from 'react';
import { type Theme, useTheme } from '@/components/hooks/useTheme';
import { Monitor, Moon, Sun } from '@/components/icons';
import { cn } from '@/lib/utils';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeSwitcherProps {
  className?: string;
}

const STORAGE_KEY = 'theme-mode';

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { setTheme } = useTheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  // Initialize mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setMode(stored);
    }
  }, []);

  // Apply theme when mode changes
  useEffect(() => {
    if (mode === 'system') {
      setTheme(getSystemTheme());
    } else {
      setTheme(mode);
    }
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode, setTheme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode, setTheme]);

  const options: { value: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun />, label: 'Light' },
    { value: 'dark', icon: <Moon />, label: 'Dark' },
    { value: 'system', icon: <Monitor />, label: 'System' },
  ];

  return (
    <div
      className={cn(
        'inline-flex items-center overflow-hidden rounded-md border bg-background shadow-xs dark:border-input dark:bg-input/30',
        className,
      )}
    >
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => setMode(option.value)}
          aria-label={option.label}
          aria-pressed={mode === option.value}
          className={cn(
            'flex size-9 cursor-pointer items-center justify-center outline-none transition-colors [&_svg]:size-4',
            'not-first:border-l dark:not-first:border-input',
            'hover:bg-muted hover:text-foreground',
            'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset',
            mode === option.value ? 'bg-muted text-foreground' : 'text-muted-foreground',
          )}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
