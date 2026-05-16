export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'list' | 'detail' | 'editor';
export type EditorMode = 'create' | 'edit';

export interface CommandLogEntry {
  id: string;
  input: string;
  output: string;
  type: 'success' | 'error' | 'info' | 'system';
  timestamp: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export interface AppState {
  entries: KnowledgeEntry[];
  selectedEntryId: string | null;
  viewMode: ViewMode;
  editorMode: EditorMode;
  searchQuery: string;
  activeTag: string | null;
  showHelp: boolean;
  showSidebar: boolean;
  commandLog: CommandLogEntry[];
}
