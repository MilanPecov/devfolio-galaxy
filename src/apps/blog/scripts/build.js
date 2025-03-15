
// ES Module version of the build script
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Set up ts-node for TypeScript execution
const tsNode = require('ts-node');
tsNode.register({ transpileOnly: true });

// Import and run the generator script
import generateBlogData from './generateBlogData.js';
generateBlogData();
