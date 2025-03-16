
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

  /**
   * Get all entries in a series by series slug
   */
  public getSeriesEntries(seriesSlug: string): { frontmatter: Record<string, any>, content: string, slug: string }[] {
    return this.blogData
      .filter(entry => 
        entry.frontmatter.isSeriesEntry && 
        entry.frontmatter.seriesSlug === seriesSlug
      )
      .map(entry => ({
        slug: entry.slug,
        frontmatter: entry.frontmatter,
        content: entry.content
      }))
      .sort((a, b) => {
        const aNum = a.frontmatter.chapterNumber ?? 999;
        const bNum = b.frontmatter.chapterNumber ?? 999;
        return aNum - bNum;
      });
  }
}
