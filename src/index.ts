/**
 * @a24z/markdown-search - High-performance full-text search for markdown documents
 */

// Core exports
export { SearchEngine } from './SearchEngine';
export { DocumentIndexer } from './DocumentIndexer';
export { SearchEngineFactory } from './SearchEngineFactory';

// Type exports
export type {
  // Document types
  SearchableDocument,
  DocumentType,
  DocumentMetadata,
  DocumentChunk,
  ChunkType,
  MetadataValue,

  // Search types
  SearchResult,
  SearchOptions,
  MatchInfo,
  MatchDetail,
} from './types';

// Adapter exports
export type {
  // Storage
  SearchStorageAdapter,
  SerializedIndexData,
  IndexMetadata,

  // Search engine
  SearchEngineAdapter,
  SearchEngineConfig,
  SearchEngineOptions,

  // Indexing
  IndexingOptions,
  IndexingPhase,
  IndexingProgress,
  IndexResult,
  IndexError,
  SearchIndexStats,
} from './adapters/types';

// MarkdownFileProvider interface - users implement this for their environment
export type {
  MarkdownFileProvider,
  MarkdownFile,
  FindOptions,
  FileChange,
  Disposable,
} from './MarkdownFileProvider';

// Adapter interfaces (types only)
export type { StorageAdapter, SearchEngineAdapterBase, SearchPlatformAdapter } from './adapters';

// Constants
export { DEFAULT_FILE_EXCLUSIONS, mergeExclusions } from './adapters';

// Implementation exports - only search engine and storage adapters
export {
  // Search engines
  FlexSearchAdapter,

  // Node.js/Bun storage adapter
  NodeStorageAdapter,
} from './adapters/implementations';

// Utilities
export * from './utils';

// Version
export const VERSION = '2.0.5';
