'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'CONFIRM',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onCancel}
          />
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-sm p-6 rounded font-mono"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--error)',
                boxShadow: '0 0 20px rgba(255, 64, 64, 0.15)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle size={18} className="text-[var(--error)] shrink-0" />
                <h2 className="text-[var(--error)] text-sm font-semibold uppercase tracking-wider">
                  {title}
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
                {message}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 text-sm text-[var(--text-secondary)] border border-[var(--border)] rounded hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-2 text-sm font-semibold rounded transition-all"
                  style={{
                    background: 'rgba(255, 64, 64, 0.15)',
                    border: '1px solid var(--error)',
                    color: 'var(--error)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 64, 64, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 64, 64, 0.15)';
                  }}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
