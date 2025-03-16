
// JavaScript version of generateBlogData
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import yaml from 'js-yaml';  // Import yaml properly as ES module

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

// Process each markdown file and build the blog data
function generateBlogData() {
  try {
    console.log('Generating blog data...');
    const files = fs.readdirSync(CONTENT_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const blogData = markdownFiles.map(filename => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      try {
        // Extract frontmatter and content from markdown
        const { frontmatter, content } = extractFrontmatterAndContent(fileContent);
        
        // Extract slug from filename if not provided in frontmatter
        const slug = frontmatter?.slug || filename.replace('.md', '');
        
        console.log(`Processed ${filename} - frontmatter keys:`, 
          frontmatter ? Object.keys(frontmatter) : 'none');
        
        // Ensure boolean types are correctly parsed
        const processedFrontmatter = processFrontmatterBooleans(frontmatter || {});
        
        return {
          slug,
          frontmatter: processedFrontmatter,
          content
        };
      } catch (err) {
        console.error(`Error processing ${filename}:`, err);
        return {
          slug: filename.replace('.md', ''),
          frontmatter: {},
          content: fileContent
        };
      }
    });

    // Process series relationships for chapter navigation
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
      const dateA = new Date(a.frontmatter.date || '2000-01-01').getTime();
      const dateB = new Date(b.frontmatter.date || '2000-01-01').getTime();

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

// Helper function to extract frontmatter and content
function extractFrontmatterAndContent(fileContent) {
  // Check if the file starts with a frontmatter section
  if (!fileContent.startsWith('---\n')) {
    return { frontmatter: {}, content: fileContent };
  }

  // Find the end of the frontmatter section
  const endOfFrontmatter = fileContent.indexOf('---\n', 4);
  if (endOfFrontmatter === -1) {
    return { frontmatter: {}, content: fileContent };
  }

  // Extract frontmatter string
  const frontmatterStr = fileContent.substring(4, endOfFrontmatter);
  
  // Extract content
  const content = fileContent.substring(endOfFrontmatter + 4).trim();

  // Parse frontmatter
  try {
    // Process the frontmatter to handle colons in titles
    const processed = frontmatterStr
      .split('\n')
      .map(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          // If value contains a colon and is not already quoted, wrap it in quotes
          if (value.includes(':') && !value.startsWith('"') && !value.startsWith("'")) {
            // Replace any existing double quotes first
            value = value.replace(/"/g, '\\"');
            return `${key}: "${value}"`;
          }
        }
        return line;
      })
      .join('\n');
      
    // Now parse with yaml
    const frontmatter = yaml.load(processed) || {};
    return { frontmatter, content };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return { frontmatter: {}, content };
  }
}

// Helper function to process boolean values in frontmatter
function processFrontmatterBooleans(frontmatter) {
  const result = { ...frontmatter };
  
  // Convert string booleans to actual booleans
  if (result.isSeries === 'true') result.isSeries = true;
  else if (result.isSeries === 'false') result.isSeries = false;
  
  if (result.isSeriesEntry === 'true') result.isSeriesEntry = true;
  else if (result.isSeriesEntry === 'false') result.isSeriesEntry = false;
  
  return result;
}

// Default export for ES modules
export default generateBlogData;

// Also provide a way to run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBlogData();
}
