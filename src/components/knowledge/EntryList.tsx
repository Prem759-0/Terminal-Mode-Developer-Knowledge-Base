'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { KnowledgeEntry } from '@/types';
import { EntryCard } from './EntryCard';
import { Terminal } from 'lucide-react';

interface EntryListProps {
  entries: KnowledgeEntry[];
  selectedId: string | null;
  onSelect: (entry: KnowledgeEntry) => void;
  searchQuery: string;
  activeTag: string | null;
  onNewEntry: () => void;
}

export function EntryList({
  entries,
  selectedId,
  onSelect,
  searchQuery,
  activeTag,
  onNewEntry,
}: EntryListProps) {
  return (
    <div
      className="flex flex-col h-full border-r"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-base)',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div
        className="px-3 py-2.5 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-2">
          <Terminal size={12} style={{ color: 'var(--accent)' }} />
          <span
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            Entries
          </span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(0,245,255,0.08)',
              color: 'var(--accent)',
              border: '1px solid rgba(0,245,255,0.2)',
            }}
          >
            {entries.length}
          </span>
        </div>
        {(searchQuery || activeTag) && (
          <span
            className="text-[10px]"
            style={{ color: 'var(--warning)' }}
          >
            filtered
          </span>
        )}
      </div>

      {/* Entry list */}
      <div className="flex-1 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div
              className="text-xs mb-4 leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              {searchQuery || activeTag ? (
                <>
                  <span style={{ color: 'var(--warning)' }}>NO RESULTS</span>
                  <br />
                  no entries match the current filter
                </>
              ) : (
                <>
                  <span
                    className="text-sm font-semibold block mb-2"
                    style={{ color: 'var(--accent)' }}
                  >
                    SYSTEM EMPTY
                  </span>
                  type{' '}
                  <code
                    className="px-1 py-0.5 rounded text-[11px]"
                    style={{
                      background: 'rgba(0,245,255,0.1)',
                      color: 'var(--accent)',
                      border: '1px solid rgba(0,245,255,0.2)',
                    }}
                  >
                    new
                  </code>{' '}
                  to initialize first entry
                </>
              )}
            </div>
            {!searchQuery && !activeTag && (
              <button
                onClick={onNewEntry}
                className="text-[11px] px-3 py-1.5 rounded transition-all"
                style={{
                  background: 'rgba(0,245,255,0.08)',
                  border: '1px solid rgba(0,245,255,0.3)',
                  color: 'var(--accent)',
                }}
              >
                + NEW ENTRY
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                selected={selectedId === entry.id}
                onClick={() => onSelect(entry)}
                searchQuery={searchQuery}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
