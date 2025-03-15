
import blogData from '../content/json/blogData.json';

interface BlogDataEntry {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * Repository responsible for fetching blog content
 */
export class BlogRepository {
  private blogData: BlogDataEntry[];

  constructor() {
    // Load pre-processed blog data from JSON
    this.blogData = blogData as BlogDataEntry[];
  }

  /**
   * Get a list of all available blog post slugs
   */
  public getBlogSlugs(): string[] {
    return this.blogData.map(entry => entry.slug);
  }

  /**
   * Get blog content by slug
   */
  public async getBlogContent(slug: string): Promise<{ frontmatter: Record<string, any>, content: string } | null> {
    const entry = this.blogData.find(entry => entry.slug === slug);
    
    if (!entry) {
      console.error(`Blog post with slug: ${slug} not found`);
      return null;
    }
    
    return {
      frontmatter: entry.frontmatter,
      content: entry.content
    };
  }

  /**
   * This method remains for backward compatibility but uses the pre-processed data
   */
  public async importBlogContent(slug: string): Promise<string> {
    const entry = await this.getBlogContent(slug);
    
    if (!entry) {
      throw new Error(`Blog post with slug: ${slug} not found`);
    }
    
    // Recreate a markdown-like string with frontmatter for compatibility
    const frontmatterStr = '---\n' + 
      Object.entries(entry.frontmatter)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}:\n${value.map(item => `  - ${item}`).join('\n')}`;
          }
          return `${key}: ${value}`;
        })
        .join('\n') + 
      '\n---\n';
    
    return frontmatterStr + entry.content;
  }
}
