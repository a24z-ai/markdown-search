/**
 * Node.js/Bun implementation of StorageAdapter
 * Uses file system for persistent storage
 */
import { SearchStorageAdapter, SerializedIndexData, IndexMetadata } from '../types';
export declare class NodeStorageAdapter implements SearchStorageAdapter {
    private storagePath;
    constructor(storagePath?: string);
    /**
     * Ensure storage directory exists
     */
    private ensureStorageDirectory;
    /**
     * Get the file path for an index key
     */
    private getIndexPath;
    /**
     * Save index data to file using Bun's fast write
     */
    saveIndex(key: string, data: SerializedIndexData): Promise<void>;
    /**
     * Load index data from file
     */
    loadIndex(key: string): Promise<SerializedIndexData | null>;
    /**
     * Delete index file
     */
    deleteIndex(key: string): Promise<void>;
    /**
     * Check if index exists
     */
    hasIndex(key: string): Promise<boolean>;
    /**
     * Get index metadata
     */
    getIndexMetadata(key: string): Promise<IndexMetadata | null>;
}
//# sourceMappingURL=NodeStorageAdapter.d.ts.map