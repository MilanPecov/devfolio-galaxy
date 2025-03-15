import { fileURLToPath } from 'url';
import { dirname } from 'path';
import generateBlogData from './generateBlogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the script executes in the correct directory
process.chdir(__dirname);

try {
  generateBlogData();
} catch (error) {
  console.error('Error generating blog data:', error);
  process.exit(1);
}
