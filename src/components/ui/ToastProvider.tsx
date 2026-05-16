'use client';

import React, { createContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { ToastMessage } from '@/types';
import { generateId } from '@/lib/utils';

interface ToastContextValue {
  showToast: (message: string, type?: ToastMessage['type']) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: { border: '#39ff14', text: '#39ff14', bg: 'rgba(57, 255, 20, 0.08)' },
  error: { border: '#ff4040', text: '#ff4040', bg: 'rgba(255, 64, 64, 0.08)' },
  warning: { border: '#ffb300', text: '#ffb300', bg: 'rgba(255, 179, 0, 0.08)' },
  info: { border: '#00f5ff', text: '#00f5ff', bg: 'rgba(0, 245, 255, 0.08)' },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info') => {
      const id = generateId();
      setToasts((prev) => [...prev.slice(-4), { id, type, message }]);
      const timer = setTimeout(() => dismissToast(id), 4000);
      timers.current.set(id, timer);
    },
    [dismissToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: '380px', width: 'calc(100vw - 32px)' }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const Icon = ICONS[toast.type];
            const colors = COLORS[toast.type];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 48, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 48, scale: 0.96 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-auto"
              >
                <div
                  className="flex items-start gap-3 px-4 py-3 rounded font-mono text-sm"
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                    boxShadow: `0 0 12px ${colors.border}40`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Icon
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={{ color: colors.text }}
                  />
                  <span className="text-[var(--text-primary)] flex-1 leading-snug">
                    {toast.message}
                  </span>
                  <button
                    onClick={() => dismissToast(toast.id)}
                    className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                    aria-label="Dismiss"
                  >
                    <X size={14} style={{ color: colors.text }} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
