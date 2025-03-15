import fs from 'fs';
import path from 'path';

interface BlogDataEntry {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

// Define constant for the content directory and blog data file path
const CONTENT_DIR = path.resolve(__dirname, '..', 'content');
const BLOG_DATA_PATH = path.join(CONTENT_DIR, 'blogData.json');

// Ensure the content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

/**
 * Repository responsible for fetching blog content
 */
export class BlogRepository {
  private blogData: BlogDataEntry[];

  constructor() {
    // Load pre-processed blog data from JSON at runtime
    try {
      const fileContent = fs.readFileSync(BLOG_DATA_PATH, 'utf-8');
      this.blogData = JSON.parse(fileContent) as BlogDataEntry[];
    } catch (error) {
      console.error('Error loading blog data:', error);
      this.blogData = [];
    }
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
