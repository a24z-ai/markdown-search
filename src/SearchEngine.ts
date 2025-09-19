/**
 * SearchEngine - Main search engine implementation for markdown documents
 */

import { SearchStorageAdapter, SearchEngineAdapter } from './adapters';
import {
  IndexingOptions,
  IndexResult,
  IndexError,
  SearchEngineConfig,
  SearchIndexStats,
} from './adapters/types';
import { MarkdownFileProvider } from './MarkdownFileProvider';
import { SearchEngineFactory } from './SearchEngineFactory';
import { DocumentIndexer } from './DocumentIndexer';
import { type SearchableDocument, type SearchResult, type SearchOptions } from './types';

// Debug logging utility - set to true to enable verbose logs
const DEBUG = false;
const debugLog = (...args: unknown[]) => {
  if (DEBUG) {
    debugLog(...args);
  }
};

export class SearchEngine {
  private indexer: DocumentIndexer;
  private searchEngine: SearchEngineAdapter;
  private storage: SearchStorageAdapter;
  private markdownProvider: MarkdownFileProvider;
  private indexKey: string;

  constructor(config: SearchEngineConfig, indexKey: string = 'search-index') {
    this.storage = config.storage;
    this.markdownProvider = config.markdownProvider;
    this.searchEngine = config.searchEngine || SearchEngineFactory.create('flexsearch');
    this.indexer = new DocumentIndexer();
    this.indexKey = indexKey;
  }

  /**
   * Initialize the search engine, loading any existing index
   */
  async initialize(): Promise<void> {
    try {
      // Initialize the search engine adapter
      await this.searchEngine.initialize();

      // Try to load existing index
      const savedIndex = await this.storage.loadIndex(this.indexKey);
      if (savedIndex) {
        await this.searchEngine.importIndex(savedIndex);
      }
    } catch (error) {
      console.error('Failed to initialize search engine:', error);
      // Continue with empty index
    }
  }

