
// JavaScript version of generateBlogData
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get proper __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path configurations
const CONTENT_DIR = path.join(__dirname, '../content');
const OUTPUT_FILE = path.join(__dirname, '../data/blogData.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
}

// Process each markdown file
function generateBlogData() {
  try {
    const files = fs.readdirSync(CONTENT_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const blogData = markdownFiles.map(filename => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter using gray-matter
      const { data, content } = matter(fileContent);
      
      // Extract slug from filename if not provided in frontmatter
      const slug = data.slug || filename.replace('.md', '');
      
      return {
        slug,
        frontmatter: data,
        content
      };
    });
    
    // Write processed data to JSON file
    fs.writeFileSync(
      OUTPUT_FILE, 
      JSON.stringify(blogData, null, 2)
    );
    
    console.log(`✓ Blog data generated successfully: ${blogData.length} posts processed`);
    return blogData;
  } catch (error) {
    console.error('Error generating blog data:', error);
    throw error;
  }
}

// Default export for ES modules
export default generateBlogData;

// Also provide a way to run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBlogData();
}
