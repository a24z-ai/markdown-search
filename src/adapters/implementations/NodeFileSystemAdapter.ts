/**
 * Node.js/Bun implementation of FileSystemAdapter
 * Uses Bun's fast file operations when available
 */

import { SearchFileSystemAdapter, FileInfo, FindOptions } from '../types';
import { mergeExclusions } from '../constants';
import { Glob } from 'bun';
import { join, relative, basename } from 'path';
import { stat } from 'fs/promises';

export class NodeFileSystemAdapter implements SearchFileSystemAdapter {
  private rootPath: string;

  constructor(rootPath: string = process.cwd()) {
    this.rootPath = rootPath;
  }

  /**
   * Find all markdown files in the workspace using Bun's Glob
   */
  async findMarkdownFiles(options?: FindOptions): Promise<FileInfo[]> {
    const { include = ['**/*.md'], exclude = [] } = options || {};
    
    // Merge with default exclusions
    const exclusions = mergeExclusions(exclude);
    
    const files: FileInfo[] = [];
    
    // Use Bun's Glob for fast file discovery
    for (const pattern of include) {
      const glob = new Glob(pattern);
      
      for await (const file of glob.scan({ 
        cwd: this.rootPath,
        onlyFiles: true,
      })) {
        // Check if file should be excluded
        const shouldExclude = exclusions.some(excludePattern => {
          if (excludePattern.includes('*')) {
            // Convert glob pattern to regex
            const regex = new RegExp(
              excludePattern
                .replace(/\./g, '\\.')
                .replace(/\*/g, '.*')
                .replace(/\?/g, '.')
            );
            return regex.test(file);
          }
          return file.includes(excludePattern);
        });
        
        if (!shouldExclude) {
          const fullPath = join(this.rootPath, file);
          const stats = await stat(fullPath);
          
          files.push({
            path: fullPath,
            name: basename(file),
            size: stats.size,
            modifiedAt: stats.mtime,
            uri: `file://${fullPath}`,
          });
        }
      }
    }
    
    return files;
  }

  /**
   * Read file content using Bun's fast file operations
   */
  async readFile(path: string): Promise<string> {
    // Use Bun's file reading when available
    if (typeof Bun !== 'undefined' && Bun.file) {
      const file = Bun.file(path);
      return await file.text();
    }
    
    // Fallback to Node.js fs
    const { readFile } = await import('fs/promises');
    return await readFile(path, 'utf-8');
  }

  /**
   * Get relative path from root
   */
  getRelativePath(path: string): string {
    return relative(this.rootPath, path);
  }

  /**
   * Get file information
   */
  async getFileInfo(path: string): Promise<FileInfo> {
    const stats = await stat(path);
    
    return {
      path,
      name: basename(path),
      size: stats.size,
      modifiedAt: stats.mtime,
      uri: `file://${path}`,
    };
  }

  /**
   * Watch files for changes (optional - not implemented in initial version)
   */
  // watchFiles?(pattern: string, callback: FileWatchCallback): Disposable {
  //   // Could implement using Bun's file watcher or chokidar
  //   throw new Error('File watching not yet implemented');
  // }
}