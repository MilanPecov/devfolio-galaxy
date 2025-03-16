
import { BlogRepository } from '@/apps/blog/domain/repositories/BlogRepository';
import { BlogController } from '@/apps/blog/controllers/BlogController.ts';
import { BlogPost, BlogPostFrontmatter } from 'src/apps/blog/domain/entities/BlogPost.ts';

// Export domain models
export type { BlogPost, BlogPostFrontmatter };

// Export controllers service
const blogRepository = new BlogRepository();
const blogController = new BlogController(blogRepository);

export { blogController };
