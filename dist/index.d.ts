/**
 * @a24z/markdown-search - High-performance full-text search for markdown documents
 */
export { SearchEngine } from './SearchEngine';
export { DocumentIndexer } from './DocumentIndexer';
export { SearchEngineFactory } from './SearchEngineFactory';
export type { SearchableDocument, DocumentType, DocumentMetadata, DocumentChunk, ChunkType, MetadataValue, SearchResult, SearchOptions, MatchInfo, MatchDetail, } from './types';
export type { FileInfo, FindOptions, FileWatchEvent, FileWatchCallback, Disposable, SearchFileSystemAdapter, SearchStorageAdapter, SerializedIndexData, IndexMetadata, SearchEngineAdapter, SearchEngineConfig, SearchEngineOptions, IndexingOptions, IndexingPhase, IndexingProgress, IndexResult, IndexError, SearchIndexStats, } from './adapters/types';
export type { FileSystemAdapter, StorageAdapter, SearchEngineAdapterBase, SearchPlatformAdapter, } from './adapters';
export { DEFAULT_FILE_EXCLUSIONS, mergeExclusions } from './adapters';
export { FlexSearchAdapter, NodeFileSystemAdapter, NodeStorageAdapter, VSCodeFileSystemAdapter, VSCodeStorageAdapter, } from './adapters/implementations';
export * from './utils';
export declare function createSearchEngine(options?: {
    rootPath?: string;
    storagePath?: string;
    indexKey?: string;
}): any;
export declare const VERSION = "1.0.0";
//# sourceMappingURL=index.d.ts.map