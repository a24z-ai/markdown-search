/**
 * DocumentIndexer - Converts parsed markdown documents into searchable documents
 */

// Import from @a24z/markdown-utils package  
import {
  parseMarkdownIntoPresentation,
  CHUNK_TYPES,
} from '@a24z/markdown-utils';

import { type IndexingOptions } from './adapters/types';
import { type MarkdownFile } from './MarkdownFileProvider';
import {
  SearchableDocument,
  DocumentMetadata,
  DocumentType,
} from './types';

// Define our own document structure since @a24z/markdown-utils uses presentations
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

interface ContentBlock {
  type: string;
  content?: string;
  code?: string;
  language?: string;
}

export class DocumentIndexer {
  /**
   * Create searchable documents from a markdown document
   */
  createSearchDocuments(
    document: MarkdownDocument,
    fileInfo: MarkdownFile,
    options?: IndexingOptions,
  ): SearchableDocument[] {
    const documents: SearchableDocument[] = [];

    // Index the entire document as one searchable item
    const mainDoc: SearchableDocument = {
      id: `${fileInfo.uri || fileInfo.path}#document`,
      type: 'document',
      fileUri: fileInfo.uri || fileInfo.path,
      fileName: fileInfo.name,
      filePath: fileInfo.path,
      content: document.content,
      title: document.title || fileInfo.name,
      location: {
        startLine: 0,
        endLine: document.content.split('\n').length,
      },
      metadata: this.analyzeDocumentContent(document),
      contentHash: this.generateContentHash(document.content),
      indexedAt: new Date().toISOString(),
    };
    
    documents.push(mainDoc);

    // Index individual sections
    document.sections?.forEach((section, sectionIndex) => {
      const sectionDoc: SearchableDocument = {
        id: `${fileInfo.uri || fileInfo.path}#section-${sectionIndex}`,
        type: 'section',
        parentId: mainDoc.id,
        fileUri: fileInfo.uri || fileInfo.path,
        fileName: fileInfo.name,
        filePath: fileInfo.path,
        content: section.content,
        title: section.title || `Section ${sectionIndex + 1}`,
        location: {
          startLine: section.startLine || 0,
          endLine: section.endLine || 0,
        },
        sectionIndex: sectionIndex,
        sectionNumber: sectionIndex + 1,
        sectionLevel: section.level,
        totalSectionsInFile: document.sections?.length || 0,
        previousSectionTitle: sectionIndex > 0 ? document.sections?.[sectionIndex - 1]?.title : undefined,
        nextSectionTitle: sectionIndex < (document.sections?.length || 0) - 1 
          ? document.sections?.[sectionIndex + 1]?.title 
          : undefined,
        metadata: this.analyzeSectionContent(section),
        contentHash: this.generateContentHash(section.content),
        indexedAt: new Date().toISOString(),
      };

      documents.push(sectionDoc);

      // Index individual blocks within sections if requested
      if (options?.indexChunks && section.blocks) {
        section.blocks.forEach((block, blockIndex) => {
          const blockDoc = this.createBlockDocument(block, blockIndex, sectionDoc, fileInfo);
          if (blockDoc) {
            documents.push(blockDoc);
          }
        });
      }
    });

    return documents;
  }

  /**
   * Parse markdown content and create searchable documents
   */
  async parseAndIndex(
    content: string,
    fileInfo: MarkdownFile,
    options?: IndexingOptions,
  ): Promise<SearchableDocument[]> {
    // Use the presentation parser and adapt it to our document structure
    const presentation = parseMarkdownIntoPresentation(content);
    
    // Convert presentation to document structure
    const document: MarkdownDocument = {
      content: content,
      title: fileInfo.name.replace(/\.md$/i, ''),
      sections: presentation.slides.map((slide) => ({
        content: slide.location.content,
        title: slide.title,
        level: 1,
        startLine: slide.location.startLine,
        endLine: slide.location.endLine,
        blocks: slide.chunks,
      })),
    };
    
    return this.createSearchDocuments(document, fileInfo, options);
  }

  /**
   * Analyze document content to extract metadata
   */
  private analyzeDocumentContent(document: MarkdownDocument): DocumentMetadata {
    const content = document.content;
    const metadata: DocumentMetadata = {
      hasCode: false,
      hasMermaid: false,
      hasTables: false,
      hasImages: false,
      hasLinks: false,
      codeLanguages: [],
    };

    // Check for code blocks
    const codeBlockRegex = /```(\w+)?/g;
    let codeMatch;
    while ((codeMatch = codeBlockRegex.exec(content)) !== null) {
      metadata.hasCode = true;
      if (codeMatch[1] && !metadata.codeLanguages.includes(codeMatch[1])) {
        metadata.codeLanguages.push(codeMatch[1]);
      }
    }

    // Check for mermaid diagrams
    if (/```mermaid/i.test(content)) {
      metadata.hasMermaid = true;
    }

