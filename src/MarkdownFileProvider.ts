/**
 * Interface for providing markdown files to the search engine
 * Users implement this for their specific environment (Node.js, VSCode, Deno, etc.)
 */

export interface MarkdownFile {
  /** Full path to the file */
  path: string;
  /** File name (basename) */
  name: string;
  /** File size in bytes */
  size: number;
  /** Last modified timestamp */
  modifiedAt: Date;
  /** URI representation (e.g., file:// or vscode://) */
  uri: string;
}

export interface FindOptions {
  /** Include patterns (default: all markdown files) */
  include?: string[];
  /** Exclude patterns */
  exclude?: string[];
}

export interface FileChange {
  /** Type of change */
  type: 'created' | 'modified' | 'deleted';
  /** File that changed */
  file: MarkdownFile;
}

export interface Disposable {
  dispose(): void;
}

/**
 * Provider interface for markdown files
 * Users implement this for their specific environment
 */
export interface MarkdownFileProvider {
  /**
   * Find markdown files matching the given patterns
   */
  findMarkdownFiles(options?: FindOptions): Promise<MarkdownFile[]>;

  /**
   * Read the content of a markdown file
   */
  readMarkdownFile(path: string): Promise<string>;

  /**
   * Get file information for a specific file
   */
  getFileInfo(path: string): Promise<MarkdownFile>;

  /**
   * Watch for file changes (optional)
   * @param callback Called when files change
   * @returns Disposable to stop watching
   */
  watchFiles?(callback: (changes: FileChange[]) => void): Disposable;
}