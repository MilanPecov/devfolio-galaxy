
import { BlogRepository } from '@/apps/blog/repository/BlogRepository';
import { BlogPost } from "@/apps/blog";
import { createBlogPostContent, getIconComponent } from "@/apps/blog/utils";

/**
 * Main service for handling blog operations
 */
export class BlogService {
  private repository: BlogRepository;

  constructor(repository: BlogRepository) {
    this.repository = repository;
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
        icon: getIconComponent(frontmatter.icon || 'Code', frontmatter.iconColor || 'blue'),
        content: createBlogPostContent(content || '')
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
      
      // Filter out any null results and sort by date (newest first)
      const validPosts = posts
        .filter((post): post is BlogPost => post !== null)
        .sort((a, b) => {
          // Use a safer date comparison approach
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          // Handle invalid dates by using timestamp comparison
          const timeA = isNaN(dateA.getTime()) ? 0 : dateA.getTime();
          const timeB = isNaN(dateB.getTime()) ? 0 : dateB.getTime();
          
          return timeB - timeA;
        });
      
      return validPosts;
    } catch (error) {
      console.error('Failed to load all blog posts', error);
      return [];
    }
  }
}