    // Check for tables
    if (/\|.+\|/.test(content) && /\|[-:]+\|/.test(content)) {
      metadata.hasTables = true;
    }

    // Check for images
    if (/!\[.*?\]\(.*?\)/.test(content)) {
      metadata.hasImages = true;
    }

    // Check for links (excluding images)
    if (/(?<!!)\[.*?\]\(.*?\)/.test(content)) {
      metadata.hasLinks = true;
    }

    return metadata;
  }

  /**
   * Analyze section content to extract metadata
   */
  private analyzeSectionContent(section: DocumentSection): DocumentMetadata {
    return this.analyzeDocumentContent({ content: section.content } as MarkdownDocument);
  }

  /**
   * Create a searchable document from a content block
   */
  private createBlockDocument(
    block: ContentBlock | any,
    blockIndex: number,
    parentSectionDoc: SearchableDocument,
    fileInfo: MarkdownFile,
  ): SearchableDocument | null {
    // Determine block type and extract content
    let blockType: DocumentType;
    let content: string;
    let language: string | undefined;
    let diagramType: string | undefined;

    // Handle chunk types from @a24z/markdown-utils
    switch (block.type) {
      case CHUNK_TYPES.MERMAID:
      case 'mermaid_chunk':
        blockType = 'mermaid' as const;
        content = block.code || block.content || '';
        diagramType = 'mermaid';
        break;
      case CHUNK_TYPES.CODE:
      case 'code_chunk':
        blockType = 'code' as const;
        content = block.content || block.code || '';
        language = block.language;
        break;
      case CHUNK_TYPES.MARKDOWN:
      case 'markdown_chunk':
        blockType = 'paragraph' as const;
        content = block.content || '';
        break;
      default:
        // Try to handle other types
        if (block.type === 'heading') {
          blockType = 'heading' as const;
          content = block.content || '';
        } else if (block.type === 'list') {
          blockType = 'list' as const;
          content = block.content || '';
        } else if (block.type === 'table') {
          blockType = 'table' as const;
          content = block.content || '';
        } else {
          // Skip unknown block types
          return null;
        }
    }

    // Don't index empty blocks
    if (!content || !content.trim()) {
      return null;
    }

    const blockDoc: SearchableDocument = {
      // Base SearchableDocument fields
      id: `${parentSectionDoc.id}#block-${blockIndex}`,
      type: blockType,
      parentId: parentSectionDoc.id,
      fileUri: fileInfo.uri || fileInfo.path,
      fileName: fileInfo.name,
      filePath: fileInfo.path,
      content: content,
      title: this.generateBlockTitle(blockType, content),

      // Location information
      location: {
        startLine: block.startLine || parentSectionDoc.location?.startLine || 0,
        endLine: block.endLine || parentSectionDoc.location?.endLine || 0,
      },

      // Type-specific fields
      sectionIndex: parentSectionDoc.sectionIndex,
      language: language,
      diagramType: diagramType,

      // Metadata
      metadata: {
        parentSectionTitle: parentSectionDoc.title || '',
        parentSectionId: parentSectionDoc.id || '',
        blockIndex: blockIndex,
      },

      // Search optimization
      boost: this.getBlockBoost(blockType),
      tags: this.generateBlockTags(blockType, language),
    };

    return blockDoc;
  }

  /**
   * Generate a title for a block document
   */
  private generateBlockTitle(blockType: DocumentType, content: string): string {
    const maxLength = 50;
    const firstLine = content.split('\n')[0].trim();

    switch (blockType) {
      case 'code':
        return `Code: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + '...' : firstLine}`;
      case 'mermaid':
        return `Diagram: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + '...' : firstLine}`;
      case 'heading':
        return `Heading: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + '...' : firstLine}`;
      case 'table':
        return `Table: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + '...' : firstLine}`;
      case 'list':
        return `List: ${firstLine.length > maxLength ? firstLine.substring(0, maxLength - 3) + '...' : firstLine}`;
      case 'paragraph':
      default:
        return firstLine.length > maxLength
          ? firstLine.substring(0, maxLength - 3) + '...'
          : firstLine;
    }
  }

  /**
   * Get boost factor for different block types
   */
  private getBlockBoost(blockType: DocumentType): number {
    switch (blockType) {
      case 'heading':
        return 1.5; // Headings are most important
      case 'code':
        return 1.2; // Code blocks are important
      case 'mermaid':
        return 1.1; // Diagrams are also valuable
      case 'table':
        return 1.1; // Tables contain structured data
      default:
        return 1.0;
    }
  }

  /**
   * Generate tags for block documents
   */
  private generateBlockTags(blockType: DocumentType, language?: string): string[] {
    const tags = [blockType as string];

    if (language) {
      tags.push(language);
    }

    return tags;
  }

  /**
   * Generate a simple content hash for change detection
   */
  private generateContentHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}