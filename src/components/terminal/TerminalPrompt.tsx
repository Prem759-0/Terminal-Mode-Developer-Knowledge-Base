'use client';

import { useState, useRef, useEffect } from 'react';
import { useCommandHistory } from '@/hooks/useCommandHistory';

interface TerminalPromptProps {
  onCommand: (cmd: string) => void;
  onFocus?: () => void;
}

export function TerminalPrompt({ onCommand, onFocus }: TerminalPromptProps) {
  const [value, setValue] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { pushCommand, navigateUp, navigateDown } = useCommandHistory();

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const cmd = value.trim();
      if (cmd) {
        pushCommand(cmd);
        onCommand(cmd);
        setValue('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = navigateUp(value);
      setValue(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = navigateDown();
      setValue(next);
    }
  }

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 border-t cursor-text"
      style={{
        borderColor: 'var(--border)',
        background: 'var(--bg-surface)',
      }}
      onClick={focusInput}
    >
      <span className="text-sm font-mono shrink-0" style={{ color: 'var(--accent)' }}>
        kb
      </span>
      <span className="text-sm font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
        ~
      </span>
      <span className="text-sm font-mono shrink-0" style={{ color: 'var(--accent-secondary)' }}>
        $
      </span>

      <div className="flex-1 relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          className="w-full bg-transparent outline-none text-sm font-mono caret-transparent"
          style={{ color: 'var(--text-primary)' }}
          placeholder=""
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />
        {/* Custom blinking cursor */}
        <span
          className="absolute text-sm font-mono pointer-events-none"
          style={{
            left: `${value.length * 0.6}em`,
            color: 'var(--accent)',
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.05s',
          }}
        >
          ▋
        </span>
        {value === '' && (
          <span
            className="absolute text-sm font-mono pointer-events-none"
            style={{ color: 'var(--text-muted)', opacity: 0.5 }}
          >
            type a command or &apos;help&apos;...
          </span>
        )}
      </div>
    </div>
  );
}
