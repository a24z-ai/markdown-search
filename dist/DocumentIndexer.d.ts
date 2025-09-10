/**
 * DocumentIndexer - Converts parsed markdown documents into searchable documents
 */
import { type FileInfo, type IndexingOptions } from './adapters/types';
import { SearchableDocument } from './types';
interface MarkdownDocument {
    content: string;
    title?: string;
    sections?: DocumentSection[];
}
interface DocumentSection {
    content: string;
    title?: string;
    level?: number;
    startLine?: number;
    endLine?: number;
    blocks?: any[];
}
export declare class DocumentIndexer {
    /**
     * Create searchable documents from a markdown document
     */
    createSearchDocuments(document: MarkdownDocument, fileInfo: FileInfo, options?: IndexingOptions): SearchableDocument[];
    /**
     * Parse markdown content and create searchable documents
     */
    parseAndIndex(content: string, fileInfo: FileInfo, options?: IndexingOptions): Promise<SearchableDocument[]>;
    /**
     * Analyze document content to extract metadata
     */
    private analyzeDocumentContent;
    /**
     * Analyze section content to extract metadata
     */
    private analyzeSectionContent;
    /**
     * Create a searchable document from a content block
     */
    private createBlockDocument;
    /**
     * Generate a title for a block document
     */
    private generateBlockTitle;
    /**
     * Get boost factor for different block types
     */
    private getBlockBoost;
    /**
     * Generate tags for block documents
     */
    private generateBlockTags;
    /**
     * Generate a simple content hash for change detection
     */
    private generateContentHash;
}
export {};
//# sourceMappingURL=DocumentIndexer.d.ts.map