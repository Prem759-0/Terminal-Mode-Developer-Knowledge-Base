'use client';

interface StatusBarProps {
  totalEntries: number;
  filteredCount: number;
  activeTag: string | null;
  searchQuery: string;
  viewMode: string;
}

export function StatusBar({
  totalEntries,
  filteredCount,
  activeTag,
  searchQuery,
  viewMode,
}: StatusBarProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1 text-[10px] font-mono shrink-0"
      style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border)',
        color: 'var(--text-muted)',
      }}
    >
      <div className="flex items-center gap-4">
        <span>
          <span style={{ color: 'var(--accent)' }}>KB</span>
          {' '}v1.0.0
        </span>
        <span>
          entries:{' '}
          <span style={{ color: 'var(--text-primary)' }}>{totalEntries}</span>
        </span>
        {(activeTag || searchQuery) && (
          <span>
            showing:{' '}
            <span style={{ color: 'var(--warning)' }}>{filteredCount}</span>
          </span>
        )}
        {activeTag && (
          <span>
            tag:{' '}
            <span style={{ color: 'var(--accent)' }}>#{activeTag}</span>
          </span>
        )}
        {searchQuery && (
          <span>
            search:{' '}
            <span style={{ color: 'var(--accent)' }}>&quot;{searchQuery}&quot;</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span>
          mode:{' '}
          <span style={{ color: 'var(--accent-secondary)' }}>
            {viewMode.toUpperCase()}
          </span>
        </span>
        <span className="opacity-50">
          Ctrl+N new · Ctrl+F search · ? help
        </span>
      </div>
    </div>
  );
}
