/**
 * VS Code implementation of SearchFileSystemAdapter
 * Uses VS Code's workspace API for file system operations
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
// This file interfaces with external VSCode APIs that are not typed in this context

import { createIncludePattern, createExclusionPattern } from '../../constants';
import {
  SearchFileSystemAdapter,
  FileInfo,
  FindOptions,
  FileWatchCallback,
  Disposable,
} from '../../types';

// VS Code API types (will be injected)
export interface VSCodeAPI {
  workspace: {
    findFiles(include: string, exclude?: string | null, maxResults?: number): Thenable<any[]>;
    openTextDocument(uri: any): Thenable<{ getText(): string }>;
    createFileSystemWatcher(pattern: string): any;
    asRelativePath(path: string): string;
    workspaceFolders?: Array<{ uri: { fsPath?: string; path: string } }>;
    fs: {
      stat(uri: any): Thenable<{ ctime: number; mtime: number; size: number }>;
    };
  };
  Uri: {
    parse(path: string): any;
    file(path: string): any;
  };
}

// Thenable interface for VS Code compatibility
interface Thenable<T> {
  then<TResult>(
    onfulfilled?: (value: T) => TResult | Thenable<TResult>,
    onrejected?: (reason: any) => TResult | Thenable<TResult>,
  ): Thenable<TResult>;
}

export class VSCodeFileSystemAdapter implements SearchFileSystemAdapter {
  private vscode: VSCodeAPI;

  constructor(vscode: VSCodeAPI) {
    this.vscode = vscode;
  }

  async findMarkdownFiles(options?: FindOptions): Promise<FileInfo[]> {
    // Create include and exclude patterns using shared utilities
    const includePattern = createIncludePattern(options?.include);
    const excludePattern = createExclusionPattern(options?.exclude);

    // Find files
    const files = await this.vscode.workspace.findFiles(
      includePattern,
      excludePattern,
      options?.maxDepth ? undefined : 10000, // VS Code doesn't support maxDepth directly
    );

    // Convert to FileInfo
    const fileInfos: FileInfo[] = [];
    for (const uri of files) {
      try {
        const stat = await this.vscode.workspace.fs.stat(uri);
        const path = uri.fsPath || uri.path;
        const name = path.split(/[/\\]/).pop() || '';

        fileInfos.push({
          path,
          name,
          size: stat.size,
          modifiedAt: new Date(stat.mtime),
          uri: uri.toString(),
        });
      } catch (error) {
        // Skip files that can't be accessed
        console.warn(`Failed to stat file ${uri.toString()}:`, error);
      }
    }

    return fileInfos;
  }

  async readFile(path: string): Promise<string> {
    try {
      // Try to parse as URI first
      const uri = path.startsWith('file://')
        ? this.vscode.Uri.parse(path)
        : this.vscode.Uri.file(path);

      const document = await this.vscode.workspace.openTextDocument(uri);
      return document.getText();
    } catch (error) {
      throw new Error(`Failed to read file ${path}: ${error}`);
    }
  }

  watchFiles(pattern: string, callback: FileWatchCallback): Disposable {
    const watcher = this.vscode.workspace.createFileSystemWatcher(pattern);

    // Set up event handlers
    const disposables: any[] = [];

    disposables.push(
      watcher.onDidCreate((uri: any) => {
        callback({
          type: 'created',
          path: uri.fsPath || uri.path,
        });
      }),
    );

    disposables.push(
      watcher.onDidChange((uri: any) => {
        callback({
          type: 'changed',
          path: uri.fsPath || uri.path,
        });
      }),
    );

    disposables.push(
      watcher.onDidDelete((uri: any) => {
        callback({
          type: 'deleted',
          path: uri.fsPath || uri.path,
        });
      }),
    );

    // Return disposable that cleans up everything
    return {
      dispose: () => {
        watcher.dispose();
        disposables.forEach(d => d.dispose());
      },
    };
  }

  getRelativePath(path: string): string {
    return this.vscode.workspace.asRelativePath(path);
  }

  async getFileInfo(path: string): Promise<FileInfo> {
    try {
      const uri = path.startsWith('file://')
        ? this.vscode.Uri.parse(path)
        : this.vscode.Uri.file(path);

      const stat = await this.vscode.workspace.fs.stat(uri);
      const name = path.split(/[/\\]/).pop() || '';

      return {
        path,
        name,
        size: stat.size,
        modifiedAt: new Date(stat.mtime),
        uri: uri.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to get file info for ${path}: ${error}`);
    }
  }

  /**
   * Check if a file exists
   */
  async exists(path: string): Promise<boolean> {
    try {
      await this.getFileInfo(path);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get workspace root path(s)
   */
  getWorkspaceRoots(): string[] {
    if (!this.vscode.workspace.workspaceFolders) {
      return [];
    }

    return this.vscode.workspace.workspaceFolders.map(
      (folder: any) => folder.uri.fsPath || folder.uri.path,
    );
  }
}
