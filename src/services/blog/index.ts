
import { BlogRepository } from './repository/BlogRepository';
import { BlogService } from './services/BlogService';
import { MarkdownService } from './services/MarkdownService';
import { BlogPost, BlogPostFrontmatter } from './domain/BlogPost';

// Create instances of our services
const blogRepository = new BlogRepository();
const blogService = new BlogService(blogRepository);
const markdownService = new MarkdownService();

// Export domain models
export type { BlogPost, BlogPostFrontmatter };

// Export functions with the same signatures as before for backward compatibility
export const loadBlogPost = (slug: string) => blogService.loadBlogPost(slug);
export const loadAllBlogPosts = () => blogService.loadAllBlogPosts();
export const parseMarkdownToHtml = (markdown: string) => markdownService.parseMarkdownToHtml(markdown);

// Export the service instances for direct usage
export { blogService, markdownService, blogRepository };
