export type ChunkType = 'code' | 'mermaid' | 'table' | 'text' | 'image' | 'link' | 'heading' | 'list';
export interface DocumentChunk {
    type: ChunkType;
    content: string;
    language?: string;
    startLine?: number;
    endLine?: number;
}
export type MetadataValue = string | number | boolean | string[] | undefined;
export interface SearchableDocument {
    id: string;
    type: DocumentType;
    parentId?: string;
    fileUri: string;
    fileName: string;
    filePath: string;
    content: string;
    title?: string;
    location?: {
        startLine: number;
        endLine: number;
        startColumn?: number;
        endColumn?: number;
    };
    sectionIndex?: number;
    sectionNumber?: number;
    sectionLevel?: number;
    language?: string;
    diagramType?: string;
    totalSectionsInFile?: number;
    previousSectionTitle?: string;
    nextSectionTitle?: string;
    metadata?: Record<string, MetadataValue>;
    boost?: number;
    tags?: string[];
    contentHash?: string;
    indexedAt?: string;
}
export type DocumentType = 'document' | 'section' | 'code' | 'mermaid' | 'table' | 'heading' | 'image' | 'link' | 'list' | 'blockquote' | 'paragraph' | 'note';
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
    estimatedReadTime?: number;
}
export interface SearchResult extends SearchableDocument {
    score: number;
    matches: MatchInfo[];
    highlights?: string;
    breadcrumb?: string[];
}
export interface MatchInfo {
    field: string;
    matchedText: string;
    context: {
        before: string;
        after: string;
    };
    position?: {
        start: number;
        end: number;
    };
}
export interface SearchOptions {
    types?: DocumentType[];
    languages?: string[];
    fuzzyThreshold?: number;
    limit?: number;
    offset?: number;
    fields?: Array<'content' | 'title' | 'metadata'>;
    sortBy?: 'relevance' | 'date' | 'title';
    sortOrder?: 'asc' | 'desc';
}
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
//# sourceMappingURL=types.d.ts.map