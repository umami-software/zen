import { animated, useTransition } from '@react-spring/web';
import { type ComponentProps, type RefObject, useEffect, useRef, useState } from 'react';
import { type Theme, useTheme } from '@/components/hooks/useTheme';
import { Moon, Sun } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ThemeButtonProps extends Omit<ComponentProps<typeof Button>, 'children'> {
  /**
   * Scope the theme to this element instead of the document. The button toggles the
   * `dark` class on the target only.
   */
  target?: RefObject<HTMLElement | null> | HTMLElement;
}

function getElement(target: RefObject<HTMLElement | null> | HTMLElement): HTMLElement | null {
  return 'current' in target ? target.current : target;
}

function applyTheme(element: HTMLElement, theme: Theme) {
  element.classList.toggle('dark', theme === 'dark');
}

export function ThemeButton({
  className,
  variant = 'ghost',
  size = 'icon',
  target,
  onClick,
  ...props
}: ThemeButtonProps) {
  const globalTheme = useTheme();
  const [localTheme, setLocalTheme] = useState<Theme | null>(null);
  const initializedRef = useRef(false);

  const isLocal = !!target;

  // Initialize local theme from global theme on mount and apply to target element
  useEffect(() => {
    if (isLocal && target && !initializedRef.current) {
      const element = getElement(target);
      if (element) {
        initializedRef.current = true;
        setLocalTheme(globalTheme.theme);
        applyTheme(element, globalTheme.theme);
      }
    }
  }, [isLocal, target, globalTheme.theme]);

  const theme = isLocal ? (localTheme ?? globalTheme.theme) : globalTheme.theme;

  const transitions = useTransition(theme, {
    initial: { opacity: 1 },
    from: {
      opacity: 0,
      transform: `translateY(${theme === 'light' ? '20px' : '-20px'}) scale(0.5)`,
    },
    enter: { opacity: 1, transform: 'translateY(0px) scale(1.0)' },
    leave: {
      opacity: 0,
      transform: `translateY(${theme === 'light' ? '-20px' : '20px'}) scale(0.5)`,
    },
  });

  const handleClick: ThemeButtonProps['onClick'] = event => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    if (isLocal && target) {
      const element = getElement(target);
      if (element) {
        applyTheme(element, newTheme);
        setLocalTheme(newTheme);
      }
    } else {
      globalTheme.setTheme(newTheme);
    }

    onClick?.(event);
  };

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      aria-label={props['aria-label'] ?? 'Toggle theme'}
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
    >
      {transitions((style, item) => (
        // @ts-expect-error react-spring's animated types lag behind React 19
        <animated.div
          key={item}
          style={style}
          className="absolute inset-0 flex items-center justify-center"
        >
          {item === 'light' ? <Sun /> : <Moon />}
        </animated.div>
      ))}
    </Button>
  );
}
