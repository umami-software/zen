import type { ComponentProps, ReactNode } from 'react';
import { type Palette, type Theme, useInitTheme } from '@/components/hooks/useTheme';
import type { ToasterProps } from '@/components/toast/Toaster';
import { ToastProvider } from '@/components/toast/ToastProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

const defaultToastConfig = {
  duration: 3000,
} satisfies ToasterProps;

export interface ZenProviderProps {
  theme?: Theme;
  colorScheme?: 'light' | 'dark' | 'system';
  palette?: Palette;
  toast?: ToasterProps;
  /** Props for the shared `TooltipProvider` (`delay`, `closeDelay`, `timeout`). */
  tooltip?: Omit<ComponentProps<typeof TooltipProvider>, 'children'>;
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
    <TooltipProvider {...tooltip}>
      <ToastProvider {...defaultToastConfig} {...toast}>
        {children}
      </ToastProvider>
    </TooltipProvider>
  );
}
