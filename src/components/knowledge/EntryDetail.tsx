'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { KnowledgeEntry } from '@/types';
import { formatFullDate, formatRelativeDate } from '@/lib/utils';
import { TagChip } from './TagChip';
import { MarkdownRenderer } from './MarkdownRenderer';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Edit2, Trash2, X } from 'lucide-react';

interface EntryDetailProps {
  entry: KnowledgeEntry;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function EntryDetail({ entry, onEdit, onDelete, onClose }: EntryDetailProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <motion.div
        key={entry.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col h-full overflow-hidden"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* Header */}
        <div
          className="px-4 py-3 border-b flex items-start justify-between gap-3 shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[10px] font-mono"
                style={{ color: 'var(--text-muted)' }}
              >
                [{entry.id}]
              </span>
              <span
                className="text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                {formatRelativeDate(entry.updatedAt)}
              </span>
            </div>
            <h2
              className="text-base font-semibold leading-tight truncate"
              style={{ color: 'var(--accent)' }}
            >
              {entry.title}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 rounded transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
              title="Edit entry"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--error)' }}
              title="Delete entry"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,64,64,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-muted)' }}
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Meta */}
        <div
          className="px-4 py-2 border-b flex items-center gap-4 shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex flex-wrap gap-1">
            {entry.tags.map((tag) => (
              <TagChip key={tag} tag={tag} size="sm" />
            ))}
            {entry.tags.length === 0 && (
              <span
                className="text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                no tags
              </span>
            )}
          </div>
        </div>
        <div
          className="px-4 py-1.5 border-b shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <span
            className="text-[10px]"
            style={{ color: 'var(--text-muted)' }}
          >
            created {formatFullDate(entry.createdAt)}
            {entry.updatedAt !== entry.createdAt &&
              ` · updated ${formatFullDate(entry.updatedAt)}`}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <MarkdownRenderer content={entry.content} />
        </div>
      </motion.div>

      <ConfirmDialog
        open={showConfirm}
        title="DELETE ENTRY"
        message={`Are you sure you want to delete "${entry.title}"? This action cannot be undone.`}
        confirmLabel="DELETE"
        onConfirm={() => {
          setShowConfirm(false);
          onDelete(entry.id);
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
