
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

// Custom YAML parser that wraps values with colons in quotes
const customYamlParser = (source) => {
  // Detect the frontmatter section (between --- markers)
  const frontmatterMatch = source.match(/^---\n([\s\S]*?)\n---/);
  
  if (!frontmatterMatch) {
    return { data: {}, content: source };
  }

  try {
    // Extract and preprocess the frontmatter text
    const frontmatterText = frontmatterMatch[1];
    
    // Process the frontmatter text to wrap values containing colons in quotes
    const processedFrontmatter = frontmatterText
      .split('\n')
      .map(line => {
        if (line.trim() === '' || line.startsWith('  ')) {
          return line;
        }
        
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
          const key = line.substring(0, colonIndex).trim();
          let value = line.substring(colonIndex + 1).trim();
          
          // If value contains a colon and is not already quoted, wrap it in quotes
          if (value.includes(':') && !value.startsWith('"') && !value.startsWith("'")) {
            value = `"${value.replace(/"/g, '\\"')}"`;
            return `${key}: ${value}`;
          }
        }
        return line;
      })
      .join('\n');
    
    // Parse the processed frontmatter
    const frontmatterData = yaml.load(processedFrontmatter) || {};
    
    // Get content without frontmatter
    const content = source.replace(frontmatterMatch[0], '').trim();
    
    return {
      data: frontmatterData,
      content
    };
  } catch (err) {
    console.error('Error in custom YAML parser:', err.message);
    return { data: {}, content: source };
  }
};

// Process each markdown file
function generateBlogData() {
  try {
    console.log('Generating blog data...');
    const files = fs.readdirSync(CONTENT_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const blogData = markdownFiles.map(filename => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
      try {
        // Use our custom parser instead of gray-matter's default parser
        const { data: frontmatterData, content } = customYamlParser(fileContent);
        
        // Extract slug from filename if not provided in frontmatter
        const slug = frontmatterData?.slug || filename.replace('.md', '');
        
        console.log(`Processed ${filename} - frontmatter keys:`, 
          frontmatterData ? Object.keys(frontmatterData) : 'none');
        
        // Convert string boolean values to actual booleans
        if (frontmatterData.isSeries === 'true') frontmatterData.isSeries = true;
        if (frontmatterData.isSeriesEntry === 'true') frontmatterData.isSeriesEntry = true;
        
        return {
          slug,
          frontmatter: frontmatterData || {},
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

// Default export for ES modules
export default generateBlogData;

// Also provide a way to run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateBlogData();
}
