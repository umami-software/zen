import { useContext } from 'react';
import { create } from 'zustand';
import { ToastContext } from '@/components/toast/ToastProvider';

let TOAST_ID = 1;
const TOAST_DURATION = 0;

export type ToastVariant = 'default' | 'success' | 'destructive';

export interface ToastOptions {
  duration?: number;
  title?: string;
  actions?: string[];
  allowClose?: boolean;
  variant?: ToastVariant;
  onClose?: (action?: string) => void;
}

export interface ToastState extends ToastOptions {
  id: string;
  message: string;
  timestamp: number;
}

const initialState: { duration: number; toasts: ToastState[] } = {
  duration: TOAST_DURATION,
  toasts: [],
};

const store = create(() => ({ ...initialState }));

export function removeToast(id: string) {
  store.setState(({ toasts }) => {
    return { toasts: toasts.filter(toast => toast.id !== id) };
  });
}

function displayToast(
  message: string,
  { duration = TOAST_DURATION, ...options }: ToastOptions = {},
) {
  const id = `toast-${TOAST_ID++}`;

  store.setState(({ toasts }) => {
    return {
      toasts: [...toasts, { ...options, id, message, timestamp: Date.now() }],
    };
  });
}

export function useToast() {
  const { toasts } = store();
  const config = useContext(ToastContext);

  const toast = (message: string, options?: ToastOptions) => {
    displayToast(message, { ...options, ...config });
  };

  return { toast, toasts };
}
