
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
const CONTENT_DIR = path.join(__dirname, '../data');
const OUTPUT_FILE = path.join(__dirname, '../data/json/blogData.json');

// Ensure the data directory exists
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
}

// Process each markdown file
function generateBlogData() {
  try {
    console.log('Generating blog data...');
    const files = fs.readdirSync(CONTENT_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const blogData = markdownFiles.map(filename => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse frontmatter using gray-matter
      // The key fix: Remove leading whitespace/newlines to ensure
      // the frontmatter is correctly recognized
      const cleanedContent = fileContent.trimStart();
      const { data, content } = matter(cleanedContent);

      // Debug info to help diagnose parsing issues
      console.log(`Parsed ${filename}:`, { 
        frontmatterKeys: Object.keys(data),
        hasContent: !!content,
        frontmatterSize: JSON.stringify(data).length
      });

      // Extract slug from filename if not provided in frontmatter
      const slug = data.slug || filename.replace('.md', '');

      return {
        slug,
        frontmatter: data,
        content
      };
    });

    // Process series relationships
    const seriesMap = new Map();
    
    // Group posts by series
    blogData.forEach(post => {
      if (post.frontmatter.isSeriesEntry && post.frontmatter.seriesSlug) {
        if (!seriesMap.has(post.frontmatter.seriesSlug)) {
          seriesMap.set(post.frontmatter.seriesSlug, []);
        }
        seriesMap.get(post.frontmatter.seriesSlug).push(post);
      }
    });
    
    // Process each series to set up prev/next links
    seriesMap.forEach(seriesEntries => {
      // Sort by chapter number
      seriesEntries.sort((a, b) => {
        const aNum = a.frontmatter.chapterNumber ?? 999;
        const bNum = b.frontmatter.chapterNumber ?? 999;
        return aNum - bNum;
      });
      
      // Add prev/next chapter links
      seriesEntries.forEach((post, index) => {
        if (index > 0) {
          post.frontmatter.previousChapter = seriesEntries[index - 1].slug;
          post.frontmatter.previousChapterTitle = seriesEntries[index - 1].frontmatter.chapterTitle 
            || seriesEntries[index - 1].frontmatter.title;
        }
        
        if (index < seriesEntries.length - 1) {
          post.frontmatter.nextChapter = seriesEntries[index + 1].slug;
          post.frontmatter.nextChapterTitle = seriesEntries[index + 1].frontmatter.chapterTitle 
            || seriesEntries[index + 1].frontmatter.title;
        }
      });
    });

    // Sort posts by date (newest first)
    blogData.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();

      return dateB - dateA; // Descending order (latest posts first)
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
