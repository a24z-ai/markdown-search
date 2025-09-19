import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { SearchEngine } from './SearchEngine';
import { SearchEngineConfig } from './adapters/types';
import { SearchableDocument, SearchResult } from './types';
import { FlexSearchAdapter } from './adapters/implementations/FlexSearchAdapter';
import { NodeStorageAdapter } from './adapters/implementations/NodeStorageAdapter';
import { MarkdownFileProvider, MarkdownFile, FindOptions } from './MarkdownFileProvider';
import * as fs from 'fs/promises';
import * as path from 'path';

// Simple implementation for testing
class TestMarkdownFileProvider implements MarkdownFileProvider {
  async findMarkdownFiles(options?: FindOptions): Promise<MarkdownFile[]> {
    // Not needed for these tests
    return [];
  }

  async readMarkdownFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  async getFileInfo(filePath: string): Promise<MarkdownFile> {
    const stat = await fs.stat(filePath);
    return {
      path: filePath,
      name: path.basename(filePath),
      size: stat.size,
      modifiedAt: stat.mtime,
      uri: `file://${filePath}`,
    };
  }
}

describe('SearchEngine - Metadata Features', () => {
  let searchEngine: SearchEngine;
  let testDir: string;

  beforeEach(async () => {
    // Create test directory
    testDir = path.join(process.cwd(), 'test-metadata-temp');
    await fs.mkdir(testDir, { recursive: true });

    // Create search engine
    const config: SearchEngineConfig = {
      storage: new NodeStorageAdapter(),
      markdownProvider: new TestMarkdownFileProvider(),
      searchEngine: new FlexSearchAdapter(),
    };
    searchEngine = new SearchEngine(config, 'test-metadata-index');
    await searchEngine.initialize();
  });

  afterEach(async () => {
    // Clean up
    await searchEngine.clearIndex();
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('indexDocument', () => {
    it('should index a single document with metadata', async () => {
      // Create a test markdown file
      const testFile = path.join(testDir, 'test.md');
      await fs.writeFile(testFile, '# Test Document\n\nThis is test content for metadata indexing.');

      // Index with metadata
      await searchEngine.indexDocument(testFile, {
        repository: 'test-repo',
        owner: 'test-user',
        category: 'documentation',
      });

      // Search and verify metadata is preserved
      const results = await searchEngine.search('test');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].metadata).toMatchObject({
        repository: 'test-repo',
        owner: 'test-user',
        category: 'documentation',
      });
    });

    it('should handle missing metadata gracefully', async () => {
      const testFile = path.join(testDir, 'test.md');
      await fs.writeFile(testFile, '# Test Document\n\nContent without metadata.');

      // Index without metadata
      await searchEngine.indexDocument(testFile);

      // Should still be searchable
      const results = await searchEngine.search('content');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('indexDocumentsWithMetadata', () => {
    it('should batch index multiple documents with different metadata', async () => {
      // Create test files
      const file1 = path.join(testDir, 'doc1.md');
      const file2 = path.join(testDir, 'doc2.md');
      await fs.writeFile(file1, '# Document One\n\nFirst document content.');
      await fs.writeFile(file2, '# Document Two\n\nSecond document content.');

      // Index with different metadata
      const result = await searchEngine.indexDocumentsWithMetadata([
        { path: file1, metadata: { repository: 'repo1', version: '1.0' } },
        { path: file2, metadata: { repository: 'repo2', version: '2.0' } },
      ]);

      expect(result.filesIndexed).toBe(2);
      expect(result.documentsIndexed).toBeGreaterThan(0);

      // Verify each has correct metadata
      const results1 = await searchEngine.search('first');
      expect(results1[0]?.metadata?.repository).toBe('repo1');

      const results2 = await searchEngine.search('second');
      expect(results2[0]?.metadata?.repository).toBe('repo2');
    });

    it('should report errors for invalid files', async () => {
      const result = await searchEngine.indexDocumentsWithMetadata([
        { path: '/non/existent/file.md', metadata: { test: true } },
      ]);

      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBe(1);
      expect(result.filesIndexed).toBe(0);
    });
  });

  describe('updateDocument', () => {
    it('should update document with new metadata', async () => {
      const testFile = path.join(testDir, 'update.md');
      await fs.writeFile(testFile, '# Update Test\n\nOriginal content.');

      // Initial index
      await searchEngine.indexDocument(testFile, {
        version: '1.0',
        status: 'draft',
      });

      // Update with new metadata
      await searchEngine.updateDocument(testFile, {
        version: '2.0',
        status: 'published',
        updatedAt: '2024-01-01',
      });

      // Verify metadata was updated
      const results = await searchEngine.search('update');
      expect(results[0]?.metadata).toMatchObject({
        version: '2.0',
        status: 'published',
        updatedAt: '2024-01-01',
      });
    });
  });

  describe('removeDocument', () => {
    it('should remove a document from the index', async () => {
      const testFile = path.join(testDir, 'remove.md');
      await fs.writeFile(testFile, '# Remove Test\n\nContent to be removed.');

      // Index document
      await searchEngine.indexDocument(testFile, { test: true });

      // Verify it exists
      let results = await searchEngine.search('remove');
      expect(results.length).toBeGreaterThan(0);

      // Remove document
      await searchEngine.removeDocument(testFile);

      // Verify it's gone
      results = await searchEngine.search('remove');
      expect(results.length).toBe(0);
    });
  });

  describe('removeDocumentsByMetadata', () => {
    it('should remove all documents matching metadata criteria', async () => {
      // Create and index multiple files
      const files = ['doc1.md', 'doc2.md', 'doc3.md'];
      for (const filename of files) {
        const filepath = path.join(testDir, filename);
        await fs.writeFile(filepath, `# ${filename}\n\nContent of ${filename}`);
      }

      // Index with different metadata
      await searchEngine.indexDocument(path.join(testDir, 'doc1.md'), {
        repository: 'repo1',
        category: 'api',
      });
      await searchEngine.indexDocument(path.join(testDir, 'doc2.md'), {
        repository: 'repo1',
        category: 'guide',
      });
      await searchEngine.indexDocument(path.join(testDir, 'doc3.md'), {
        repository: 'repo2',
        category: 'api',
      });

      // Remove all documents from repo1
      const removedCount = await searchEngine.removeDocumentsByMetadata({
        repository: 'repo1',
      });

      expect(removedCount).toBeGreaterThan(0);

      // Verify repo1 documents are gone
      const results = await searchEngine.search('*', {
        filters: { repository: 'repo1' },
      });
      expect(results.length).toBe(0);

      // Verify repo2 documents still exist
      const repo2Results = await searchEngine.search('doc3', {
        filters: { repository: 'repo2' },
      });
      expect(repo2Results.length).toBeGreaterThan(0);
    });

    it('should handle complex metadata criteria', async () => {
      const file = path.join(testDir, 'complex.md');
      await fs.writeFile(file, '# Complex\n\nTest content');

      await searchEngine.indexDocument(file, {
        repository: 'test',
        category: 'api',
        version: '1.0',
      });

      // Remove with multiple criteria
      const removed = await searchEngine.removeDocumentsByMetadata({
        repository: 'test',
        category: 'api',
      });

      expect(removed).toBeGreaterThan(0);

      const results = await searchEngine.search('complex');
      expect(results.length).toBe(0);
    });
  });

  describe('hasDocument', () => {
    it('should return true for indexed documents', async () => {
      const testFile = path.join(testDir, 'exists.md');
      await fs.writeFile(testFile, '# Exists\n\nThis file exists.');

      await searchEngine.indexDocument(testFile);

      const exists = await searchEngine.hasDocument(testFile);
      expect(exists).toBe(true);
    });

    it('should return false for non-indexed documents', async () => {
      const exists = await searchEngine.hasDocument('/non/existent/file.md');
      expect(exists).toBe(false);
    });
  });

  describe('search with metadata filters', () => {
    beforeEach(async () => {
      // Setup test documents with various metadata
      const docs = [
        { file: 'api1.md', content: '# API Doc 1\n\nAPI documentation', metadata: { repository: 'app1', category: 'api' } },
        { file: 'api2.md', content: '# API Doc 2\n\nMore API docs', metadata: { repository: 'app2', category: 'api' } },
        { file: 'guide1.md', content: '# Guide 1\n\nUser guide', metadata: { repository: 'app1', category: 'guide' } },
        { file: 'guide2.md', content: '# Guide 2\n\nAdmin guide', metadata: { repository: 'app2', category: 'guide' } },
      ];

      for (const doc of docs) {
        const filepath = path.join(testDir, doc.file);
        await fs.writeFile(filepath, doc.content);
        await searchEngine.indexDocument(filepath, doc.metadata);
      }
    });

    it('should filter by single metadata field', async () => {
      // Search for actual content instead of wildcard
      const results = await searchEngine.search('doc', {
        filters: { repository: 'app1' },
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.metadata?.repository).toBe('app1');
      });
    });

    it('should filter by multiple metadata fields', async () => {
      const results = await searchEngine.search('API', {
        filters: {
          repository: 'app1',
          category: 'api',
        },
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.metadata?.repository).toBe('app1');
        expect(result.metadata?.category).toBe('api');
      });
    });

    it('should filter with array values', async () => {
      const results = await searchEngine.search('guide', {
        filters: {
          repository: ['app1', 'app2'],
          category: 'guide',
        },
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(['app1', 'app2']).toContain(result.metadata?.repository);
        expect(result.metadata?.category).toBe('guide');
      });
    });

    it('should return empty results when no documents match filters', async () => {
      const results = await searchEngine.search('doc', {
        filters: {
          repository: 'non-existent-repo',
        },
      });

      expect(results.length).toBe(0);
    });

    it('should combine text search with metadata filters', async () => {
      const results = await searchEngine.search('API', {
        filters: {
          repository: 'app1',
        },
      });

      expect(results.length).toBeGreaterThan(0);
      results.forEach(result => {
        expect(result.metadata?.repository).toBe('app1');
        expect(result.metadata?.category).toBe('api');
      });
    });
  });

  describe('metadata preservation', () => {
    it('should preserve metadata through index export/import', async () => {
      const testFile = path.join(testDir, 'preserve.md');
      await fs.writeFile(testFile, '# Preserve\n\nTest preservation.');

      // Index with metadata
      await searchEngine.indexDocument(testFile, {
        repository: 'test-repo',
        customField: 'custom-value',
        numberField: 42,
        boolField: true,
      });

      // Export index
      const exportedData = await searchEngine.getSearchAdapter().exportIndex();

      // Clear and re-import
      await searchEngine.clearIndex();
      await searchEngine.getSearchAdapter().importIndex(exportedData);

      // Verify metadata is preserved
      const results = await searchEngine.search('preserve');
      expect(results[0]?.metadata).toMatchObject({
        repository: 'test-repo',
        customField: 'custom-value',
        numberField: 42,
        boolField: true,
      });
    });

    it('should handle undefined and null metadata values', async () => {
      const testFile = path.join(testDir, 'nullable.md');
      await fs.writeFile(testFile, '# Nullable\n\nTest content.');

      await searchEngine.indexDocument(testFile, {
        defined: 'value',
        undefined: undefined,
        nullable: null,
      });

      const results = await searchEngine.search('nullable');
      expect(results[0]?.metadata?.defined).toBe('value');
    });
  });

  describe('multi-repository use case', () => {
    it('should support repository-based document management', async () => {
      // Simulate multiple repositories
      const repos = [
        { name: 'frontend', owner: 'team1' },
        { name: 'backend', owner: 'team2' },
        { name: 'docs', owner: 'team1' },
      ];

      // Index documents for each repo
      for (const repo of repos) {
        const file = path.join(testDir, `${repo.name}.md`);
        await fs.writeFile(file, `# ${repo.name}\n\nContent for ${repo.name}`);
        await searchEngine.indexDocument(file, {
          repository: repo.name,
          owner: repo.owner,
        });
      }

      // Search by owner
      const team1Docs = await searchEngine.search('content', {
        filters: { owner: 'team1' },
      });
      // Should have documents from frontend and docs repos (team1 owns 2 repos)
      // Each file might create multiple documents (sections), so check > 0
      expect(team1Docs.length).toBeGreaterThan(0);
      // All results should be from team1
      team1Docs.forEach(doc => {
        expect(doc.metadata?.owner).toBe('team1');
      });

      // Remove all docs from a repository
      const removed = await searchEngine.removeDocumentsByMetadata({
        repository: 'backend',
      });
      expect(removed).toBeGreaterThan(0);

      // Verify removal
      const backendDocs = await searchEngine.search('content', {
        filters: { repository: 'backend' },
      });
      expect(backendDocs.length).toBe(0);
    });
  });
});