import { SearchableDocument, SearchResult, SearchOptions } from '../types';

// Search Engine Specific
export interface SearchEngineAdapter {
  initialize(options?: SearchEngineOptions): Promise<void>;
  addDocuments(documents: SearchableDocument[]): Promise<void>;
  removeDocuments(ids: string[]): Promise<void>;
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  exportIndex(): Promise<SerializedIndexData>;
  importIndex(data: SerializedIndexData): Promise<void>;
  clear(): Promise<void>;
  startNewIndexingSession?(): void;
}

// Configuration for the search engine
export interface SearchEngineConfig {
  storage: SearchStorageAdapter;
  markdownProvider: import('../MarkdownFileProvider').MarkdownFileProvider;
  searchEngine?: SearchEngineAdapter;
}

// Search engine options type
export type SearchEngineOptionValue = string | number | boolean | object | undefined;

// Serialized index data - opaque to consumers, handled internally by search engines
export type SerializedIndexData = unknown;

// Index statistics data - structure varies by search engine implementation
export type IndexStatsData = unknown;

export interface SearchEngineOptions {
  [key: string]: SearchEngineOptionValue;
}

// Serializable index data for export/import
export interface SearchIndexData {
  version: string;
  timestamp: string;
  engine: string;
  index: Record<string, SerializedIndexData>;
  documents: Array<[string, SearchableDocument]>;
}

// Storage adapter interface
export interface SearchStorageAdapter {
  saveIndex(key: string, data: SerializedIndexData): Promise<void>;
  loadIndex(key: string): Promise<SerializedIndexData | null>;
  deleteIndex(key: string): Promise<void>;
  hasIndex(key: string): Promise<boolean>;
  getIndexMetadata(key: string): Promise<IndexMetadata | null>;
}

// Indexing options
export interface IndexingOptions {
  // Index individual chunks/blocks within documents
  indexChunks?: boolean;

  // File filtering (uses MarkdownFileProvider's FindOptions)
  fileOptions?: import('../MarkdownFileProvider').FindOptions;

  // Performance options
  batchSize?: number;

  // Clear index before adding new documents
  clearBefore?: boolean;

  // Progress callback
  onProgress?: (progress: IndexingProgress) => void;
}

export type IndexingPhase = 'discovering' | 'parsing' | 'indexing' | 'persisting' | 'complete';

export interface IndexingProgress {
  phase: IndexingPhase;
  currentFile?: string;
  filesProcessed: number;
  totalFiles: number;
  documentsIndexed: number;
  percentage: number;
  foundFiles?: {
    list: string[];
    total: number;
    hasMore: boolean;
  };
}

// Index metadata
export interface IndexMetadata {
  version: string;
  createdAt: string;
  updatedAt: string;
  stats: SearchIndexStats;
}

export interface SearchIndexStats {
  totalFiles: number;
  totalSections?: number;
  totalDocuments?: number;
  totalSize?: string;
  indexedAt: string;
  // Deprecated - for backward compatibility
  totalSlides?: number;
}

// Results for indexing operation
export interface IndexResult {
  filesIndexed: number;
  sectionsIndexed?: number;
  documentsIndexed?: number;
  errors?: IndexError[];
  duration: number;
  // Deprecated - for backward compatibility
  slidesIndexed?: number;
}

export interface IndexError {
  file: string;
  error: string;
  stack?: string;
}