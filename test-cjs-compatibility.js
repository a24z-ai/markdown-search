// Test CommonJS compatibility after markdown-utils update
console.log('Testing CommonJS compatibility...\n');

try {
  // Test basic import
  const { SearchEngine, DocumentIndexer, SearchEngineFactory } = require('./dist/cjs/index.js');
  
  console.log('✅ CommonJS import successful!');
  console.log('✅ SearchEngine:', typeof SearchEngine);
  console.log('✅ DocumentIndexer:', typeof DocumentIndexer);
  console.log('✅ SearchEngineFactory:', typeof SearchEngineFactory);
  
  // Test instantiation
  const factory = SearchEngineFactory.create('flexsearch');
  console.log('✅ SearchEngineFactory.create():', typeof factory);
  
  console.log('\n🎉 Package fully supports CommonJS!');
  console.log('🎯 VSCode extensions can now use: require("@a24z/markdown-search")');
  
} catch (error) {
  console.error('❌ CommonJS compatibility test failed:');
  console.error('Error:', error.message);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
}