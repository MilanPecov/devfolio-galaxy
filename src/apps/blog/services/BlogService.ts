import { BlogRepository } from '../repository/BlogRepository';

import { BlogPost } from "@/apps/blog";
import { createBlogPostContent, getIconComponent, parseFrontmatter } from "@/apps/blog/utils";


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
      // Dynamically import the blog post content
      const fileContents = await this.repository.importBlogContent(slug);
      
      // Parse frontmatter
      const { data, content } = parseFrontmatter(fileContents);
      
      if (!data || Object.keys(data).length === 0) {
        console.warn(`No frontmatter found for ${slug}`);
      }
      
      // Map the parsed data to our BlogPost interface with validation
      const blogPost: BlogPost = {
        slug: data.slug || slug,
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || 'No excerpt available',
        date: data.date || 'No date',
        readTime: data.readTime || '5 min read',
        categories: Array.isArray(data.categories) ? data.categories : [],
        icon: getIconComponent(data.icon || 'Code', data.iconColor || 'blue'),
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
