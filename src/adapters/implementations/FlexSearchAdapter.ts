/**
 * FlexSearch implementation of SearchEngineAdapter
 * High-performance full-text search library
 */

import * as FlexSearch from 'flexsearch';

import {
  SearchableDocument,
  SearchResult,
  SearchOptions,
  MatchInfo,
  DocumentType,
} from '../../types';
import { SearchEngineAdapter, SearchEngineOptions } from '../types';

// Debug logging utility - set to true to enable verbose FlexSearch logs
const DEBUG_FLEXSEARCH = false;
const debugLog = (...args: unknown[]) => {
  if (DEBUG_FLEXSEARCH) {
    console.log(...args);
  }
};

interface FlexSearchOptions extends SearchEngineOptions {
  // FlexSearch specific options
  preset?: 'memory' | 'performance' | 'match' | 'score' | 'default';
  tokenize?: 'strict' | 'forward' | 'reverse' | 'full';
  resolution?: number;
  context?: boolean | { depth: number; bidirectional: boolean; resolution: number };
  optimize?: boolean;
  boost?: (search: { field: string; query: string; match: string }) => number;
}

interface DocumentIndex {
  id: string;
  content: string;
  title: string;
  type: string;
  fileUri: string;
  fileName: string;
  filePath: string;
  sectionIndex: number; // Changed from slideIndex
  [key: string]: string | number | boolean; // FlexSearch requires index signature
}

// Use DocumentIndex as FlexSearchDocument for clarity
type FlexSearchDocument = DocumentIndex;

interface FlexSearchDocumentConfig {
  document: {
    id: string;
    index: Array<{
      field: string;
      tokenize?: 'strict' | 'forward' | 'reverse' | 'full';
      resolution?: number;
      context?: boolean | object;
    }>;
    store: string[];
  };
}

interface FlexSearchOptions_Internal {
  limit?: number;
  threshold?: number;
  where?: {
    type?: string[];
    language?: string[];
  };
}

interface FlexSearchMatch {
  field: string;
  result?: unknown; // FlexSearch internal result data
}

// Use the actual FlexSearch Document type
type FlexSearchIndex = FlexSearch.Document<DocumentIndex, string>;

// Lightweight metadata to store instead of full documents
interface DocumentMetadata {
  id: string;
  type: DocumentType;
  title?: string;
  fileName: string;
  filePath?: string;
  fileUri?: string;
  tags?: string[];
  sectionIndex?: number;
  sectionNumber?: number;
  parentId?: string;
  metadata?: Record<string, any>; // Custom metadata from documents
  // Don't store content - FlexSearch handles that
}

export class FlexSearchAdapter implements SearchEngineAdapter {
  private index!: FlexSearchIndex; // FlexSearch document index
  private documents: Map<string, DocumentMetadata> = new Map(); // Store only metadata, not content
  private options: FlexSearchOptions;
  private indexCleared: boolean = false; // Track if index has been cleared for this session
  private sessionId: string = Math.random().toString(36).substring(7); // Debug session tracking

  constructor(options?: FlexSearchOptions) {
    this.options = {
      preset: 'performance',
      tokenize: 'forward',
      resolution: 9,
      context: true,
      optimize: true,
      ...options,
    };
  }

  async initialize(options?: SearchEngineOptions): Promise<void> {
    const mergedOptions = { ...this.options, ...options };

    // Create FlexSearch Document index with multiple fields
    this.index = new FlexSearch.Document<FlexSearchDocument, string>({
      document: {
        id: 'id',
        index: [
          {
            field: 'content',
            tokenize: mergedOptions.tokenize,
            resolution: mergedOptions.resolution,
            context: mergedOptions.context,
          },
          {
            field: 'title',
            tokenize: 'forward',
          },
          {
            field: 'fileName',
            tokenize: 'strict',
          },
        ],
        store: ['id', 'type', 'fileUri', 'fileName', 'filePath', 'slideIndex'],
      },
    } satisfies FlexSearchDocumentConfig);
  }

