
// This file is kept for reference, but its functionality is now handled at build time
// by the generateBlogData.ts script, so we no longer need the frontmatter parser in the browser

import { BlogPostFrontmatter } from '../domain/BlogPost';

interface ParsedFrontmatter {
  data: BlogPostFrontmatter;
  content: string;
}

/**
 * This function is no longer used in the browser.
 * It's kept for compatibility but will log a warning if called.
 */
export const parseFrontmatter = (content: string): ParsedFrontmatter => {
  console.warn('parseFrontmatter() is deprecated - blog data is now pre-processed at build time');
  
  // Return a simple object with minimal parsing to avoid using Buffer
  const emptyData: BlogPostFrontmatter = {};
  return { data: emptyData, content };
};
