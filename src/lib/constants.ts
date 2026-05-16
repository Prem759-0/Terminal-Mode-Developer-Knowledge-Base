export const STORAGE_KEY = 'kb_entries';
export const STORAGE_SEEDED_KEY = 'kb_seeded';

export const COMMANDS = {
  NEW: 'new',
  SEARCH: 'search',
  TAG: 'tag',
  CLEAR: 'clear',
  HELP: 'help',
  EXPORT: 'export',
  LIST: 'list',
  DELETE: 'delete',
} as const;

export const COMMAND_DESCRIPTIONS: Record<string, string> = {
  new: 'Open entry creation panel',
  'search <query>': 'Filter entries by keyword',
  'tag <name>': 'Filter entries by tag',
  clear: 'Clear active filters',
  help: 'Show command reference',
  export: 'Download all entries as JSON',
  list: 'List all entries',
  'delete <id>': 'Delete entry by ID',
};

export const KEYBOARD_SHORTCUTS: Array<{ keys: string; description: string }> = [
  { keys: 'Ctrl + N', description: 'New entry' },
  { keys: 'Ctrl + F', description: 'Focus search / command input' },
  { keys: 'Ctrl + /', description: 'Toggle help overlay' },
  { keys: 'Escape', description: 'Close panel / clear selection' },
  { keys: '↑ / ↓', description: 'Navigate command history' },
  { keys: 'Enter', description: 'Execute command' },
];

export const MOOD_COLORS = [
  { key: 'cyan', label: 'Cyan', value: '#00f5ff' },
  { key: 'green', label: 'Green', value: '#39ff14' },
  { key: 'amber', label: 'Amber', value: '#ffb300' },
  { key: 'violet', label: 'Violet', value: '#a855f7' },
  { key: 'rose', label: 'Rose', value: '#f43f5e' },
];
