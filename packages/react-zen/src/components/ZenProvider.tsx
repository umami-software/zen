import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';
import { type Palette, type Theme, useInitTheme } from '@/components/hooks/useTheme';
import type { ToasterProps } from '@/components/toast/Toaster';
import { ToastProvider } from '@/components/toast/ToastProvider';

const defaultToastConfig = {
  duration: 3000,
} satisfies ToasterProps;

export interface ZenTooltipConfig {
  /** How long to wait before opening a tooltip on hover, in milliseconds. */
  delay?: number;
  /** How long to wait before closing a tooltip, in milliseconds. */
  closeDelay?: number;
  /** Window in which an adjacent tooltip opens instantly, in milliseconds. */
  timeout?: number;
}

export interface ZenProviderProps {
  theme?: Theme;
  colorScheme?: 'light' | 'dark' | 'system';
  palette?: Palette;
  toast?: ToasterProps;
  /** Shared tooltip grouping/delay config. Defaults to Base UI's own defaults. */
  tooltip?: ZenTooltipConfig;
  children: ReactNode;
}

export function ZenProvider({
  children,
  theme,
  colorScheme,
  palette,
  toast,
  tooltip,
}: ZenProviderProps) {
  useInitTheme(theme, colorScheme, palette);

  return (
    <BaseTooltip.Provider {...tooltip}>
      <ToastProvider {...defaultToastConfig} {...toast}>
        {children}
      </ToastProvider>
    </BaseTooltip.Provider>
  );
}
