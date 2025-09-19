// Re-export all adapter interfaces
export type {
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
export type { SearchStorageAdapter as StorageAdapter } from './StorageAdapter';
export type { SearchEngineAdapter as SearchEngineAdapterBase } from './SearchEngineAdapter';
export type { SearchPlatformAdapter } from './SearchPlatformAdapter';

// Re-export constants
export * from './constants';
