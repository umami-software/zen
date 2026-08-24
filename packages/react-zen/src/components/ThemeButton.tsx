import { animated, useTransition } from '@react-spring/web';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { Moon, Sun } from '@/components/icons';
import { Button, type ButtonProps } from './Button';
import { type Theme, useTheme } from './hooks/useTheme';
import { Icon } from './Icon';
import type { PressEvent } from './lib/interaction';
import { cn } from './lib/tailwind';

export interface ThemeButtonProps extends Omit<ButtonProps, 'target'> {
  target?: RefObject<HTMLElement | null> | HTMLElement;
}

function getElement(target: RefObject<HTMLElement | null> | HTMLElement): HTMLElement | null {
  return 'current' in target ? target.current : target;
}

function applyTheme(element: HTMLElement, theme: Theme) {
  element.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    element.classList.add('dark');
  } else {
    element.classList.remove('dark');
  }
}

export function ThemeButton({
  className,
  variant = 'quiet',
  target,
  onPress,
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

  function handleClick(e: PressEvent) {
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

    onPress?.(e);
  }

  return (
    <Button
      {...props}
      className={cn(
        'w-[42px] flex justify-center items-center cursor-pointer [&>div]:flex [&>div]:justify-center [&>div]:items-center [&>div]:absolute',
        className,
      )}
      variant={variant}
      onPress={handleClick}
    >
      {transitions((style, item) => (
        // @ts-expect-error
        <animated.div key={item} style={style}>
          <Icon size="sm">{item === 'light' ? <Sun /> : <Moon />}</Icon>
        </animated.div>
      ))}
      &nbsp;
    </Button>
  );
}
