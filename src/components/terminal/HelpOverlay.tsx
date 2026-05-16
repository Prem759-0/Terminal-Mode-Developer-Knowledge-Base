'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { COMMAND_DESCRIPTIONS, KEYBOARD_SHORTCUTS } from '@/lib/constants';

interface HelpOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function HelpOverlay({ open, onClose }: HelpOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            key="help"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-strong)',
                boxShadow: '0 0 40px rgba(0, 245, 255, 0.08)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <span
                  className="text-sm font-semibold font-mono"
                  style={{ color: 'var(--accent)' }}
                >
                  // HELP REFERENCE
                </span>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Commands */}
                <div>
                  <h3
                    className="text-[10px] uppercase tracking-widest font-semibold mb-3"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    COMMANDS
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(COMMAND_DESCRIPTIONS).map(([cmd, desc]) => (
                      <div key={cmd} className="flex items-start gap-3">
                        <code
                          className="text-[11px] px-2 py-0.5 rounded shrink-0"
                          style={{
                            background: 'rgba(0,245,255,0.08)',
                            border: '1px solid rgba(0,245,255,0.15)',
                            color: 'var(--accent)',
                            fontFamily: 'var(--font-jetbrains), monospace',
                          }}
                        >
                          {cmd}
                        </code>
                        <span
                          className="text-xs leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div>
                  <h3
                    className="text-[10px] uppercase tracking-widest font-semibold mb-3"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    KEYBOARD SHORTCUTS
                  </h3>
                  <div className="space-y-2">
                    {KEYBOARD_SHORTCUTS.map(({ keys, description }) => (
                      <div key={keys} className="flex items-center gap-3">
                        <kbd
                          className="text-[10px] px-2 py-0.5 rounded shrink-0 font-mono"
                          style={{
                            background: 'var(--bg-base)',
                            border: '1px solid var(--border-strong)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {keys}
                        </kbd>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="px-5 py-3 border-t text-[10px]"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                Knowledge Base v1.0.0 · All data stored locally in your browser
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
