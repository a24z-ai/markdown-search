/**
 * Factory for creating search engine adapters
 */

import { FlexSearchAdapter } from './adapters/implementations/FlexSearchAdapter';
import { SearchEngineAdapter, SearchEngineOptions } from './adapters/types';

export type SearchEngineType = 'flexsearch' | 'fuse' | 'lunr' | 'minisearch' | 'orama';

export interface SearchEngineFactoryOptions {
  type: SearchEngineType;
  options?: SearchEngineOptions;
}

export class SearchEngineFactory {
  /**
   * Create a search engine adapter of the specified type
   */
  static create(type: SearchEngineType, options?: SearchEngineOptions): SearchEngineAdapter {
    switch (type) {
      case 'flexsearch':
        return new FlexSearchAdapter(options);

      // Future implementations
      case 'fuse':
        throw new Error('Fuse.js adapter not yet implemented');

      case 'lunr':
        throw new Error('Lunr.js adapter not yet implemented');

      case 'minisearch':
        throw new Error('MiniSearch adapter not yet implemented');

      case 'orama':
        throw new Error('Orama adapter not yet implemented');

      default:
        throw new Error(`Unknown search engine type: ${type}`);
    }
  }

  /**
   * Get the default search engine type
   */
  static getDefault(): SearchEngineType {
    return 'flexsearch';
  }

  /**
   * Check if a search engine type is available
   */
  static isAvailable(type: SearchEngineType): boolean {
    try {
      // For now, only FlexSearch is implemented
      return type === 'flexsearch';
    } catch {
      return false;
    }
  }

  /**
   * Get all available search engine types
   */
  static getAvailable(): SearchEngineType[] {
    const allTypes: SearchEngineType[] = ['flexsearch', 'fuse', 'lunr', 'minisearch', 'orama'];
    return allTypes.filter((type) => this.isAvailable(type));
  }

  /**
   * Create an in-memory search engine (convenience method)
   */
  static createInMemoryEngine(options?: Partial<SearchEngineOptions>): SearchEngineAdapter {
    return new FlexSearchAdapter({
      ...options,
      // Force in-memory storage
      storage: undefined,
    });
  }
}
