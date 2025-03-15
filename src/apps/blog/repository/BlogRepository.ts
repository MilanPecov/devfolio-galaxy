
/**
 * Repository responsible for fetching blog content
 */
export class BlogRepository {
  /**
   * Get a list of all available blog post slugs
   */
  public getBlogSlugs(): string[] {
    return [
      'evolving-postgresql-without-breaking-things',
      'building-high-performance-ticketing-systems',
      'event-driven-architecture-in-practice'
    ];
  }

  /**
   * Import blog content from markdown files
   */
  public async importBlogContent(slug: string): Promise<string> {
    try {
      return (await import(`../content/${slug}.md?raw`)).default;
    } catch (error) {
      console.error(`Failed to import blog content for slug: ${slug}`, error);
      throw new Error(`Blog post with slug: ${slug} not found`);
    }
  }
}
