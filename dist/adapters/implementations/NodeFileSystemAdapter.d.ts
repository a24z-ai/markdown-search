/**
 * Node.js/Bun implementation of FileSystemAdapter
 * Uses Bun's fast file operations when available
 */
import { SearchFileSystemAdapter, FileInfo, FindOptions } from '../types';
export declare class NodeFileSystemAdapter implements SearchFileSystemAdapter {
    private rootPath;
    constructor(rootPath?: string);
    /**
     * Find all markdown files in the workspace using Bun's Glob
     */
    findMarkdownFiles(options?: FindOptions): Promise<FileInfo[]>;
    /**
     * Read file content using Bun's fast file operations
     */
    readFile(path: string): Promise<string>;
    /**
     * Get relative path from root
     */
    getRelativePath(path: string): string;
    /**
     * Get file information
     */
    getFileInfo(path: string): Promise<FileInfo>;
}
//# sourceMappingURL=NodeFileSystemAdapter.d.ts.map