  async addDocuments(documents: SearchableDocument[]): Promise<void> {
    const timestamp = new Date().toISOString();
    const logPrefix = `[FlexSearchAdapter:${this.sessionId}:${timestamp}]`;

    debugLog(`${logPrefix} ===== addDocuments() called with ${documents.length} documents =====`);
    debugLog(`${logPrefix} Current indexCleared status: ${this.indexCleared}`);

    if (!this.index) {
      throw new Error('Search engine not initialized');
    }

    // IMPORTANT: Only clear on the first call, not on every batch
    if (!this.indexCleared) {
      debugLog(
        `${logPrefix} 🔥 CLEARING INDEX - First batch detected! indexCleared=${this.indexCleared}`,
      );
      await this.clear();
      this.indexCleared = true;
      debugLog(`${logPrefix} ✅ Index cleared, indexCleared now set to: ${this.indexCleared}`);
    } else {
      debugLog(
        `${logPrefix} ➕ Adding to existing index (subsequent batch), indexCleared=${this.indexCleared}`,
      );
    }

    debugLog(`${logPrefix} About to process ${documents.length} documents...`);

    // Add documents to internal map and index (don't clear existing ones)
    for (const doc of documents) {
      debugLog(`[FlexSearchAdapter] Processing document: ${doc.id} - ${doc.title || doc.fileName}`);

      // Store only lightweight metadata, not the full document with content
      const metadata: DocumentMetadata = {
        id: doc.id,
        type: doc.type,
        title: doc.title,
        fileName: doc.fileName,
        filePath: doc.filePath,
        fileUri: doc.fileUri,
        tags: doc.tags,
        sectionIndex: doc.sectionIndex,
        sectionNumber: doc.sectionNumber,
        parentId: doc.parentId,
        metadata: doc.metadata, // Preserve custom metadata
      };

      this.documents.set(doc.id, metadata);
      debugLog(`[FlexSearchAdapter] Stored metadata in documents Map with ID: "${doc.id}"`);

      // Prepare document for FlexSearch (this includes content for indexing)
      const indexDoc: DocumentIndex = {
        id: doc.id,
        content: doc.content, // FlexSearch needs content for indexing
        title: doc.title || '',
        type: doc.type,
        fileUri: doc.fileUri,
        fileName: doc.fileName,
        filePath: doc.filePath,
        sectionIndex: doc.sectionIndex ?? 0, // Ensure not undefined
      };

      // Debug logging - uncomment for debugging indexing issues
      // debugLog(`[FlexSearchAdapter] Adding to FlexSearch index:`, {
      //   id: indexDoc.id,
      //   contentLength: indexDoc.content.length,
      //   title: indexDoc.title,
      //   type: indexDoc.type,
      // });

      this.index.add(indexDoc);
    }

    debugLog(`[FlexSearchAdapter] Successfully added ${documents.length} documents to index`);
    debugLog(`[FlexSearchAdapter] Documents map size: ${this.documents.size}`);
    debugLog(
      `[FlexSearchAdapter] First 5 document IDs in Map:`,
      Array.from(this.documents.keys()).slice(0, 5),
    );
  }

