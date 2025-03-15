
/**
 * Build script to generate blog data
 * Run with: node src/apps/blog/scripts/build.js
 */
require('ts-node').register({ transpileOnly: true });
require('./generateBlogData.ts').default();
