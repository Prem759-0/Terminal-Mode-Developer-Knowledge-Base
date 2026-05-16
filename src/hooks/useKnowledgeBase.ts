'use client';

import { useCallback, useEffect } from 'react';
import { KnowledgeEntry } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { generateId, generateEntryId } from '@/lib/utils';
import { STORAGE_KEY, STORAGE_SEEDED_KEY } from '@/lib/constants';
import { seedEntries } from '@/data/seedEntries';

export function useKnowledgeBase() {
  const [entries, setEntries] = useLocalStorage<KnowledgeEntry[]>(
    STORAGE_KEY,
    []
  );

  // Seed on first visit
  useEffect(() => {
    const seeded = localStorage.getItem(STORAGE_SEEDED_KEY);
    if (!seeded) {
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing || JSON.parse(existing).length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedEntries));
        localStorage.setItem(STORAGE_SEEDED_KEY, 'true');
        // Force re-read
        window.location.reload();
      } else {
        localStorage.setItem(STORAGE_SEEDED_KEY, 'true');
      }
    }
  }, []);

  const createEntry = useCallback(
    (data: { title: string; content: string; tags: string[] }): KnowledgeEntry => {
      const now = new Date().toISOString();
      const newEntry: KnowledgeEntry = {
        id: generateEntryId(entries),
        title: data.title,
        content: data.content,
        tags: data.tags,
        createdAt: now,
        updatedAt: now,
      };
      setEntries((prev) => [newEntry, ...prev]);
      return newEntry;
    },
    [entries, setEntries]
  );

  const updateEntry = useCallback(
    (
      id: string,
      data: Partial<Pick<KnowledgeEntry, 'title' | 'content' | 'tags'>>
    ): void => {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, ...data, updatedAt: new Date().toISOString() }
            : e
        )
      );
    },
    [setEntries]
  );

  const deleteEntry = useCallback(
    (id: string): void => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    },
    [setEntries]
  );

  const getFilteredEntries = useCallback(
    (query: string, activeTag: string | null): KnowledgeEntry[] => {
      let filtered = [...entries];
      if (activeTag) {
        filtered = filtered.filter((e) => e.tags.includes(activeTag));
      }
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q) ||
            e.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return filtered;
    },
    [entries]
  );

  const getAllTags = useCallback((): Map<string, number> => {
    const tagMap = new Map<string, number>();
    entries.forEach((e) => {
      e.tags.forEach((t) => {
        tagMap.set(t, (tagMap.get(t) ?? 0) + 1);
      });
    });
    return new Map([...tagMap.entries()].sort((a, b) => b[1] - a[1]));
  }, [entries]);

  const exportEntries = useCallback((): void => {
    const data = JSON.stringify(entries, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kb-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [entries]);

  return {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
    getFilteredEntries,
    getAllTags,
    exportEntries,
  };
}
