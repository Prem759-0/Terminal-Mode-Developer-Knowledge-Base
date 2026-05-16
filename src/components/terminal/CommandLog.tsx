'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CommandLogEntry } from '@/types';

interface CommandLogProps {
  entries: CommandLogEntry[];
}

const TYPE_COLORS = {
  success: 'var(--success)',
  error: 'var(--error)',
  info: 'var(--accent)',
  system: 'var(--text-muted)',
};

const TYPE_PREFIXES = {
  success: '✓',
  error: '✗',
  info: '→',
  system: '·',
};

export function CommandLog({ entries }: CommandLogProps) {
  if (entries.length === 0) return null;

  return (
    <div
      className="px-3 py-1 border-t max-h-24 overflow-y-auto"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {entries.slice(-5).map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex gap-2 items-start py-0.5"
          >
            <span
              className="text-[10px] shrink-0 font-mono"
              style={{ color: TYPE_COLORS[entry.type] }}
            >
              {TYPE_PREFIXES[entry.type]}
            </span>
            <span
              className="text-[11px] font-mono leading-relaxed"
              style={{ color: TYPE_COLORS[entry.type] }}
            >
              {entry.output}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
