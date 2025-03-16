
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

  /**
   * Get the main series post (the one with isSeries: true)
   */
  public getSeriesMainPost(seriesSlug: string): { frontmatter: Record<string, any>, content: string, slug: string } | null {
    return this.blogData.find(entry => 
      entry.frontmatter.isSeries && 
      entry.frontmatter.seriesSlug === seriesSlug
    ) || null;
  }

  /**
   * Check if a post is part of a series
   */
  public isPartOfSeries(slug: string): boolean {
    const entry = this.blogData.find(entry => entry.slug === slug);
    return entry ? 
      (entry.frontmatter.isSeries || entry.frontmatter.isSeriesEntry) : 
      false;
  }

  /**
   * Get the series slug for a post (if it's part of a series)
   */
  public getSeriesSlugForPost(slug: string): string | null {
    const entry = this.blogData.find(entry => entry.slug === slug);
    return entry ? entry.frontmatter.seriesSlug || null : null;
  }

  /**
   * Get all series in the blog (main series posts only)
   */
  public getAllSeries(): { slug: string, frontmatter: Record<string, any> }[] {
    return this.blogData
      .filter(entry => entry.frontmatter.isSeries)
      .map(entry => ({
        slug: entry.slug,
        frontmatter: entry.frontmatter
      }));
  }

  /**
   * Get the total number of chapters in a series
   */
  public getSeriesChapterCount(seriesSlug: string): number {
    return this.getSeriesEntries(seriesSlug).length;
  }
}
