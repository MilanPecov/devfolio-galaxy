
import blogData from '@/apps/blog/data/json/blogData.json';

interface BlogDataEntry {
  slug: string;
  frontmatter: Record<string, any>;
  content: string;
}

/**
 * Repository responsible for fetching blog data
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
   * Get blog data by slug
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

}
