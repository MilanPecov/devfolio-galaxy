
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPostFrontmatter } from '../domain/BlogPost';

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
      
      // Parse frontmatter using gray-matter (works in Node.js environment)
      const { data, content } = matter(fileContent);
      
      // Extract slug from filename if not provided in frontmatter
      const slug = data.slug || filename.replace('.md', '');
      
      return {
        slug,
        frontmatter: data as BlogPostFrontmatter,
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

// Only run directly when script is executed, not when imported
if (require.main === module) {
  generateBlogData();
}

export default generateBlogData;
