'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { TagChip } from './TagChip';

interface TagSidebarProps {
  tags: Map<string, number>;
  activeTag: string | null;
  onTagSelect: (tag: string | null) => void;
  collapsed: boolean;
  onToggle: () => void;
  totalEntries: number;
}

export function TagSidebar({
  tags,
  activeTag,
  onTagSelect,
  collapsed,
  onToggle,
  totalEntries,
}: TagSidebarProps) {
  return (
    <div
      className="relative flex flex-col border-r h-full transition-all duration-300"
      style={{
        width: collapsed ? '40px' : '200px',
        borderColor: 'var(--border)',
        background: 'var(--bg-surface)',
        minWidth: collapsed ? '40px' : '200px',
      }}
    >
      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
      </button>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div
              className="px-3 py-3 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-2">
                <Tag size={12} style={{ color: 'var(--accent)' }} />
                <span
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  Tags
                </span>
              </div>
            </div>

            {/* All entries option */}
            <div className="px-3 pt-3 pb-1">
              <button
                onClick={() => onTagSelect(null)}
                className="w-full flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors"
                style={{
                  background: activeTag === null ? 'rgba(0,245,255,0.08)' : 'transparent',
                  color: activeTag === null ? 'var(--accent)' : 'var(--text-secondary)',
                  border: activeTag === null ? '1px solid rgba(0,245,255,0.2)' : '1px solid transparent',
                }}
              >
                <span>ALL</span>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {totalEntries}
                </span>
              </button>
            </div>

            {/* Tag list */}
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
              {tags.size === 0 ? (
                <p
                  className="text-[10px] py-4 text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  no tags yet
                </p>
              ) : (
                Array.from(tags.entries()).map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => onTagSelect(activeTag === tag ? null : tag)}
                    className="w-full flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors"
                    style={{
                      background: activeTag === tag ? 'rgba(0,245,255,0.08)' : 'transparent',
                      color: activeTag === tag ? 'var(--accent)' : 'var(--text-secondary)',
                    }}
                  >
                    <span className="truncate"># {tag}</span>
                    <span
                      className="text-[10px] shrink-0 ml-1"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {count}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed icons */}
      {collapsed && (
        <div className="flex flex-col items-center pt-4 gap-3">
          <Tag size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
      )}
    </div>
  );
}
