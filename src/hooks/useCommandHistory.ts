'use client';

import { useState, useCallback } from 'react';

const MAX_HISTORY = 50;

export function useCommandHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushCommand = useCallback((cmd: string) => {
    if (!cmd.trim()) return;
    setHistory((prev) => {
      const next = [cmd, ...prev.filter((c) => c !== cmd)].slice(
        0,
        MAX_HISTORY
      );
      return next;
    });
    setHistoryIndex(-1);
  }, []);

  const navigateUp = useCallback(
    (currentInput: string): string => {
      if (history.length === 0) return currentInput;
      const newIndex = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(newIndex);
      return history[newIndex] ?? currentInput;
    },
    [history, historyIndex]
  );

  const navigateDown = useCallback(
    (): string => {
      if (historyIndex <= 0) {
        setHistoryIndex(-1);
        return '';
      }
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      return history[newIndex] ?? '';
    },
    [history, historyIndex]
  );

  const resetIndex = useCallback(() => {
    setHistoryIndex(-1);
  }, []);

  return { history, pushCommand, navigateUp, navigateDown, resetIndex };
}
