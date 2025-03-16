import { BlogRepository } from '@/apps/blog/repository/BlogRepository';
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
      // Get pre-processed blog content from repository
      const blogData = await this.repository.getBlogContent(slug);

      if (!blogData) {
        return null;
      }

      const { frontmatter, content } = blogData;

      if (!frontmatter || Object.keys(frontmatter).length === 0) {
        console.warn(`No frontmatter found for ${slug}`);
      }

      // Map the parsed data to our BlogPost interface with validation
      const blogPost: BlogPost = {
        slug: frontmatter.slug || slug,
        title: frontmatter.title || 'Untitled Post',
        excerpt: frontmatter.excerpt || 'No excerpt available',
        date: frontmatter.date || 'No date',
        readTime: frontmatter.readTime || '5 min read',
        categories: Array.isArray(frontmatter.categories) ? frontmatter.categories : [],
        icon: this.iconService.getIcon(frontmatter.icon || 'Code', frontmatter.iconColor || 'blue'),
        content: this.contentProcessor.processContent(content || '') // Use instance method
      };

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

      return posts;
    } catch (error) {
      console.error('Failed to load all blog posts', error);
      return [];
    }
  }
}
