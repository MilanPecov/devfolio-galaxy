
import matter from 'gray-matter';
import { BlogPostFrontmatter } from '../domain/BlogPost';

interface ParsedFrontmatter {
  data: BlogPostFrontmatter;
  content: string;
}

/**
 * Parses markdown frontmatter using gray-matter with fallback to manual extraction
 */
export const parseFrontmatter = (content: string): ParsedFrontmatter => {
  if (!content) {
    return { data: {}, content: '' };
  }

  try {
    // First attempt: use gray-matter (more robust)
    const parsed = matter(content);
    return {
      data: parsed.data as BlogPostFrontmatter,
      content: parsed.content
    };
  } catch (error) {
    console.error('Error using gray-matter for frontmatter parsing:', error);
    
    // Second attempt: manual extraction as fallback
    if (content.startsWith('---')) {
      const endOfFrontmatter = content.indexOf('---', 3);
      
      if (endOfFrontmatter !== -1) {
        const frontmatterBlock = content.substring(3, endOfFrontmatter).trim();
        const mainContent = content.substring(endOfFrontmatter + 3).trim();
        
        // Parse frontmatter using manual approach
        const data: Record<string, any> = {};
        const lines = frontmatterBlock.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;
          
          const colonIndex = trimmedLine.indexOf(':');
          if (colonIndex > 0) {
            const key = trimmedLine.substring(0, colonIndex).trim();
            const value = trimmedLine.substring(colonIndex + 1).trim();
            
            // Handle arrays (assuming YAML-like format)
            if (value === '') {
              // This might be the start of an array
              const arrayKey = key;
              const arrayItems: string[] = [];
              
              // Look ahead for array items in subsequent lines
              const arrayItemPrefix = '- ';
              const nextLineIndex = lines.indexOf(line) + 1;
              
              for (let i = nextLineIndex; i < lines.length; i++) {
                const nextLine = lines[i].trim();
                if (nextLine.startsWith(arrayItemPrefix)) {
                  arrayItems.push(nextLine.substring(arrayItemPrefix.length).trim());
                } else if (nextLine.includes(':')) {
                  // We've reached a new key-value pair
                  break;
                }
              }
              
              if (arrayItems.length > 0) {
                data[arrayKey] = arrayItems;
              }
            } else {
              // Handle simple key-value
              data[key] = value;
            }
          }
        }
        
        return { data, content: mainContent };
      }
    }
    
    // If all parsing fails, return empty data with the original content
    console.warn('Frontmatter parsing failed completely, returning original content');
    return { data: {}, content };
  }
};
