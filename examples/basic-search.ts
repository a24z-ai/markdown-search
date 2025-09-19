#!/usr/bin/env bun
/**
 * Basic example of using @a24z/markdown-search
 *
 * Run with: bun run examples/basic-search.ts
 */

import { createSearchEngine } from '../src';
import type { SearchResult } from '../src/types';

async function main() {
  console.log('🔍 Markdown Search Example\n');

  // Create a search engine instance
  const searchEngine = createSearchEngine({
    rootPath: process.cwd(), // Search in current directory
    storagePath: '.search-index', // Store index in .search-index folder
    indexKey: 'my-docs', // Name for this index
  });

  // Initialize the search engine
  console.log('Initializing search engine...');
  await searchEngine.initialize();

  // Check if we have an existing index
  const hasIndex = await searchEngine.hasIndex();

  if (!hasIndex) {
    console.log('No existing index found. Building index...\n');

    // Index all markdown files
    const result = await searchEngine.indexFiles({
      onProgress: (progress) => {
        switch (progress.phase) {
          case 'discovering':
            console.log(`📁 Discovering files... Found ${progress.totalFiles} files`);
            break;
          case 'parsing':
            console.log(
              `📝 Parsing ${progress.currentFile} (${progress.filesProcessed}/${progress.totalFiles})`,
            );
            break;
          case 'indexing':
            console.log(`🔨 Indexing documents... ${progress.percentage}%`);
            break;
          case 'persisting':
            console.log(`💾 Saving index...`);
            break;
          case 'complete':
            console.log(`✅ Indexing complete!`);
            break;
        }
      },
    });

    console.log(`\n📊 Indexing Results:`);
    console.log(`  - Files indexed: ${result.filesIndexed}`);
    console.log(`  - Sections indexed: ${result.sectionsIndexed || 0}`);
    console.log(`  - Documents indexed: ${result.documentsIndexed}`);
    console.log(`  - Duration: ${result.duration}ms`);

    if (result.errors && result.errors.length > 0) {
      console.log(`  - Errors: ${result.errors.length}`);
      result.errors.forEach((error) => {
        console.log(`    • ${error.file}: ${error.error}`);
      });
    }
  } else {
    console.log('Using existing index.');
    const stats = await searchEngine.getStats();
    if (stats) {
      console.log(`  - Total files: ${stats.totalFiles}`);
      console.log(`  - Total documents: ${stats.totalDocuments}`);
      console.log(`  - Indexed at: ${stats.indexedAt}`);
    }
  }

  // Example searches
  console.log('\n🔎 Performing searches...\n');

  const queries = ['search', 'markdown', 'function', 'TODO'];

  for (const query of queries) {
    console.log(`\nSearching for: "${query}"`);
    console.log('-'.repeat(40));

    const results: SearchResult[] = await searchEngine.search(query, {
      limit: 5,
      types: ['document', 'section', 'code'],
    });

    if (results.length === 0) {
      console.log('No results found.');
    } else {
      console.log(`Found ${results.length} results:`);

      results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.title || 'Untitled'}`);
        console.log(`   Type: ${result.type}`);
        console.log(`   File: ${result.fileName}`);
        console.log(`   Score: ${result.score.toFixed(2)}`);

        // Show a snippet of the content
        const snippet = result.content.substring(0, 100).replace(/\n/g, ' ');
        console.log(`   Preview: ${snippet}...`);
      });
    }
  }

  console.log('\n✨ Example complete!');
}

// Run the example
main().catch(console.error);