  /**
   * Index all markdown files in the workspace
   */
  async indexFiles(options?: IndexingOptions): Promise<IndexResult> {
    debugLog('Indexing files...');
    const startTime = Date.now();
    debugLog('Start time:', startTime);
    const errors: IndexError[] = [];
    debugLog('Errors:', errors);
    let filesIndexed = 0;
    debugLog('Files indexed:', filesIndexed);
    let sectionsIndexed = 0;
    debugLog('Sections indexed:', sectionsIndexed);
    let documentsIndexed = 0;
    debugLog('Documents indexed:', documentsIndexed);

    try {
      // Phase 1: Discovering files
      debugLog('Phase 1: Discovering files');
      if (options?.onProgress) {
        options.onProgress({
          phase: 'discovering',
          filesProcessed: 0,
          totalFiles: 0,
          documentsIndexed: 0,
          percentage: 0,
        });
      }

      // Find all markdown files
      const files = await this.markdownProvider.findMarkdownFiles(options?.fileOptions);
      const totalFiles = files.length;
      debugLog('Total files:', totalFiles);

      // Report discovered files to UI
      if (options?.onProgress) {
        options.onProgress({
          phase: 'discovering',
          filesProcessed: 0,
          totalFiles: totalFiles,
          documentsIndexed: 0,
          percentage: 5,
          foundFiles: {
            list: files.slice(0, Math.min(10, files.length)).map((f) => f.path), // Show first 10 files
            total: totalFiles,
            hasMore: totalFiles > 10,
          },
        });
      }

      // Start a new indexing session - this will ensure the first addDocuments call clears the index
      debugLog('[SearchEngine] 🎯 About to start new indexing session...');
      if (this.searchEngine.startNewIndexingSession) {
        this.searchEngine.startNewIndexingSession();
        debugLog('[SearchEngine] ✅ Successfully called startNewIndexingSession()');
      } else {
        debugLog(
          '[SearchEngine] ⚠️  WARNING: startNewIndexingSession method not available on search engine',
        );
      }

      // Process files in smaller batches to avoid memory issues
      // With large markdown files, even 10 files can consume too much memory
      const batchSize = options?.batchSize || 3;
      // Don't accumulate all documents - just track count for stats
      let totalDocumentsIndexed = 0;
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, Math.min(i + batchSize, files.length));
        debugLog('Batch:', batch);
        const batchDocuments: SearchableDocument[] = [];
        debugLog('Batch documents:', batchDocuments);

        // Process each file in the batch
        for (const file of batch) {
          try {
            // Phase 2: Parsing
            if (options?.onProgress) {
              options.onProgress({
                phase: 'parsing',
                currentFile: file.name,
                filesProcessed: filesIndexed,
                totalFiles: totalFiles,
                documentsIndexed: documentsIndexed,
                percentage: 10 + Math.round((filesIndexed / totalFiles) * 35), // 10-45%
              });
            }
            debugLog('Reading file content...');
            // Read file content
            const content = await this.markdownProvider.readMarkdownFile(file.path);
            debugLog('File content:', content);
            // Parse and create search documents
            const documents = await this.indexer.parseAndIndex(content, file, options);
            debugLog('Documents:', documents);
            // Count sections (documents of type 'section')
            const sectionCount = documents.filter((doc) => doc.type === 'section').length;
            sectionsIndexed += sectionCount;
            documentsIndexed += documents.length;
            debugLog('Documents indexed:', documentsIndexed);
            batchDocuments.push(...documents);
            filesIndexed++;
            debugLog('Files indexed:', filesIndexed);
          } catch (error) {
            errors.push({
              file: file.path,
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
            });
          }
        }
        debugLog('Batch documents:', batchDocuments);
        // Phase 3: Indexing
        if (batchDocuments.length > 0) {
          if (options?.onProgress) {
            options.onProgress({
              phase: 'indexing',
              filesProcessed: filesIndexed,
              totalFiles: totalFiles,
              documentsIndexed: documentsIndexed,
              percentage: 45 + Math.round((filesIndexed / totalFiles) * 35), // 45-80%
            });
          }
          debugLog('Adding documents to search engine...');
          debugLog(
            `[SearchEngine] About to add ${batchDocuments.length} documents to search engine (batch)`,
          );
          debugLog(
            `[SearchEngine] Total documents so far: ${totalDocumentsIndexed + batchDocuments.length}`,
          );
          await this.searchEngine.addDocuments(batchDocuments);
          debugLog('Documents added to search engine...');
          totalDocumentsIndexed += batchDocuments.length;
          debugLog('Total documents indexed:', totalDocumentsIndexed);

          // Clear batch documents to free memory
          batchDocuments.length = 0;
        }
      }
      debugLog('Total documents indexed:', totalDocumentsIndexed);
      // Phase 4: Persisting
      if (options?.onProgress) {
        options.onProgress({
          phase: 'persisting',
          filesProcessed: filesIndexed,
          totalFiles: totalFiles,
          documentsIndexed: documentsIndexed,
          percentage: 85,
        });
      }
      debugLog('Exporting Index ...');
      // Save the index
      const indexData = await this.searchEngine.exportIndex();
      const stats: SearchIndexStats = {
        totalFiles: filesIndexed,
        totalSections: sectionsIndexed,
        totalDocuments: documentsIndexed,
        indexedAt: new Date().toISOString(),
      };
      debugLog('Saving index...');
      await this.storage.saveIndex(this.indexKey, {
        data: indexData,
        metadata: {
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats,
        },
      });
      debugLog('Index saved...');
      // Complete
      if (options?.onProgress) {
        options.onProgress({
          phase: 'persisting',
          filesProcessed: filesIndexed,
          totalFiles: totalFiles,
          documentsIndexed: documentsIndexed,
          percentage: 100,
        });
      }
      debugLog('Index saved...');
      return {
        filesIndexed,
        sectionsIndexed,
        documentsIndexed,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Indexing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Search the index
   */
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    debugLog('[SearchEngine] Search called with query:', query, 'options:', options);

    if (!query || query.trim().length === 0) {
      debugLog('[SearchEngine] Empty query, returning empty array');
      return [];
    }

    // Pass options including filters to the search engine adapter
    const results = await this.searchEngine.search(query.trim(), options);

    return results;
  }

  /**
   * Get index statistics
   */
  async getStats(): Promise<SearchIndexStats | null> {
    const metadata = await this.storage.getIndexMetadata(this.indexKey);
    return metadata?.stats || null;
  }

  /**
   * Check if index exists
   */
  async hasIndex(): Promise<boolean> {
    return await this.storage.hasIndex(this.indexKey);
  }

  /**
   * Clear the index
   */
  async clearIndex(): Promise<void> {
    await this.searchEngine.clear();
    await this.storage.deleteIndex(this.indexKey);
  }

