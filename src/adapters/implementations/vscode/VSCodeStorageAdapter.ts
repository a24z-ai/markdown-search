/**
 * VS Code implementation of SearchStorageAdapter
 * Uses VS Code's storageUri for file-based persistent storage of large index data
 * and workspace state for small metadata
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// This file interfaces with external VSCode APIs that are not typed in this context

import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

import { SearchStorageAdapter, IndexMetadata } from '../../types';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

// VS Code API types (will be injected)
export interface VSCodeAPI {
  ExtensionContext: {
    workspaceState: {
      get<T>(key: string): T | undefined;
      update(key: string, value: any): Promise<void>;
      keys(): readonly string[];
    };
    storageUri?: { fsPath: string };
    globalStorageUri?: { fsPath: string };
  };
}

export class VSCodeStorageAdapter implements SearchStorageAdapter {
  private context: any; // vscode.ExtensionContext
  private storagePrefix: string;
  private saveTimeout: NodeJS.Timeout | undefined; // Debounce saves
  private storagePath: string | null = null;

  constructor(context: any, storagePrefix: string = 'search_') {
    this.context = context;
    this.storagePrefix = storagePrefix;

    // Initialize storage path from context.storageUri or globalStorageUri
    this.initializeStoragePath();
  }

  private async initializeStoragePath(): Promise<void> {
    // Prefer workspace-specific storage, fall back to global storage
    const storageUri = this.context.storageUri || this.context.globalStorageUri;

    if (storageUri && storageUri.fsPath) {
      this.storagePath = path.join(storageUri.fsPath, 'search-index');

      // Ensure the directory exists
      try {
        if (!(await exists(this.storagePath))) {
          await mkdir(this.storagePath, { recursive: true });
        }
      } catch (error) {
        console.error('[VSCodeStorageAdapter] Failed to create storage directory:', error);
        this.storagePath = null;
      }
    }
  }

  private getStorageKey(key: string): string {
    return `${this.storagePrefix}${key}`;
  }

  private getIndexFilePath(key: string): string | null {
    if (!this.storagePath) return null;
    return path.join(this.storagePath, `${key}.json`);
  }

  async saveIndex(key: string, data: any): Promise<void> {
    // Clear existing save timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Debounce save operations to prevent rapid-fire saves
    return new Promise((resolve, reject) => {
      this.saveTimeout = setTimeout(async () => {
        try {
          const filePath = this.getIndexFilePath(key);

          if (!filePath || !this.storagePath) {
            throw new Error('Storage path not available - cannot save index');
          }

          // Ensure storage directory exists
          if (!(await exists(this.storagePath))) {
            await mkdir(this.storagePath, { recursive: true });
          }

          // Write index data to file
          const jsonData = JSON.stringify(data);
          await writeFile(filePath, jsonData, 'utf8');

          // Store only metadata in workspaceState
          const metadata: any = {
            storedInFile: true,
            filePath: filePath,
            size: jsonData.length,
            timestamp: new Date().toISOString(),
          };

          // Extract and store actual metadata if present
          if (data && data.metadata) {
            metadata.indexMetadata = data.metadata;
          }

          const storageKey = this.getStorageKey(key);
          await this.context.workspaceState.update(storageKey, metadata);

          resolve();
        } catch (error) {
          reject(error);
        }
      }, 500); // Wait 500ms before actually saving
    });
  }

  async loadIndex(key: string): Promise<any | null> {
    try {
      const storageKey = this.getStorageKey(key);
      const metadata = this.context.workspaceState.get(storageKey);

      if (!metadata) {
        return null;
      }

      // Data must be stored in file
      if (!(metadata as any).storedInFile || !(metadata as any).filePath) {
        // Clear invalid metadata
        await this.context.workspaceState.update(storageKey, undefined);
        return null;
      }

      const filePath = (metadata as any).filePath;

      // Check if file exists
      if (await exists(filePath)) {
        const fileContent = await readFile(filePath, 'utf8');
        return JSON.parse(fileContent);
      } else {
        // File doesn't exist, clear the metadata
        await this.context.workspaceState.update(storageKey, undefined);
        return null;
      }
    } catch (error) {
      console.error('[VSCodeStorageAdapter] Failed to load index:', error);
      return null;
    }
  }

  async deleteIndex(key: string): Promise<void> {
    const storageKey = this.getStorageKey(key);
    const metadata = this.context.workspaceState.get(storageKey);

    // Delete file if it exists
    if (metadata && (metadata as any).storedInFile && (metadata as any).filePath) {
      const filePath = (metadata as any).filePath;
      try {
        if (await exists(filePath)) {
          await unlink(filePath);
        }
      } catch (error) {
        console.error('[VSCodeStorageAdapter] Failed to delete index file:', error);
      }
    }

    // Clear workspace state
    await this.context.workspaceState.update(storageKey, undefined);
  }

  async hasIndex(key: string): Promise<boolean> {
    const storageKey = this.getStorageKey(key);
    const metadata = this.context.workspaceState.get(storageKey);

    if (!metadata) {
      return false;
    }

    // Data must be stored in file
    if ((metadata as any).storedInFile && (metadata as any).filePath) {
      return await exists((metadata as any).filePath);
    }

    return false;
  }

  async getIndexMetadata(key: string): Promise<IndexMetadata | null> {
    const storageKey = this.getStorageKey(key);
    const metadata = this.context.workspaceState.get(storageKey);

    if (metadata && (metadata as any).indexMetadata) {
      return (metadata as any).indexMetadata;
    }

    // For legacy data, try to extract metadata
    const data = await this.loadIndex(key);
    if (data && data.metadata) {
      return data.metadata;
    }
    return null;
  }

  /**
   * Get all search-related keys in storage
   */
  async getAllKeys(): Promise<string[]> {
    const allKeys = this.context.workspaceState.keys();
    return allKeys
      .filter((key: string) => key.startsWith(this.storagePrefix))
      .map((key: string) => key.substring(this.storagePrefix.length));
  }

  /**
   * Clear all search-related data
   */
  async clearAll(): Promise<void> {
    const searchKeys = await this.getAllKeys();
    for (const key of searchKeys) {
      await this.deleteIndex(key);
    }
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = undefined;
    }
  }
}
