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
  // File system
  FileInfo,
  FindOptions,
  FileWatchEvent,
  FileWatchCallback,
  Disposable,
  SearchFileSystemAdapter,
  
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

// Adapter interfaces (types only)
export type {
  FileSystemAdapter,
  StorageAdapter,
  SearchEngineAdapterBase,
  SearchPlatformAdapter,
} from './adapters';

// Constants
export { DEFAULT_FILE_EXCLUSIONS, mergeExclusions } from './adapters';

// Implementation exports
export {
  // Search engines
  FlexSearchAdapter,
  
  // Node.js/Bun adapters
  NodeFileSystemAdapter,
  NodeStorageAdapter,
  
  // VSCode adapters (for extension compatibility)
  VSCodeFileSystemAdapter,
  VSCodeStorageAdapter,
} from './adapters/implementations';

// Utilities
export * from './utils';

// Factory method for quick setup
export function createSearchEngine(options?: {
  rootPath?: string;
  storagePath?: string;
  indexKey?: string;
}) {
  const { 
    rootPath = process.cwd(), 
    storagePath = '.search-index',
    indexKey = 'search-index' 
  } = options || {};
  
  // Import needed implementations
  const { NodeFileSystemAdapter, NodeStorageAdapter } = require('./adapters/implementations');
  const { SearchEngine } = require('./SearchEngine');
  const { SearchEngineFactory } = require('./SearchEngineFactory');
  
  return new SearchEngine({
    fileSystem: new NodeFileSystemAdapter(rootPath),
    storage: new NodeStorageAdapter(storagePath),
    searchEngine: SearchEngineFactory.create('flexsearch'),
  }, indexKey);
}

// Version
export const VERSION = '1.0.0';