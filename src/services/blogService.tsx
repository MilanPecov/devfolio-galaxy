
import { Database, Server, Code } from 'lucide-react';
import React from 'react';
import { marked } from 'marked';
import matter from 'gray-matter';
// Import Buffer from the buffer package (already installed)
import { Buffer } from 'buffer';

// Make Buffer available globally for gray-matter
// This fixes the "Buffer is not defined" error in the browser
window.Buffer = Buffer;

// Define blog post types
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  categories: string[];
  icon: React.ReactNode;
  content?: string;
  hasChapters?: boolean;
}

// Define chapter types
export interface Chapter {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface ChapterInfo {
  id: string;
  title: string;
  order: number;
  totalChapters: number;
  allChapters: Chapter[];
}

// Function to get icon component based on name from frontmatter
const getIconComponent = (iconName: string, colorClass: string = 'blue'): React.ReactNode => {
  switch (iconName) {
    case 'Database':
      return <Database className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Server':
      return <Server className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Code':
      return <Code className={`w-6 h-6 text-${colorClass}-600`} />;
    default:
      return <Code className="w-6 h-6 text-blue-600" />;
  }
};

// Get a list of all available blog posts
const getBlogSlugs = (): string[] => {
  return [
    'evolving-postgresql-without-breaking-things',
    'building-high-performance-ticketing-systems',
    'event-driven-architecture-in-practice'
  ];
};

// Helper function to dynamically import blog post content
const importBlogContent = async (slug: string, chapter?: string): Promise<string> => {
  try {
    if (chapter) {
      // Import specific chapter content
      return (await import(`../content/blog/${slug}/chapters/${chapter}.md?raw`)).default;
    } else {
      // Try to import index content for posts with chapters
      try {
        return (await import(`../content/blog/${slug}/index.md?raw`)).default;
      } catch (e) {
        // Fallback to traditional single file approach
        return (await import(`../content/blog/${slug}.md?raw`)).default;
      }
    }
  } catch (error) {
    console.error(`Content import error:`, error);
    throw new Error(`Blog content not found`);
  }
};

// Check if a blog post has chapters
const checkForChapters = async (slug: string): Promise<Chapter[]> => {
  try {
    // This would typically involve checking for a chapters directory
    // For now, we'll hardcode for the evolving-postgresql example
    if (slug === 'evolving-postgresql-without-breaking-things') {
      return [
        { id: 'schema-migrations', title: 'Schema Migrations', description: 'Safely evolving your database schema', order: 1 },
        { id: 'zero-downtime', title: 'Zero Downtime Deployments', description: 'Techniques for rolling out changes without interruption', order: 2 },
        { id: 'data-integrity', title: 'Data Integrity', description: 'Ensuring data consistency during migrations', order: 3 }
      ];
    }
    return [];
  } catch (error) {
    console.error('Error checking for chapters:', error);
    return [];
  }
};

// Helper function to load blog post content
export const loadBlogPost = async (slug: string): Promise<{ post: BlogPost | null, chapters: Chapter[] }> => {
  try {
    // Check if this post has chapters
    const chapters = await checkForChapters(slug);
    const hasChapters = chapters.length > 0;
    
    // Dynamically import the blog post content (either index.md or the regular file)
    const fileContents = await importBlogContent(slug);
    
    // Parse frontmatter using gray-matter
    const { data, content } = matter(fileContents);
    
    if (Object.keys(data).length === 0) {
      throw new Error(`Failed to parse frontmatter for ${slug}`);
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
      content: content || '',
      hasChapters
    };
    
    return { post: blogPost, chapters };
  } catch (error) {
    console.error(`Failed to load blog post with slug: ${slug}`, error);
    return { post: null, chapters: [] };
  }
};

// Function to load a specific chapter of a blog post
export const loadBlogChapter = async (slug: string, chapterId: string): Promise<{ post: BlogPost; content: string; chapterInfo: ChapterInfo } | null> => {
  try {
    // First, load the main post data
    const { post, chapters } = await loadBlogPost(slug);
    
    if (!post) {
      throw new Error('Blog post not found');
    }
    
    // Find the chapter info
    const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex === -1) {
      throw new Error('Chapter not found');
    }
    
    // Load the chapter content
    const chapterContent = await importBlogContent(slug, chapterId);
    const { content } = matter(chapterContent);
    
    const chapterInfo: ChapterInfo = {
      ...chapters[chapterIndex],
      totalChapters: chapters.length,
      allChapters: chapters
    };
    
    return {
      post,
      content,
      chapterInfo
    };
    
  } catch (error) {
    console.error(`Failed to load chapter ${chapterId} for post ${slug}:`, error);
    return null;
  }
};

// Function to load all blog posts
export const loadAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const slugs = getBlogSlugs();
    
    const postsPromises = slugs.map(async (slug) => {
      try {
        const { post } = await loadBlogPost(slug);
        return post;
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
};

// Function to parse markdown content to HTML
export const parseMarkdownToHtml = (markdown: string): string => {
  try {
    // Use marked.parse in synchronous mode
    return marked.parse(markdown, {
      gfm: true, // GitHub flavored markdown
      breaks: true, // Convert line breaks to <br>
    }) as string; // Cast to string since we're using the sync version
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p>Error parsing content</p>';
  }
};

