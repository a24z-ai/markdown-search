// Chunk/Block types
export type ChunkType = 'code' | 'mermaid' | 'table' | 'text' | 'image' | 'link' | 'heading' | 'list';

// Document chunk/block interface
export interface DocumentChunk {
  type: ChunkType;
  content: string;
  language?: string;
  startLine?: number;
  endLine?: number;
}

// Metadata value types
export type MetadataValue = string | number | boolean | string[] | undefined;

// Base searchable document - extensible for different content types
export interface SearchableDocument {
  id: string; // Unique identifier
  type: DocumentType; // Type of content
  parentId?: string; // Parent document ID (for chunks within documents)

  // File information
  fileUri: string;
  fileName: string;
  filePath: string;

  // Content
  content: string; // The actual searchable text
  title?: string; // Document/section title

  // Location information
  location?: {
    startLine: number;
    endLine: number;
    startColumn?: number;
    endColumn?: number;
  };

  // Type-specific fields
  sectionIndex?: number; // For section type
  sectionNumber?: number;
  sectionLevel?: number; // Heading level for sections
  language?: string; // For code blocks
  diagramType?: string; // For mermaid diagrams
  
  // Context (for sections)
  totalSectionsInFile?: number;
  previousSectionTitle?: string;
  nextSectionTitle?: string;

  // Metadata
  metadata?: Record<string, MetadataValue>;

  // Search-specific
  boost?: number; // Boost factor for ranking
  tags?: string[]; // Tags for filtering
  contentHash?: string;
  indexedAt?: string;
}

export type DocumentType =
  | 'document' // Entire document
  | 'section' // Document section
  | 'code' // Code block
  | 'mermaid' // Mermaid diagram
  | 'table' // Markdown table
  | 'heading' // Individual heading
  | 'image' // Image with alt text
  | 'link' // Link with description
  | 'list' // List items
  | 'blockquote' // Quoted text
  | 'paragraph' // Regular paragraph
  | 'note'; // Repository note

// Document metadata
export interface DocumentMetadata extends Record<string, MetadataValue> {
  wordCount?: number;
  characterCount?: number;
  hasCode: boolean;
  codeLanguages: string[];
  hasMermaid: boolean;
  mermaidTypes?: string[];
  hasMath?: boolean;
  hasTables: boolean;
  hasImages: boolean;
  imageCount?: number;
  hasLinks: boolean;
  linkCount?: number;
  estimatedReadTime?: number; // in seconds
}

// Search result with context
export interface SearchResult extends SearchableDocument {
  score: number; // Relevance score
  matches: MatchInfo[]; // Match details
  highlights?: string; // Highlighted content
  breadcrumb?: string[]; // Path to result (e.g., ["File", "Section 3", "Code Block"])
}

export interface MatchInfo {
  field: string; // Which field matched
  matchedText: string; // Actual matched text
  context: {
    before: string; // Text before match
    after: string; // Text after match
  };
  position?: {
    start: number;
    end: number;
  };
}

// Search options
export interface SearchOptions {
  // Filter by document type
  types?: DocumentType[];

  // Filter by language (for code blocks)
  languages?: string[];

  // Fuzzy search threshold
  fuzzyThreshold?: number;

  // Limit results
  limit?: number;

  // Offset for pagination
  offset?: number;

  // Search within specific fields
  fields?: Array<'content' | 'title' | 'metadata'>;

  // Sort options
  sortBy?: 'relevance' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Match detail for highlighting
export interface MatchDetail {
  type: 'title' | 'content' | 'code';
  searchTerm: string;
  matchedText: string;
  position: {
    start: number;
    end: number;
    line: number;
    column: number;
  };
  context: {
    before: string;
    after: string;
    fullLine: string;
  };
  metadata?: {
    blockType?: 'code' | 'mermaid' | 'table' | 'math' | 'markdown';
    language?: string;
    headerLevel?: number;
  };
}