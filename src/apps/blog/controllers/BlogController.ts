
import { BlogRepository } from '@/apps/blog/domain/repositories/BlogRepository';
import { BlogPost } from "@/apps/blog";
import { ContentProcessorService } from "@/apps/blog/domain/services/ContentProcessorService.tsx";
import { IconService } from "@/apps/blog/domain/services/IconService.ts";

/**
 * Main service for handling blog operations
 */
export class BlogController {
  private repository: BlogRepository;
  private contentProcessor: ContentProcessorService;
  private iconService: IconService;

  constructor(repository: BlogRepository) {
    this.repository = repository;
    this.contentProcessor = new ContentProcessorService();
    this.iconService = new IconService()
  }

  /**
   * Load a specific blog post by slug
   */
  public async loadBlogPost(slug: string): Promise<BlogPost | null> {
    try {
      // Get pre-processed blog data from repositories
      const blogData = await this.repository.getBlogContent(slug);

      if (!blogData) {
        return null;
      }

      const { frontmatter, content } = blogData;

      if (!frontmatter || Object.keys(frontmatter).length === 0) {
        console.warn(`No frontmatter found for ${slug}`);
      }

      // Convert string "true"/"false" to actual boolean values
      const isSeries = frontmatter.isSeries === true || frontmatter.isSeries === "true";
      const isSeriesEntry = frontmatter.isSeriesEntry === true || frontmatter.isSeriesEntry === "true";

      // Map the parsed data to our BlogPost interface with validation
      const blogPost: BlogPost = {
        slug: frontmatter.slug || slug,
        title: frontmatter.title || 'Untitled Post',
        excerpt: frontmatter.excerpt || 'No excerpt available',
        date: frontmatter.date || 'No date',
        readTime: frontmatter.readTime || '5 min read',
        categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [],
        icon: this.iconService.getIcon(frontmatter.icon || 'Code', frontmatter.iconColor || 'blue'),
        content: this.contentProcessor.processContent(content || ''),
        
        // Series-related properties using the converted boolean values
        isSeries,
        isSeriesEntry,
        seriesSlug: frontmatter.seriesSlug,
        seriesTitle: frontmatter.seriesTitle,
        chapterTitle: frontmatter.chapterTitle,
        chapterNumber: frontmatter.chapterNumber,
      };

      // Add navigation for series entries
      if (blogPost.isSeriesEntry && (frontmatter.previousChapter || frontmatter.nextChapter)) {
        if (frontmatter.previousChapter) {
          blogPost.previousChapter = {
            slug: frontmatter.previousChapter,
            title: frontmatter.previousChapterTitle || 'Previous Chapter',
          };
        }

        if (frontmatter.nextChapter) {
          blogPost.nextChapter = {
            slug: frontmatter.nextChapter,
            title: frontmatter.nextChapterTitle || 'Next Chapter',
          };
        }
      }

      return blogPost;
    } catch (error) {
      console.error(`Failed to load blog post with slug: ${slug}`, error);
      return null;
    }
  }

  /**
   * Load all available blog posts
   */
  public async loadAllBlogPosts(): Promise<BlogPost[]> {
    try {
      const slugs = this.repository.getBlogSlugs();
      
      const postsPromises = slugs.map(async (slug) => {
        try {
          return await this.loadBlogPost(slug);
        } catch (error) {
          console.error(`Error loading post ${slug}:`, error);
          return null;
        }
      });
      
      const posts = await Promise.all(postsPromises);
      
      // Filter out null values and sort by date (newest first)
      const validPosts = posts.filter(Boolean) as BlogPost[];
      
      return validPosts;
    } catch (error) {
      console.error('Failed to load all blog posts', error);
      return [];
    }
  }

  /**
   * Get all chapters in a series by seriesSlug
   */
  public async getSeriesChapters(seriesSlug: string): Promise<BlogPost[]> {
    try {
      const seriesEntries = this.repository.getSeriesEntries(seriesSlug);
      
      // Convert each entry to a BlogPost
      const chaptersPromises = seriesEntries.map(async entry => {
        return this.loadBlogPost(entry.slug);
      });
      
      const chapters = await Promise.all(chaptersPromises);
      
      // Filter out null values and ensure proper sorting by chapter number
      const validChapters = chapters.filter(Boolean) as BlogPost[];
      return validChapters.sort((a, b) => {
        const aNum = a.chapterNumber ?? 999;
        const bNum = b.chapterNumber ?? 999;
        return aNum - bNum;
      });
    } catch (error) {
      console.error(`Failed to load chapters for series: ${seriesSlug}`, error);
      return [];
    }
  }
  
  /**
   * Get main series post and all its chapters
   */
  public async getFullSeries(seriesSlug: string): Promise<{
    main: BlogPost | null,
    chapters: BlogPost[]
  }> {
    try {
      // First get the main series post
      const allPosts = await this.loadAllBlogPosts();
      const mainPost = allPosts.find(post => post.isSeries && post.seriesSlug === seriesSlug) || null;
      
      // Then get all chapters
      const chapters = await this.getSeriesChapters(seriesSlug);
      
      return {
        main: mainPost,
        chapters
      };
    } catch (error) {
      console.error(`Failed to load full series: ${seriesSlug}`, error);
      return {
        main: null,
        chapters: []
      };
    }
  }
}