  async removeDocuments(ids: string[]): Promise<void> {
    if (!this.index) {
      throw new Error('Search engine not initialized');
    }

    for (const id of ids) {
      this.documents.delete(id);
      this.index.remove(id);
    }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    debugLog('[FlexSearchAdapter] Starting search with query:', query, 'options:', options);

    if (!this.index) {
      console.error('[FlexSearchAdapter] Search engine not initialized');
      throw new Error('Search engine not initialized');
    }

    if (!query || query.trim().length === 0) {
      debugLog('[FlexSearchAdapter] Empty query, returning empty results');
      return [];
    }

    debugLog('[FlexSearchAdapter] Total documents in memory:', this.documents.size);
    debugLog('[FlexSearchAdapter] Document IDs:', Array.from(this.documents.keys()).slice(0, 5));

    // Prepare search options
    const searchOptions: FlexSearchOptions_Internal = {
      limit: options?.limit || 50,
      threshold: options?.fuzzyThreshold !== undefined ? options.fuzzyThreshold : 0.5,
      where: undefined,
    };

    // Add type filtering if specified
    if (options?.types && options.types.length > 0) {
      searchOptions.where = {
        type: options.types,
      };
    }

    debugLog('[FlexSearchAdapter] Search options:', searchOptions);

    // Perform search across all indexed fields
    const fields = options?.fields || ['content', 'title', 'fileName'];
    const results: Map<string, { score: number; matches: FlexSearchMatch[] }> = new Map();

    debugLog('[FlexSearchAdapter] Searching fields:', fields);

    // Search each field
    for (const field of fields) {
      debugLog(`[FlexSearchAdapter] Searching field: ${field}`);

      // FlexSearch Document search with field-specific options
      const searchOpts: any = {
        limit: searchOptions.limit,
        index: field,
        suggest: true, // Enable suggestions for fuzzy matching
      };

      // Add where clause if we have type filtering
      if (searchOptions.where) {
        searchOpts.where = searchOptions.where;
      }

      const fieldResults = this.index.search(query, searchOpts);

      debugLog(`[FlexSearchAdapter] Field "${field}" returned:`, fieldResults);
      debugLog(`[FlexSearchAdapter] Field "${field}" results type:`, typeof fieldResults);
      if (Array.isArray(fieldResults) && fieldResults.length > 0) {
        debugLog(`[FlexSearchAdapter] First result structure:`, JSON.stringify(fieldResults[0]));
      }

      // Process results from this field
      if (Array.isArray(fieldResults)) {
        debugLog(
          `[FlexSearchAdapter] Processing ${fieldResults.length} results from field "${field}"`,
        );

        for (const result of fieldResults) {
          // FlexSearch Document search returns different formats depending on configuration
          let resultId: string = '';
          let resultScore: number = 1;

          debugLog(`[FlexSearchAdapter] Processing result:`, result, 'type:', typeof result);

          // Check if it's a Document search result with nested structure
          if (typeof result === 'object' && result !== null) {
            // Try different possible structures
            if ('id' in result) {
              // Standard document result: { id: string, ... }
              resultId = String(result.id);
              if ('score' in result && typeof result.score === 'number') {
                resultScore = result.score;
              }
            } else if ('result' in result && Array.isArray(result.result)) {
              // Field-specific result: { field: string, result: string[] }
              // Process ALL result IDs from the array
              for (const id of result.result) {
                const idStr = String(id);
                const existingResult = results.get(idStr);
                if (existingResult) {
                  // Combine scores and matches from multiple fields
                  existingResult.score = Math.max(existingResult.score, resultScore);
                  existingResult.matches.push({ field, result: id });
                } else {
                  results.set(idStr, {
                    score: resultScore,
                    matches: [{ field, result: id }],
                  });
                }
              }
              continue; // Skip the single-result processing below
            } else {
              // Unknown object structure - log it for debugging
              debugLog(
                `[FlexSearchAdapter] Unknown result object structure:`,
                JSON.stringify(result),
              );
            }
            debugLog(
              `[FlexSearchAdapter] Document result ID: "${resultId}", score: ${resultScore}`,
            );
          } else if (typeof result === 'string') {
            // Simple string ID result (fallback)
            resultId = result;
            debugLog(`[FlexSearchAdapter] Simple string result: "${resultId}"`);
          } else if (typeof result === 'number') {
            // Numeric ID result - convert to string
            resultId = String(result);
            debugLog(`[FlexSearchAdapter] Numeric result converted: "${resultId}"`);
          }

          if (resultId) {
            debugLog(
              `[FlexSearchAdapter] Checking if document ID "${resultId}" exists in documents Map...`,
            );
            debugLog(
              `[FlexSearchAdapter] Documents Map has ID "${resultId}":`,
              this.documents.has(resultId),
            );

            const existingResult = results.get(resultId);
            if (existingResult) {
              // Combine scores and matches from multiple fields
              existingResult.score = Math.max(existingResult.score, resultScore);
              existingResult.matches.push({ field, result });
              debugLog(
                `[FlexSearchAdapter] Updated existing result for "${resultId}", new score: ${existingResult.score}`,
              );
            } else {
              results.set(resultId, {
                score: resultScore,
                matches: [{ field, result }],
              });
              debugLog(
                `[FlexSearchAdapter] Added new result for "${resultId}", score: ${resultScore}`,
              );
            }
          }
        }
      }
    }

    // Convert to SearchResult format
    const searchResults: SearchResult[] = [];

    debugLog(
      `[FlexSearchAdapter] Converting ${results.size} matched document IDs to SearchResults`,
    );

    for (const [id, resultData] of results.entries()) {
      const { score, matches } = resultData;
      const doc = this.documents.get(id);
      if (!doc) {
        console.warn(`[FlexSearchAdapter] Document ${id} not found in documents map!`);
        continue;
      }

      debugLog(`[FlexSearchAdapter] Processing document ${id}: ${doc.title || doc.fileName}`);

      // Apply metadata filters if specified
      if (options?.filters && doc.metadata) {
        let matchesFilters = true;
        for (const [key, value] of Object.entries(options.filters)) {
          const metadataValue = doc.metadata[key];

          // Handle array values (e.g., repository: ["app1", "app2"])
          if (Array.isArray(value)) {
            if (!value.includes(metadataValue)) {
              matchesFilters = false;
              break;
            }
          } else if (metadataValue !== value) {
            matchesFilters = false;
            break;
          }
        }

        if (!matchesFilters) {
          continue; // Skip this result as it doesn't match filters
        }
      } else if (options?.filters && !doc.metadata) {
        // Skip documents without metadata when filters are specified
        continue;
      }

      // Extract match information - without needing full content
      const matchInfos: MatchInfo[] = [];

      // Create a snippet instead of using full content
      let contentSnippet = '';

      for (const { field } of matches) {
        // For title and fileName, we have the data
        if (field === 'title' || field === 'fileName') {
          const fieldContent = field === 'title' ? doc.title || '' : doc.fileName;
          const matchInfo = this.createMatchInfo(query, fieldContent, field);
          if (matchInfo) {
            matchInfos.push(matchInfo);
          }
        } else if (field === 'content') {
          // For content matches, create a placeholder match
          const contentMatch: MatchInfo = {
            field: 'content',
            matchedText: query,
            context: {
              before: '...',
              after: '...',
            },
            position: { start: 0, end: query.length },
          };
          matchInfos.push(contentMatch);
          contentSnippet = `[Content contains "${query}" - load full document to view]`;
        }
      }

      // Build search result with metadata only (no full content)
      const result: SearchResult = {
        id: doc.id,
        type: doc.type,
        score,
        // Return empty content or snippet - consumer should load full content if needed
        content: contentSnippet || '',
        title: doc.title,
        fileName: doc.fileName,
        filePath: doc.filePath || '',
        fileUri: doc.fileUri || '',
        tags: doc.tags,
        parentId: doc.parentId,
        sectionIndex: doc.sectionIndex,
        sectionNumber: doc.sectionNumber,
        metadata: doc.metadata, // Include custom metadata in results
        matches: matchInfos,
        // Return empty string for highlights when content not loaded
        highlights: '',
      };

      searchResults.push(result);
    }

    debugLog(`[FlexSearchAdapter] Final search results count: ${searchResults.length}`);
    debugLog(
      `[FlexSearchAdapter] Sample results:`,
      searchResults.slice(0, 2).map((r) => ({ id: r.id, title: r.title, score: r.score })),
    );

    // Sort by score
    searchResults.sort((a, b) => b.score - a.score);

    // Apply limit
    if (options?.limit) {
      return searchResults.slice(0, options.limit);
    }

    return searchResults;
  }

