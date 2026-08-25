import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from '@/components/icons';
import { type Theme, useTheme } from './hooks/useTheme';
import { Icon } from './Icon';
import { cn } from './lib/tailwind';

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
        'inline-flex items-center bg-surface-base border border-edge rounded-md overflow-hidden',
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
            'size-9 flex items-center justify-center cursor-pointer outline-none transition-colors',
            '[&:not(:first-child)]:border-l [&:not(:first-child)]:border-edge',
            'hover:bg-interactive',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
            mode === option.value
              ? 'bg-interactive text-foreground-primary'
              : 'text-foreground-muted',
          )}
        >
          <Icon size="sm">{option.icon}</Icon>
        </button>
      ))}
    </div>
  );
}
