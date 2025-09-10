// Re-export all adapter interfaces
export type {
  FileInfo,
  FindOptions,
  FileWatchEvent,
  FileWatchCallback,
  Disposable,
  SearchFileSystemAdapter,
  SearchEngineAdapter,
  SearchEngineConfig,
  SearchEngineOptions,
  SearchEngineOptionValue,
  SerializedIndexData,
  IndexStatsData,
  SearchIndexData,
  SearchStorageAdapter,
  IndexingOptions,
  IndexingPhase,
  IndexingProgress,
  IndexMetadata,
  SearchIndexStats,
  IndexResult,
  IndexError,
} from './types';

// Re-export adapter interfaces (these are interfaces, not classes)
export type { SearchFileSystemAdapter as FileSystemAdapter } from './FileSystemAdapter';
export type { SearchStorageAdapter as StorageAdapter } from './StorageAdapter';
export type { SearchEngineAdapter as SearchEngineAdapterBase } from './SearchEngineAdapter';
export type { SearchPlatformAdapter } from './SearchPlatformAdapter';

// Re-export constants
export * from './constants';