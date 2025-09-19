#!/usr/bin/env node

/**
 * Test script to verify markdown-search can handle large-scale indexing
 * This isolates the library from the electron-app to identify where OOM occurs
 */

const { SearchEngine, NodeStorageAdapter, FlexSearchAdapter } = require('./dist/cjs/index.js');
const fs = require('fs').promises;
const path = require('path');

// Simple file provider for testing
class TestFileProvider {
  constructor(rootDir) {
    this.rootDir = rootDir;
  }

  async findMarkdownFiles() {
    const files = [];

    async function scanDir(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const stats = await fs.stat(fullPath);
          files.push({
            path: fullPath,
            name: entry.name,
            uri: `file://${fullPath}`,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            created: stats.birthtime.toISOString()
          });
        }
      }
    }

    await scanDir(this.rootDir);
    return files;
  }

  async readMarkdownFile(filePath) {
    return await fs.readFile(filePath, 'utf-8');
  }

  async getFileInfo(filePath) {
    const stats = await fs.stat(filePath);
    return {
      path: filePath,
      name: path.basename(filePath),
      uri: `file://${filePath}`,
      size: stats.size,
      modified: stats.mtime.toISOString(),
      created: stats.birthtime.toISOString()
    };
  }
}

// Monitor memory usage
function logMemory(label) {
  const usage = process.memoryUsage();
  console.log(`[${label}] Memory Usage:`, {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`
  });
}

async function testIndexing(testDir) {
  console.log(`\n=== Testing markdown-search indexing on: ${testDir} ===\n`);

  logMemory('Start');

  // Create search engine with test configuration
  const searchEngine = new SearchEngine({
    storage: new NodeStorageAdapter('./test-index'),
    markdownProvider: new TestFileProvider(testDir),
    searchEngine: new FlexSearchAdapter()
  });

  console.log('Initializing search engine...');
  await searchEngine.initialize();

  console.log('Starting indexing...');

  try {
    const result = await searchEngine.indexFiles({
      batchSize: 3, // Same as we're using in the fix
      onProgress: (progress) => {
        if (progress.phase === 'parsing' || progress.filesProcessed % 10 === 0) {
          console.log(`Progress: ${progress.phase} - ${progress.filesProcessed}/${progress.totalFiles} files (${progress.percentage}%)`);
          logMemory(`After ${progress.filesProcessed} files`);
        }

        // Force garbage collection if available
        if (global.gc && progress.filesProcessed % 20 === 0) {
          global.gc();
          console.log('  [Forced GC]');
        }
      }
    });

    console.log('\n=== Indexing completed successfully! ===');
    console.log('Results:', result);
    logMemory('End');

  } catch (error) {
    console.error('\n=== Indexing failed! ===');
    console.error('Error:', error);
    logMemory('Error');
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node test-large-indexing.js <directory-to-index>');
    console.log('');
    console.log('To run with garbage collection exposure:');
    console.log('  node --expose-gc test-large-indexing.js <directory>');
    console.log('');
    console.log('To increase heap size:');
    console.log('  node --max-old-space-size=4096 test-large-indexing.js <directory>');
    process.exit(1);
  }

  const testDir = path.resolve(args[0]);

  // Check if directory exists
  try {
    await fs.access(testDir);
  } catch {
    console.error(`Directory not found: ${testDir}`);
    process.exit(1);
  }

  await testIndexing(testDir);
}

main().catch(console.error);