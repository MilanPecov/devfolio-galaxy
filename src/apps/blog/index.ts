
import { BlogRepository } from './repository/BlogRepository';
import { BlogController } from '@/apps/blog/application/BlogController.ts';
import { BlogPost, BlogPostFrontmatter } from './domain/BlogPost';

// Export domain models
export type { BlogPost, BlogPostFrontmatter };

// Export application service
const blogRepository = new BlogRepository();
const blogController = new BlogController(blogRepository);

export { blogController };
