# @a24z/markdown-search

High-performance full-text search for markdown documents using FlexSearch and Bun.

## Features

- 🚀 **Fast Performance** - Built on Bun runtime for blazing fast file operations
- 🔍 **Full-Text Search** - Powered by FlexSearch for efficient indexing and searching
- 📝 **Markdown-Optimized** - Understands markdown structure (sections, code blocks, tables, etc.)
- 🎯 **Flexible Searching** - Search by document type, language, with fuzzy matching
- 💾 **Persistent Indexes** - Save and load search indexes for instant startup
- 🔌 **Extensible** - Adapter pattern for different platforms (Node, VS Code, etc.)
- 🏗️ **TypeScript** - Full TypeScript support with comprehensive types

## Installation

```bash
bun add @a24z/markdown-search
```

Or with npm:

```bash
npm install @a24z/markdown-search
```

## Quick Start

```typescript
import { createSearchEngine } from '@a24z/markdown-search';

// Create a search engine instance
const searchEngine = createSearchEngine({
  rootPath: './docs',        // Directory to search
  storagePath: '.search',    // Where to store the index
  indexKey: 'my-docs'        // Name for this index
});

// Initialize and index files
await searchEngine.initialize();
await searchEngine.indexFiles();

// Search for content
const results = await searchEngine.search('your query');

results.forEach(result => {
  console.log(`${result.title} (${result.type})`);
  console.log(`Score: ${result.score}`);
  console.log(`File: ${result.fileName}`);
});
```

## Advanced Usage

### Custom Configuration

```typescript
import { 
  SearchEngine, 
  NodeFileSystemAdapter, 
  NodeStorageAdapter,
  SearchEngineFactory 
} from '@a24z/markdown-search';

const searchEngine = new SearchEngine({
  fileSystem: new NodeFileSystemAdapter('./docs'),
  storage: new NodeStorageAdapter('.search-index'),
  searchEngine: SearchEngineFactory.create('flexsearch', {
    // FlexSearch options
    tokenize: 'forward',
    resolution: 9,
    depth: 3,
  })
});
```

### Indexing with Progress

```typescript
await searchEngine.indexFiles({
  onProgress: (progress) => {
    console.log(`${progress.phase}: ${progress.percentage}%`);
    if (progress.currentFile) {
      console.log(`Processing: ${progress.currentFile}`);
    }
  },
  batchSize: 10,
  indexChunks: true, // Index individual code blocks, tables, etc.
});
```

### Search Options

```typescript
const results = await searchEngine.search('query', {
  // Filter by document type
  types: ['section', 'code', 'table'],
  
  // Filter by programming language (for code blocks)
  languages: ['typescript', 'javascript'],
  
  // Fuzzy search threshold (0-1)
  fuzzyThreshold: 0.8,
  
  // Pagination
  limit: 10,
  offset: 0,
  
  // Search specific fields
  fields: ['content', 'title'],
  
  // Sort options
  sortBy: 'relevance',
  sortOrder: 'desc'
});
```

### Document Types

The search engine understands different types of markdown content:

- `document` - Entire markdown file
- `section` - Document sections (based on headings)
- `code` - Code blocks with language detection
- `mermaid` - Mermaid diagrams
- `table` - Markdown tables
- `heading` - Individual headings
- `paragraph` - Regular text paragraphs
- `list` - List items
- `blockquote` - Quoted text

### Updating the Index

```typescript
// Update specific files
await searchEngine.updateFiles([
  '/path/to/file1.md',
  '/path/to/file2.md'
]);

// Clear and rebuild index
await searchEngine.clearIndex();
await searchEngine.indexFiles();
```

### Index Management

```typescript
// Check if index exists
const hasIndex = await searchEngine.hasIndex();

// Get index statistics
const stats = await searchEngine.getStats();
console.log(`Total files: ${stats.totalFiles}`);
console.log(`Total documents: ${stats.totalDocuments}`);

// Export/Import index for backup
const indexData = await searchEngine.getSearchAdapter().exportIndex();
// ... save indexData somewhere ...

// Later, import it back
await searchEngine.getSearchAdapter().importIndex(indexData);
```

## Platform Support

### Node.js/Bun (Default)

The package includes built-in adapters for Node.js and Bun environments:

- `NodeFileSystemAdapter` - File system operations using Bun's fast APIs
- `NodeStorageAdapter` - File-based storage for indexes

### VS Code Extension

The package maintains compatibility with VS Code extensions through included VS Code adapters:

```typescript
import { 
  VSCodeFileSystemAdapter, 
  VSCodeStorageAdapter 
} from '@a24z/markdown-search/adapters';
```

### Custom Adapters

You can create custom adapters for other platforms:

```typescript
class MyCustomFileSystemAdapter implements SearchFileSystemAdapter {
  async findMarkdownFiles(options?: FindOptions): Promise<FileInfo[]> {
    // Your implementation
  }
  
  async readFile(path: string): Promise<string> {
    // Your implementation
  }
  
  // ... other required methods
}
```

## API Reference

### SearchEngine

The main class for searching markdown documents.

#### Constructor

```typescript
new SearchEngine(config: SearchEngineConfig, indexKey?: string)
```

#### Methods

- `initialize(): Promise<void>` - Initialize the search engine
- `indexFiles(options?: IndexingOptions): Promise<IndexResult>` - Index all markdown files
- `search(query: string, options?: SearchOptions): Promise<SearchResult[]>` - Search the index
- `updateFiles(paths: string[], options?: IndexingOptions): Promise<IndexResult>` - Update specific files
- `clearIndex(): Promise<void>` - Clear the entire index
- `hasIndex(): Promise<boolean>` - Check if index exists
- `getStats(): Promise<SearchIndexStats | null>` - Get index statistics

### Types

See the [types.ts](src/types.ts) file for all available TypeScript types.

## Examples

Check the [examples](examples/) directory for more usage examples:

- [basic-search.ts](examples/basic-search.ts) - Basic search functionality

## Performance

The package is optimized for performance:

- **Bun Runtime**: Leverages Bun's fast file I/O operations
- **Batch Processing**: Indexes files in configurable batches
- **Incremental Updates**: Only re-index changed files
- **Persistent Indexes**: Load pre-built indexes instantly

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Build
bun run build

# Type checking
bun run typecheck

# Format code
bun run format
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

Built by the A24Z Team as part of the markdown tooling ecosystem.