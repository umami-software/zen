import { animated, useTransition } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { Box } from '@/components/Box';
import { Column } from '@/components/Column';
import { removeToast, useToast } from '@/components/hooks/useToast';
import { cn } from '@/components/lib/tailwind';
import { Toast } from '@/components/toast/Toast';
import '../Overlay.css';

export type ToastPosition =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'left'
  | 'right';

export interface ToasterProps {
  duration?: number;
  position?: ToastPosition;
}

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  top: 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  bottom: 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
  left: 'top-1/2 left-4 -translate-y-1/2 items-start',
  right: 'top-1/2 right-4 -translate-y-1/2 items-end',
};

const AnimatedBox = animated(Box);

export function Toaster({ duration = 0, position = 'bottom-right' }: ToasterProps) {
  const { toasts } = useToast();
  const [hovered, setHovered] = useState(false);

  const transitions = useTransition(toasts, {
    from: {
      opacity: 0,
      transform: position?.includes('left') ? 'translateX(-100%)' : 'translateX(100%)',
    },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: {
      opacity: 0,
      transform: position?.includes('top') ? 'translateY(-80%)' : 'translateY(80%)',
    },
    config: { duration: 100 },
  });

  useEffect(() => {
    if (!duration || hovered || !toasts.length) {
      return;
    }

    // One timer per toast instead of a global poller.
    const timers = toasts.map(toast => {
      const remaining = Math.max(toast.timestamp + duration - Date.now(), 0);

      return setTimeout(() => removeToast(toast.id), remaining);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [duration, toasts, hovered]);

  return (
    <Column
      gap="2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      data-slot="toaster"
      className={cn('zen-layer-toast fixed', positionClasses[position])}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {transitions((style, item) => {
        const { id, ...props } = item;

        return (
          <AnimatedBox key={id} style={style}>
            <Toast {...props} id={id} onClose={() => removeToast(id)} />
          </AnimatedBox>
        );
      })}
    </Column>
  );
}
