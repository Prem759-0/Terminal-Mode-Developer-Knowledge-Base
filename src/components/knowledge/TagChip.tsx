'use client';

interface TagChipProps {
  tag: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md';
}

export function TagChip({
  tag,
  active = false,
  onClick,
  onRemove,
  size = 'sm',
}: TagChipProps) {
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono font-medium transition-all ${sizeClasses} ${onClick ? 'cursor-pointer' : ''}`}
      style={
        active
          ? {
              background: 'rgba(0, 245, 255, 0.12)',
              border: '1px solid rgba(0, 245, 255, 0.4)',
              color: 'var(--accent)',
              boxShadow: '0 0 8px rgba(0, 245, 255, 0.15)',
            }
          : {
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }
      }
      onClick={onClick}
    >
      <span className="opacity-60">#</span>
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
          aria-label={`Remove tag ${tag}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
