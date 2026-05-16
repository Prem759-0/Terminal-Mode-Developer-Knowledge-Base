'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { KnowledgeEntry } from '@/types';
import { parseTags } from '@/lib/utils';
import { TagChip } from './TagChip';
import { Save, X } from 'lucide-react';

interface EntryEditorProps {
  entry?: KnowledgeEntry | null;
  onSave: (data: { title: string; content: string; tags: string[] }) => void;
  onCancel: () => void;
}

export function EntryEditor({ entry, onSave, onCancel }: EntryEditorProps) {
  const [title, setTitle] = useState(entry?.title ?? '');
  const [content, setContent] = useState(entry?.content ?? '');
  const [tagInput, setTagInput] = useState(entry?.tags.join(', ') ?? '');
  const [tags, setTags] = useState<string[]>(entry?.tags ?? []);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    setTags(parseTags(tagInput));
  }, [tagInput]);

  function validate(): boolean {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'TITLE is required';
    if (!content.trim()) newErrors.content = 'CONTENT is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ title: title.trim(), content: content.trim(), tags });
  }

  const isEdit = !!entry;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-full"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
      >
        <span
          className="text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: 'var(--accent-secondary)' }}
        >
          {isEdit ? '// EDIT ENTRY' : '// NEW ENTRY'}
        </span>
        <button
          onClick={onCancel}
          className="p-1.5 rounded hover:bg-white/5 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Title */}
        <div>
          <label
            className="block text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            TITLE:
          </label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
            }}
            placeholder="Entry title..."
            className="w-full px-3 py-2 text-sm rounded bg-transparent outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: errors.title
                ? '1px solid var(--error)'
                : '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-jetbrains), monospace',
            }}
            onFocus={(e) => {
              if (!errors.title) {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 1px rgba(0,245,255,0.15)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.title ? 'var(--error)' : 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.title && (
            <p className="text-[10px] mt-1" style={{ color: 'var(--error)' }}>
              {errors.title}
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label
            className="block text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            CONTENT: <span className="opacity-50 normal-case">(markdown supported)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (errors.content) setErrors((p) => ({ ...p, content: undefined }));
            }}
            placeholder="Write your knowledge entry... Supports **bold**, *italic*, `code`, ## headings, and - lists"
            rows={12}
            className="w-full px-3 py-2 text-sm rounded outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: errors.content
                ? '1px solid var(--error)'
                : '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-jetbrains), monospace',
              lineHeight: '1.6',
              minHeight: '200px',
            }}
            onFocus={(e) => {
              if (!errors.content) {
                e.target.style.borderColor = 'var(--accent)';
                e.target.style.boxShadow = '0 0 0 1px rgba(0,245,255,0.15)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.content ? 'var(--error)' : 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {errors.content && (
            <p className="text-[10px] mt-1" style={{ color: 'var(--error)' }}>
              {errors.content}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label
            className="block text-[10px] uppercase tracking-widest mb-1.5 font-semibold"
            style={{ color: 'var(--text-muted)' }}
          >
            TAGS: <span className="opacity-50 normal-case">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="react, hooks, performance"
            className="w-full px-3 py-2 text-sm rounded outline-none transition-all"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-jetbrains), monospace',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.boxShadow = '0 0 0 1px rgba(0,245,255,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <TagChip key={tag} tag={tag} size="sm" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-4 py-3 border-t flex gap-3 shrink-0"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
      >
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded transition-all"
          style={{
            background: 'rgba(57, 255, 20, 0.1)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(57, 255, 20, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(57,255,20,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(57, 255, 20, 0.1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Save size={13} />
          SAVE ENTRY
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs rounded transition-colors"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          CANCEL
        </button>
      </div>
    </motion.div>
  );
}
