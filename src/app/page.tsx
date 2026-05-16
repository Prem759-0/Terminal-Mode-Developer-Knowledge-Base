'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KnowledgeEntry, ViewMode, EditorMode, CommandLogEntry } from '@/types';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useToast } from '@/hooks/useToast';
import { generateId } from '@/lib/utils';

import { TagSidebar } from '@/components/knowledge/TagSidebar';
import { EntryList } from '@/components/knowledge/EntryList';
import { EntryDetail } from '@/components/knowledge/EntryDetail';
import { EntryEditor } from '@/components/knowledge/EntryEditor';
import { TerminalPrompt } from '@/components/terminal/TerminalPrompt';
import { CommandLog } from '@/components/terminal/CommandLog';
import { StatusBar } from '@/components/terminal/StatusBar';
import { HelpOverlay } from '@/components/terminal/HelpOverlay';

export default function Home() {
  const {
    entries,
    createEntry,
    updateEntry,
    deleteEntry,
    getFilteredEntries,
    getAllTags,
    exportEntries,
  } = useKnowledgeBase();

  const { showToast } = useToast();

  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editorMode, setEditorMode] = useState<EditorMode>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandLog, setCommandLog] = useState<CommandLogEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addLog = useCallback(
    (
      input: string,
      output: string,
      type: CommandLogEntry['type'] = 'info'
    ) => {
      setCommandLog((prev) => [
        ...prev.slice(-20),
        {
          id: generateId(),
          input,
          output,
          type,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    []
  );

  const handleCommand = useCallback(
    (raw: string) => {
      const parts = raw.trim().split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');

      switch (cmd) {
        case 'new':
          setEditorMode('create');
          setSelectedEntry(null);
          setViewMode('editor');
          addLog(raw, 'Opening new entry editor...', 'info');
          break;

        case 'search':
          if (!args) {
            addLog(raw, 'Usage: search <query>', 'error');
          } else {
            setSearchQuery(args);
            setActiveTag(null);
            setViewMode('list');
            const count = getFilteredEntries(args, null).length;
            addLog(raw, `Found ${count} entries matching "${args}"`, 'success');
          }
          break;

        case 'tag':
          if (!args) {
            addLog(raw, 'Usage: tag <tagname>', 'error');
          } else {
            const tagLower = args.toLowerCase();
            setActiveTag(tagLower);
            setSearchQuery('');
            setViewMode('list');
            const tagCount = getFilteredEntries('', tagLower).length;
            addLog(raw, `Filtering by tag #${tagLower} — ${tagCount} entries`, 'success');
          }
          break;

        case 'clear':
          setSearchQuery('');
          setActiveTag(null);
          addLog(raw, 'Filters cleared', 'success');
          break;

        case 'help':
          setShowHelp(true);
          addLog(raw, 'Showing help overlay', 'info');
          break;

        case 'export':
          exportEntries();
          addLog(raw, 'Entries exported to JSON file', 'success');
          showToast('Export complete', 'success');
          break;

        case 'list':
          setViewMode('list');
          setSelectedEntry(null);
          addLog(raw, `Listing all ${entries.length} entries`, 'info');
          break;

        case 'delete':
          if (!args) {
            addLog(raw, 'Usage: delete <id>', 'error');
          } else {
            const toDelete = entries.find((e) => e.id === args.padStart(4, '0') || e.id === args);
            if (toDelete) {
              deleteEntry(toDelete.id);
              if (selectedEntry?.id === toDelete.id) {
                setSelectedEntry(null);
                setViewMode('list');
              }
              addLog(raw, `Deleted entry [${toDelete.id}] "${toDelete.title}"`, 'success');
              showToast(`Entry deleted`, 'info');
            } else {
              addLog(raw, `Entry with ID "${args}" not found`, 'error');
            }
          }
          break;

        default:
          addLog(raw, `Unknown command: "${cmd}" — type 'help' for available commands`, 'error');
          showToast(`Unknown command: ${cmd}`, 'warning');
      }
    },
    [entries, getFilteredEntries, exportEntries, deleteEntry, selectedEntry, addLog, showToast]
  );

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
          return;
        }
        if (viewMode === 'editor') {
          setViewMode(selectedEntry ? 'detail' : 'list');
          return;
        }
        if (viewMode === 'detail') {
          setViewMode('list');
          setSelectedEntry(null);
          return;
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setEditorMode('create');
        setSelectedEntry(null);
        setViewMode('editor');
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowHelp((v) => !v);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showHelp, viewMode, selectedEntry]);

  const filteredEntries = getFilteredEntries(searchQuery, activeTag);
  const allTags = getAllTags();

  function handleSelectEntry(entry: KnowledgeEntry) {
    setSelectedEntry(entry);
    setViewMode('detail');
  }

  function handleEditEntry() {
    setEditorMode('edit');
    setViewMode('editor');
  }

  function handleDeleteEntry(id: string) {
    deleteEntry(id);
    setSelectedEntry(null);
    setViewMode('list');
    showToast('Entry deleted', 'info');
    addLog(`delete ${id}`, `Entry [${id}] deleted`, 'success');
  }

  function handleSaveEntry(data: { title: string; content: string; tags: string[] }) {
    if (editorMode === 'create') {
      const newEntry = createEntry(data);
      setSelectedEntry(newEntry);
      setViewMode('detail');
      showToast('Entry saved', 'success');
      addLog('save', `Entry [${newEntry.id}] "${newEntry.title}" created`, 'success');
    } else if (selectedEntry) {
      updateEntry(selectedEntry.id, data);
      setSelectedEntry({ ...selectedEntry, ...data, updatedAt: new Date().toISOString() });
      setViewMode('detail');
      showToast('Entry updated', 'success');
      addLog('save', `Entry [${selectedEntry.id}] updated`, 'success');
    }
  }

  if (!mounted) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center"
        style={{ background: 'var(--bg-base)' }}
      >
        <span
          className="text-sm font-mono animate-pulse"
          style={{ color: 'var(--accent)' }}
        >
          INITIALIZING...
        </span>
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ background: 'var(--bg-base)', fontFamily: 'var(--font-jetbrains), monospace' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center px-4 py-2 border-b shrink-0"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-surface)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold glow-cyan" style={{ color: 'var(--accent)' }}>
            KB
          </span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            //
          </span>
          <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Knowledge Base
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setShowHelp(true)}
            className="text-[10px] px-2 py-1 rounded transition-colors"
            style={{
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
          >
            ?
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Tag sidebar */}
        <TagSidebar
          tags={allTags}
          activeTag={activeTag}
          onTagSelect={setActiveTag}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          totalEntries={entries.length}
        />

        {/* Entry list */}
        <div className="flex-[0_0_280px] min-w-0 flex flex-col overflow-hidden border-r" style={{ borderColor: 'var(--border)' }}>
          <EntryList
            entries={filteredEntries}
            selectedId={selectedEntry?.id ?? null}
            onSelect={handleSelectEntry}
            searchQuery={searchQuery}
            activeTag={activeTag}
            onNewEntry={() => {
              setEditorMode('create');
              setSelectedEntry(null);
              setViewMode('editor');
            }}
          />
        </div>

        {/* Detail / Editor panel */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'editor' ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <EntryEditor
                  entry={editorMode === 'edit' ? selectedEntry : null}
                  onSave={handleSaveEntry}
                  onCancel={() =>
                    setViewMode(selectedEntry ? 'detail' : 'list')
                  }
                />
              </motion.div>
            ) : viewMode === 'detail' && selectedEntry ? (
              <motion.div
                key={`detail-${selectedEntry.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <EntryDetail
                  entry={selectedEntry}
                  onEdit={handleEditEntry}
                  onDelete={handleDeleteEntry}
                  onClose={() => {
                    setSelectedEntry(null);
                    setViewMode('list');
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empty-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="h-full flex items-center justify-center"
                style={{ background: 'var(--bg-base)' }}
              >
                <div className="text-center">
                  <p
                    className="text-[11px] font-mono"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    select an entry to view
                  </p>
                  <p
                    className="text-[10px] mt-1"
                    style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                  >
                    or type{' '}
                    <code
                      style={{ color: 'var(--accent)' }}
                    >
                      new
                    </code>{' '}
                    to create one
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Terminal area */}
      <div className="shrink-0">
        <CommandLog entries={commandLog} />
        <TerminalPrompt
          onCommand={handleCommand}
          onFocus={() => {}}
        />
      </div>

      {/* Status bar */}
      <StatusBar
        totalEntries={entries.length}
        filteredCount={filteredEntries.length}
        activeTag={activeTag}
        searchQuery={searchQuery}
        viewMode={viewMode}
      />

      {/* Help overlay */}
      <HelpOverlay open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