  /**
   * Update specific files in the index
   */
  async updateFiles(filePaths: string[], options?: IndexingOptions): Promise<IndexResult> {
    const startTime = Date.now();
    const errors: IndexError[] = [];
    let filesIndexed = 0;
    let sectionsIndexed = 0;
    let documentsIndexed = 0;

    try {
      for (const filePath of filePaths) {
        try {
          // Get file info
          const fileInfo = await this.markdownProvider.getFileInfo(filePath);

          // Remove old documents for this file
          const fileUri = fileInfo.uri || fileInfo.path;
          const oldDocsToRemove: string[] = [];

          // Use getAllDocuments if available, otherwise fallback to search
          const allResults = this.searchEngine.getAllDocuments
            ? await this.searchEngine.getAllDocuments()
            : await this.searchEngine.search(' ', { limit: 10000 });

          allResults.forEach((result) => {
            if (result.fileUri === fileUri || result.filePath === filePath) {
              oldDocsToRemove.push(result.id);
            }
          });

          if (oldDocsToRemove.length > 0) {
            await this.searchEngine.removeDocuments(oldDocsToRemove);
          }

          // Read and index the file
          const content = await this.markdownProvider.readMarkdownFile(filePath);
          const documents = await this.indexer.parseAndIndex(content, fileInfo, options);

          // Add new documents
          if (documents.length > 0) {
            await this.searchEngine.addDocuments(documents);

            // Count sections
            const sectionCount = documents.filter((doc) => doc.type === 'section').length;
            sectionsIndexed += sectionCount;
            documentsIndexed += documents.length;
          }

          filesIndexed++;
        } catch (error) {
          errors.push({
            file: filePath,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
        }
      }

      // Save updated index
      const indexData = await this.searchEngine.exportIndex();
      const existingMetadata = await this.storage.getIndexMetadata(this.indexKey);

      await this.storage.saveIndex(this.indexKey, {
        data: indexData,
        metadata: {
          version: existingMetadata?.version || '1.0.0',
          createdAt: existingMetadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          stats: {
            ...existingMetadata?.stats,
            indexedAt: new Date().toISOString(),
          },
        },
      });

      return {
        filesIndexed,
        sectionsIndexed,
        documentsIndexed,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(`Update failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Index a single document with custom metadata
   */
  async indexDocument(filePath: string, metadata?: Record<string, any>): Promise<void> {
    try {
      // Read file content
      const fileInfo = await this.markdownProvider.getFileInfo(filePath);
      const content = await this.markdownProvider.readMarkdownFile(filePath);

      // Parse and create search documents
      const documents = await this.indexer.parseAndIndex(content, fileInfo);

      // Add custom metadata to each document
      if (metadata) {
        documents.forEach((doc) => {
          doc.metadata = { ...doc.metadata, ...metadata };
        });
      }

      // Add documents to search engine
      await this.searchEngine.addDocuments(documents);

      // Save updated index
      await this.saveIndex();
    } catch (error) {
      throw new Error(
        `Failed to index document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Index multiple documents with metadata
   */
  async indexDocumentsWithMetadata(
    items: Array<{ path: string; metadata?: Record<string, any> }>,
  ): Promise<IndexResult> {
    const startTime = Date.now();
    const errors: IndexError[] = [];
    let filesIndexed = 0;
    let sectionsIndexed = 0;
    let documentsIndexed = 0;

    try {
      for (const item of items) {
        try {
          // Read file content
          const fileInfo = await this.markdownProvider.getFileInfo(item.path);
          const content = await this.markdownProvider.readMarkdownFile(item.path);

          // Parse and create search documents
          const documents = await this.indexer.parseAndIndex(content, fileInfo);

          // Add custom metadata to each document
          if (item.metadata) {
            documents.forEach((doc) => {
              doc.metadata = { ...doc.metadata, ...item.metadata };
            });
          }

          // Add documents to search engine
          await this.searchEngine.addDocuments(documents);

          // Count sections and documents
          const sectionCount = documents.filter((doc) => doc.type === 'section').length;
          sectionsIndexed += sectionCount;
          documentsIndexed += documents.length;
          filesIndexed++;
        } catch (error) {
          errors.push({
            file: item.path,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
        }
      }

      // Save updated index
      await this.saveIndex();

      return {
        filesIndexed,
        sectionsIndexed,
        documentsIndexed,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(
        `Failed to index documents: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Update an existing document
   */
  async updateDocument(filePath: string, metadata?: Record<string, any>): Promise<void> {
    try {
      // Remove old documents for this file
      await this.removeDocument(filePath);

      // Index the updated file
      await this.indexDocument(filePath, metadata);
    } catch (error) {
      throw new Error(
        `Failed to update document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Remove a single document from the index
   */
  async removeDocument(filePath: string): Promise<void> {
    try {
      // Get file info
      const fileInfo = await this.markdownProvider.getFileInfo(filePath);
      const fileUri = fileInfo.uri || fileInfo.path;

      // Find all documents from this file
      const docsToRemove: string[] = [];

      // Use getAllDocuments if available, otherwise fallback to search
      const allResults = this.searchEngine.getAllDocuments
        ? await this.searchEngine.getAllDocuments()
        : await this.searchEngine.search(' ', { limit: 10000 });

      allResults.forEach((result) => {
        if (result.fileUri === fileUri || result.filePath === filePath) {
          docsToRemove.push(result.id);
        }
      });

      // Remove documents
      if (docsToRemove.length > 0) {
        await this.searchEngine.removeDocuments(docsToRemove);
        await this.saveIndex();
      }
    } catch (error) {
      throw new Error(
        `Failed to remove document: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Remove all documents matching metadata criteria
   */
  async removeDocumentsByMetadata(query: Record<string, any>): Promise<number> {
    try {
      const docsToRemove: string[] = [];

      // Use getAllDocuments if available, otherwise fallback to search
      const allResults = this.searchEngine.getAllDocuments
        ? await this.searchEngine.getAllDocuments()
        : await this.searchEngine.search(' ', { limit: 10000 });

      allResults.forEach((result) => {
        if (result.metadata && this.matchesMetadata(result.metadata, query)) {
          docsToRemove.push(result.id);
        }
      });

      // Remove matching documents
      if (docsToRemove.length > 0) {
        await this.searchEngine.removeDocuments(docsToRemove);
        await this.saveIndex();
      }

      return docsToRemove.length;
    } catch (error) {
      throw new Error(
        `Failed to remove documents by metadata: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Check if document exists in index
   */
  async hasDocument(filePath: string): Promise<boolean> {
    try {
      const fileInfo = await this.markdownProvider.getFileInfo(filePath);
      const fileUri = fileInfo.uri || fileInfo.path;

      // Use getAllDocuments if available, otherwise fallback to search
      const results = this.searchEngine.getAllDocuments
        ? await this.searchEngine.getAllDocuments()
        : await this.searchEngine.search(' ', { limit: 10000 });

      return results.some((result) => result.fileUri === fileUri || result.filePath === filePath);
    } catch {
      // If file doesn't exist or other error, return false
      return false;
    }
  }

  /**
   * Helper function to check if metadata matches query
   */
  private matchesMetadata(metadata: Record<string, any>, query: Record<string, any>): boolean {
    for (const [key, value] of Object.entries(query)) {
      if (metadata[key] !== value) {
        return false;
      }
    }
    return true;
  }

  /**
   * Index documents directly (for non-file-based content like notes)
   */
  async indexDocuments(
    documents: SearchableDocument[],
    options?: IndexingOptions,
  ): Promise<IndexResult> {
    const startTime = Date.now();
    const errors: IndexError[] = [];

    try {
      // Phase 1: Clear if requested
      if (options?.clearBefore) {
        await this.clearIndex();
      }

      // Phase 2: Start new indexing session if adapter supports it
      if (this.searchEngine.startNewIndexingSession) {
        this.searchEngine.startNewIndexingSession();
      }

      // Phase 3: Add documents
      if (options?.onProgress) {
        options.onProgress({
          phase: 'indexing',
          filesProcessed: 0,
          totalFiles: documents.length,
          documentsIndexed: 0,
          percentage: 50,
        });
      }

      await this.searchEngine.addDocuments(documents);

      // Phase 4: Save index
      await this.saveIndex();

      if (options?.onProgress) {
        options.onProgress({
          phase: 'complete',
          filesProcessed: documents.length,
          totalFiles: documents.length,
          documentsIndexed: documents.length,
          percentage: 100,
        });
      }

      return {
        filesIndexed: 0, // No files in document-based indexing
        sectionsIndexed: documents.filter((d) => d.type === 'section').length,
        documentsIndexed: documents.length,
        errors: errors.length > 0 ? errors : undefined,
        duration: Date.now() - startTime,
      };
    } catch (error) {
      throw new Error(
        `Document indexing failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Save the current index to storage
   */
  async saveIndex(): Promise<void> {
    try {
      const indexData = await this.searchEngine.exportIndex();
      await this.storage.saveIndex(this.indexKey, {
        data: indexData,
        metadata: {
          version: '1.0.0',
          updatedAt: new Date().toISOString(),
          stats: await this.getStats(),
        },
      });
    } catch (error) {
      throw new Error(
        `Failed to save index: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Get direct access to the search engine adapter (use with caution)
   */
  getSearchAdapter(): SearchEngineAdapter {
    return this.searchEngine;
  }

  /**
   * Get direct access to the storage adapter (use with caution)
   */
  getStorageAdapter(): SearchStorageAdapter {
    return this.storage;
  }
}
