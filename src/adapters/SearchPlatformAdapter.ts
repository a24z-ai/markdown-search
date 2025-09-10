/**
 * Platform adapter interface for search UI components
 * Abstracts platform-specific operations to enable cross-platform search UI
 */

// Indexed document data - structure varies by implementation
export type IndexedDocumentData = unknown;

// Index statistics - varies by search engine and platform
export type PlatformIndexStats = unknown;

// Extension data for platform-specific messages
export type PlatformMessageExtension = unknown;

export interface SearchPlatformAdapter {
  // Communication
  sendMessage(message: SearchPlatformMessage): void;
  onMessage(handler: (message: SearchPlatformMessage) => void): () => void;

  // UI Operations
  showInputBox(options: InputBoxOptions): Promise<string | undefined>;
  showQuickPick<T extends QuickPickItem>(
    items: T[],
    options?: QuickPickOptions,
  ): Promise<T | undefined>;
  showInformationMessage(message: string, ...actions: string[]): Promise<string | undefined>;
  showErrorMessage(message: string, ...actions: string[]): Promise<string | undefined>;
  showWarningMessage(message: string, ...actions: string[]): Promise<string | undefined>;

  // File Operations
  openFile(uri: string, options?: OpenFileOptions): Promise<void>;

  // Progress
  withProgress<T>(
    options: ProgressOptions,
    task: (progress: ProgressReporter) => Promise<T>,
  ): Promise<T>;

  // Platform info
  getPlatformInfo(): PlatformInfo;

  // Optional features
  requestAuthorization?(): Promise<boolean>;
  getInitialQuery?(): string;
}

// Message types for platform communication
export type SearchPlatformMessage =
  | { type: 'ready' }
  | { type: 'authorize' }
  | { type: 'search'; query: string }
  | { type: 'openFile'; uri: string; slideIndex?: number }
  | { type: 'reindex' }
  | { type: 'toggleFileWatching'; enabled: boolean }
  | { type: 'debugDocument'; fileName: string }
  | { type: 'indexingStep'; step: string; message: string }
  | { type: 'filesFound'; fileList: string[]; totalFiles: number; hasMore: boolean }
  | { type: 'indexingProgress'; progress: number; currentFile: string; filesProcessed: number }
  | { type: 'indexingComplete'; documents: IndexedDocumentData[]; stats: PlatformIndexStats }
  | { type: 'parseError'; error: string }
  | { type: 'performSearch'; query: string }
  | {
      type: 'initialState';
      isAuthorized: boolean;
      hasIndex: boolean;
      indexStats?: PlatformIndexStats;
      isFileWatchingEnabled: boolean;
    }
  | { type: 'fileWatchingChanged'; enabled: boolean }
  | { type: 'fileChanged'; changeType: string; fileName: string }
  | { type: string; [key: string]: PlatformMessageExtension }; // Allow extension for platform-specific messages

// UI Options interfaces
export interface InputBoxOptions {
  placeholder?: string;
  prompt?: string;
  value?: string;
  validateInput?: (value: string) => string | undefined | null;
}

export interface QuickPickItem {
  label: string;
  description?: string;
  detail?: string;
  picked?: boolean;
}

export interface QuickPickOptions {
  placeHolder?: string;
  canPickMany?: boolean;
  matchOnDescription?: boolean;
  matchOnDetail?: boolean;
}

export interface OpenFileOptions {
  slideIndex?: number;
  line?: number;
  column?: number;
  selection?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface ProgressOptions {
  location?: 'notification' | 'window' | 'hidden';
  title?: string;
  cancellable?: boolean;
}

export interface ProgressReporter {
  report(value: { message?: string; increment?: number }): void;
}

export interface PlatformInfo {
  type: 'vscode' | 'web' | 'electron' | 'mobile';
  capabilities: {
    fileWatching: boolean;
    authorization: boolean;
    progress: boolean;
    notifications: boolean;
    fileAccess: boolean;
  };
  theme?: 'light' | 'dark' | 'auto';
}
