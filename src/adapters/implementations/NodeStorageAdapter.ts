/**
 * Node.js/Bun implementation of StorageAdapter
 * Uses file system for persistent storage
 */

import { SearchStorageAdapter, SerializedIndexData, IndexMetadata } from '../types';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export class NodeStorageAdapter implements SearchStorageAdapter {
  private storagePath: string;

  constructor(storagePath: string = '.search-index') {
    this.storagePath = storagePath;
    this.ensureStorageDirectory();
  }

  /**
   * Ensure storage directory exists
   */
  private async ensureStorageDirectory(): Promise<void> {
    try {
      await mkdir(this.storagePath, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }
  }

  /**
   * Get the file path for an index key
   */
  private getIndexPath(key: string): string {
    return join(this.storagePath, `${key}.json`);
  }

  /**
   * Save index data to file using Bun's fast write
   */
  async saveIndex(key: string, data: SerializedIndexData): Promise<void> {
    await this.ensureStorageDirectory();
    const filePath = this.getIndexPath(key);

    // Use Bun's fast write operation
    if (typeof Bun !== 'undefined' && Bun.write) {
      await Bun.write(filePath, JSON.stringify(data, null, 2));
    } else {
      // Fallback to Node.js fs
      const { writeFile } = await import('fs/promises');
      await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
  }

  /**
   * Load index data from file
   */
  async loadIndex(key: string): Promise<SerializedIndexData | null> {
    try {
      const filePath = this.getIndexPath(key);

      // Use Bun's file reading
      if (typeof Bun !== 'undefined' && Bun.file) {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          const content = await file.text();
          return JSON.parse(content);
        }
        return null;
      }

      // Fallback to Node.js fs
      const { readFile } = await import('fs/promises');
      try {
        const content = await readFile(filePath, 'utf-8');
        return JSON.parse(content);
      } catch (error: any) {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to load index:', error);
      return null;
    }
  }

  /**
   * Delete index file
   */
  async deleteIndex(key: string): Promise<void> {
    try {
      const filePath = this.getIndexPath(key);

      // Use Node.js fs for deletion
      const { unlink } = await import('fs/promises');
      await unlink(filePath);
    } catch (error: any) {
      // Ignore if file doesn't exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  /**
   * Check if index exists
   */
  async hasIndex(key: string): Promise<boolean> {
    try {
      const filePath = this.getIndexPath(key);

      // Use Bun's file check
      if (typeof Bun !== 'undefined' && Bun.file) {
        const file = Bun.file(filePath);
        return await file.exists();
      }

      // Fallback to Node.js fs
      const { access } = await import('fs/promises');
      try {
        await access(filePath);
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Get index metadata
   */
  async getIndexMetadata(key: string): Promise<IndexMetadata | null> {
    const data = await this.loadIndex(key);
    if (!data || typeof data !== 'object') {
      return null;
    }

    // Extract metadata from the saved data
    const indexData = data as any;
    if (indexData.metadata) {
      return indexData.metadata;
    }

    // Try to construct metadata from available fields
    if (indexData.version || indexData.createdAt || indexData.stats) {
      return {
        version: indexData.version || '1.0.0',
        createdAt: indexData.createdAt || new Date().toISOString(),
        updatedAt: indexData.updatedAt || new Date().toISOString(),
        stats: indexData.stats || {
          totalFiles: 0,
          totalDocuments: 0,
          indexedAt: new Date().toISOString(),
        },
      };
    }

    return null;
  }
}
