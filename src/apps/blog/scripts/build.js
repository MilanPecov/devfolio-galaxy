
// ES Module version of the build script
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import generateBlogData from './generateBlogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Run the generator script
console.log('Generating blog data...');
try {
  generateBlogData();
} catch (error) {
  console.error('Error generating blog data:', error);
  process.exit(1);
}