  async exportIndex(): Promise<unknown> {
    if (!this.index) {
      throw new Error('Search engine not initialized');
    }

    debugLog('Exporting index metadata only (skipping FlexSearch index data to prevent OOM)...');

    // For large indices, we'll only save metadata and skip the FlexSearch export
    // The index will be rebuilt on next startup from the file system
    const documentCount = this.documents.size;

    if (documentCount > 1000) {
      debugLog(
        `[FlexSearchAdapter] Large index detected (${documentCount} documents), exporting metadata only`,
      );

      return {
        // Don't export the full FlexSearch index data - it's too large
        index: null,
        metadata: Array.from(this.documents.entries()),
        exportMetadata: {
          totalDocuments: documentCount,
          exportType: 'metadata-only',
          note: 'Full index data skipped to prevent OOM - will rebuild on next startup',
        },
      };
    }

    // For smaller indices, do the full export
    debugLog('Small index detected, doing full export...');

    return new Promise((resolve, reject) => {
      const exportedData: unknown[] = [];

      try {
        this.index.export((key: string, data: unknown) => {
          exportedData.push({ key, data });
        });

        debugLog(`[FlexSearchAdapter] Full index exported with ${exportedData.length} chunks`);

        resolve({
          index: exportedData,
          metadata: Array.from(this.documents.entries()),
          exportMetadata: {
            totalDocuments: documentCount,
            exportType: 'full',
            totalChunks: exportedData.length,
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async importIndex(data: unknown): Promise<void> {
    if (!this.index) {
      await this.initialize();
    }

    // Type guard and import the index data
    if (this.isValidImportData(data)) {
      // Check if this is a metadata-only export (large index that skipped FlexSearch data)
      const exportMeta = (data as any).exportMetadata;
      if (exportMeta?.exportType === 'metadata-only') {
        debugLog(
          `[FlexSearchAdapter] Importing metadata-only index (${exportMeta.totalDocuments} documents)`,
        );
        debugLog(`[FlexSearchAdapter] Note: ${exportMeta.note}`);

        // Only restore metadata - FlexSearch index will need to be rebuilt
        const metadataArray = data.metadata;
        if (metadataArray) {
          this.documents.clear();
          for (const [id, docOrMeta] of metadataArray) {
            const metadata: DocumentMetadata = {
              id: docOrMeta.id,
              type: docOrMeta.type,
              title: docOrMeta.title,
              fileName: docOrMeta.fileName,
              filePath: docOrMeta.filePath,
              fileUri: docOrMeta.fileUri,
              tags: docOrMeta.tags,
              sectionIndex: docOrMeta.sectionIndex,
              sectionNumber: docOrMeta.sectionNumber,
              parentId: docOrMeta.parentId,
              metadata: docOrMeta.metadata,
            };
            this.documents.set(id, metadata);
          }
        }
        return; // Skip FlexSearch import for metadata-only exports
      }

      // Full export - import both FlexSearch index and metadata
      if (data.index && Array.isArray(data.index)) {
        debugLog(`[FlexSearchAdapter] Importing full index with ${data.index.length} chunks`);
        // Handle the key-value pairs from export
        for (const item of data.index) {
          if (item.key && item.data !== undefined) {
            this.index.import(String(item.key), item.data as string);
          }
        }
      }

      // Restore documents map
      // Support both old format (documents) and new format (metadata)
      const metadataArray = data.metadata || data.documents;
      if (metadataArray) {
        this.documents.clear();
        for (const [id, docOrMeta] of metadataArray) {
          // If it's old format with content, extract only metadata
          const metadata: DocumentMetadata = {
            id: docOrMeta.id,
            type: docOrMeta.type,
            title: docOrMeta.title,
            fileName: docOrMeta.fileName,
            filePath: docOrMeta.filePath,
            fileUri: docOrMeta.fileUri,
            tags: docOrMeta.tags,
            sectionIndex: docOrMeta.sectionIndex,
            sectionNumber: docOrMeta.sectionNumber,
            parentId: docOrMeta.parentId,
            metadata: docOrMeta.metadata,
          };
          this.documents.set(id, metadata);
        }
      }
    }
  }

  async clear(): Promise<void> {
    if (!this.index) {
      return;
    }

    // Clear all documents
    const ids = Array.from(this.documents.keys());
    for (const id of ids) {
      this.index.remove(id);
    }

    this.documents.clear();
    // Don't reset indexCleared flag here - it should only be reset when starting a new indexing session
  }

  /**
   * Start a new indexing session - resets the indexCleared flag
   * This should be called before starting a new batch of addDocuments calls
   */
  startNewIndexingSession(): void {
    const timestamp = new Date().toISOString();
    this.sessionId = Math.random().toString(36).substring(7); // Generate new session ID
    const logPrefix = `[FlexSearchAdapter:${this.sessionId}:${timestamp}]`;

    debugLog(`${logPrefix} 🚀 STARTING NEW INDEXING SESSION`);
    debugLog(`${logPrefix} Previous indexCleared status: ${this.indexCleared}`);
    this.indexCleared = false;
    debugLog(`${logPrefix} Reset indexCleared to: ${this.indexCleared}`);
  }

  /**
   * Get all documents from the index
   */
  async getAllDocuments(): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    // Simply iterate over all documents we have stored
    for (const [, doc] of this.documents.entries()) {
      const result: SearchResult = {
        id: doc.id,
        type: doc.type,
        score: 1, // No score for direct retrieval
        content: '', // No content stored in metadata
        title: doc.title,
        fileName: doc.fileName,
        filePath: doc.filePath || '',
        fileUri: doc.fileUri || '',
        tags: doc.tags,
        parentId: doc.parentId,
        sectionIndex: doc.sectionIndex,
        sectionNumber: doc.sectionNumber,
        metadata: doc.metadata,
        matches: [],
        highlights: '',
      };
      results.push(result);
    }

    return results;
  }

  /**
   * Create match information for a query in content
   */
  private createMatchInfo(query: string, content: string, field: string): MatchInfo | null {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) {
      // Try to find partial matches
      const words = lowerQuery.split(/\s+/);
      for (const word of words) {
        const wordIndex = lowerContent.indexOf(word);
        if (wordIndex !== -1) {
          return this.createMatchContext(content, word, wordIndex, field);
        }
      }
      return null;
    }

    return this.createMatchContext(content, query, index, field);
  }

  /**
   * Create match context with before/after text
   */
  private createMatchContext(
    content: string,
    matchedText: string,
    index: number,
    field: string,
  ): MatchInfo {
    const contextLength = 50;
    const beforeStart = Math.max(0, index - contextLength);
    const afterEnd = Math.min(content.length, index + matchedText.length + contextLength);

    return {
      field,
      matchedText,
      context: {
        before: content.substring(beforeStart, index),
        after: content.substring(index + matchedText.length, afterEnd),
      },
      position: {
        start: index,
        end: index + matchedText.length,
      },
    };
  }

  /**
   * Create highlighted content snippet
   * TODO: This needs to be reimplemented to work with on-demand content loading.
   * Options:
   * 1. Load snippet from file around match position
   * 2. Store small context windows during indexing
   * 3. Use FlexSearch's built-in context feature
   * For now, returning empty string to avoid memory issues.
   */
  // @ts-ignore - Keeping for future implementation
  private createHighlights(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) {
      // Return first 150 characters if no match
      return content.substring(0, 150) + (content.length > 150 ? '...' : '');
    }

    // Extract a snippet around the match
    const snippetStart = Math.max(0, index - 50);
    const snippetEnd = Math.min(content.length, index + query.length + 50);

    let snippet = content.substring(snippetStart, snippetEnd);

    // Add ellipsis if needed
    if (snippetStart > 0) snippet = '...' + snippet;
    if (snippetEnd < content.length) snippet = snippet + '...';

    return snippet;
  }

  /**
   * Type guard for import data
   */
  private isValidImportData(data: unknown): data is {
    index?: Array<{ key: string; data: unknown }>;
    documents?: Array<[string, SearchableDocument]>;
    metadata?: Array<[string, DocumentMetadata]>;
  } {
    return (
      typeof data === 'object' &&
      data !== null &&
      (!('index' in data) || Array.isArray((data as { index?: unknown }).index)) &&
      (!('documents' in data) || Array.isArray((data as { documents?: unknown }).documents)) &&
      (!('metadata' in data) || Array.isArray((data as { metadata?: unknown }).metadata))
    );
  }
}
