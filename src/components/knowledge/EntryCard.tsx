'use client';

import { motion } from 'framer-motion';
import { KnowledgeEntry } from '@/types';
import { formatRelativeDate } from '@/lib/utils';
import { TagChip } from './TagChip';

interface EntryCardProps {
  entry: KnowledgeEntry;
  selected: boolean;
  onClick: () => void;
  searchQuery: string;
}

function getPreview(content: string, maxLen = 80): string {
  // Strip markdown syntax for preview
  const cleaned = content
    .replace(/```[\s\S]*?```/g, '[code]')
    .replace(/#{1,6} /g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^[-*] /gm, '')
    .replace(/\n+/g, ' ')
    .trim();
  return cleaned.length > maxLen ? cleaned.slice(0, maxLen) + '…' : cleaned;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        style={{
          background: 'rgba(0, 245, 255, 0.2)',
          color: 'var(--accent)',
          borderRadius: '2px',
          padding: '0 2px',
        }}
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export function EntryCard({
  entry,
  selected,
  onClick,
  searchQuery,
}: EntryCardProps) {
  const preview = getPreview(entry.content);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      onClick={onClick}
      className="px-3 py-3 cursor-pointer border-b transition-all"
      style={{
        borderColor: 'var(--border)',
        background: selected
          ? 'rgba(0, 245, 255, 0.05)'
          : 'transparent',
        borderLeft: selected
          ? '2px solid var(--accent)'
          : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.background = 'transparent';
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span
          className="text-[10px] font-mono shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          [{entry.id}]
        </span>
        <span
          className="text-[10px] font-mono shrink-0"
          style={{ color: 'var(--text-muted)' }}
        >
          {formatRelativeDate(entry.updatedAt)}
        </span>
      </div>

      <p
        className="text-sm font-medium mb-1.5 leading-tight"
        style={{ color: selected ? 'var(--accent)' : 'var(--text-primary)' }}
      >
        {highlightText(entry.title, searchQuery)}
      </p>

      <p
        className="text-[11px] leading-relaxed mb-2"
        style={{ color: 'var(--text-muted)' }}
      >
        {highlightText(preview, searchQuery)}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.slice(0, 4).map((tag) => (
            <TagChip key={tag} tag={tag} size="sm" />
          ))}
          {entry.tags.length > 4 && (
            <span
              className="text-[10px]"
              style={{ color: 'var(--text-muted)' }}
            >
              +{entry.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}
