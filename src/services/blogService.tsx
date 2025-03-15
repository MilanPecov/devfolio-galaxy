
import { Database, Server, Code, BookText, Layout, BarChart, Key, RefreshCw, Eye, BookOpen } from 'lucide-react';
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
    case 'BookText':
      return <BookText className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Layout':
      return <Layout className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'BarChart':
      return <BarChart className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Key':
      return <Key className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'RefreshCw':
      return <RefreshCw className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'Eye':
      return <Eye className={`w-6 h-6 text-${colorClass}-600`} />;
    case 'BookOpen':
      return <BookOpen className={`w-6 h-6 text-${colorClass}-600`} />;
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

// Mock chapter data for Evolving PostgreSQL blog post
const getPostgresChapters = (): Chapter[] => {
  return [
    { id: 'introduction', title: 'Introduction', description: 'An overview of database evolution challenges', order: 1 },
    { id: 'prologue', title: 'Prologue: The Immutable and the Changing', description: 'Setting the stage for database evolution', order: 2 },
    { id: 'chapter-1', title: 'Chapter 1: The Price of Order', description: 'Understanding the costs of maintaining order in databases', order: 3 },
    { id: 'chapter-2', title: 'Chapter 2: Parallel Evolution – Creating Indexes Concurrently', description: 'Techniques for creating indexes without downtime', order: 4 },
    { id: 'chapter-3', title: 'Chapter 3: The Challenge of Foreign Keys', description: 'Managing relational integrity during schema changes', order: 5 },
    { id: 'chapter-4', title: 'Chapter 4: The Burden of Bloat – Using pg_repack', description: 'Dealing with table bloat and reclaiming space', order: 6 },
    { id: 'chapter-5', title: 'Chapter 5: Observing Migrations in Production', description: 'Monitoring and observability for database migrations', order: 7 },
    { id: 'final-thoughts', title: 'Final Thoughts', description: 'Reflections on maintaining evolving databases', order: 8 }
  ];
};

// Helper function to dynamically import blog post content
const importBlogContent = async (slug: string, chapter?: string): Promise<string> => {
  try {
    // Mock content for chapters that don't exist yet
    // In a real application, this would be replaced with actual file imports
    if (slug === 'evolving-postgresql-without-breaking-things' && chapter) {
      // Return mock content for the specific chapter
      return `---
title: ${chapter === 'introduction' ? 'Introduction' : 
        chapter === 'prologue' ? 'Prologue: The Immutable and the Changing' :
        chapter === 'chapter-1' ? 'Chapter 1: The Price of Order' :
        chapter === 'chapter-2' ? 'Chapter 2: Parallel Evolution – Creating Indexes Concurrently' :
        chapter === 'chapter-3' ? 'Chapter 3: The Challenge of Foreign Keys' :
        chapter === 'chapter-4' ? 'Chapter 4: The Burden of Bloat – Using pg_repack' :
        chapter === 'chapter-5' ? 'Chapter 5: Observing Migrations in Production' :
        chapter === 'final-thoughts' ? 'Final Thoughts' : 'Unknown Chapter'}
---

# ${chapter === 'introduction' ? 'Introduction' : 
        chapter === 'prologue' ? 'Prologue: The Immutable and the Changing' :
        chapter === 'chapter-1' ? 'Chapter 1: The Price of Order' :
        chapter === 'chapter-2' ? 'Chapter 2: Parallel Evolution – Creating Indexes Concurrently' :
        chapter === 'chapter-3' ? 'Chapter 3: The Challenge of Foreign Keys' :
        chapter === 'chapter-4' ? 'Chapter 4: The Burden of Bloat – Using pg_repack' :
        chapter === 'chapter-5' ? 'Chapter 5: Observing Migrations in Production' :
        chapter === 'final-thoughts' ? 'Final Thoughts' : 'Unknown Chapter'}

This is placeholder content for the chapter *${chapter}*. 

## Sample Section

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies ultricies, nunc nisl ultricies nunc, quis ultricies nisl nisl eget ultricies ultricies.

## Another Section

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## Code Example

\`\`\`sql
-- Sample SQL for schema migration
ALTER TABLE users 
ADD COLUMN email VARCHAR(255);

-- Create index concurrently to avoid locking
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
\`\`\`

In conclusion, this chapter explains important concepts about database evolution and schema management.
`;
    }
    
    // Try to import traditional single file approach for non-chapter posts
    // or for the main post page of a chaptered post
    if (!chapter) {
      try {
        return (await import(`../content/blog/${slug}.md?raw`)).default;
      } catch (e) {
        console.error(`Failed to import ${slug}.md:`, e);
        // For evolving-postgresql, generate a mock index page
        if (slug === 'evolving-postgresql-without-breaking-things') {
          return `---
slug: evolving-postgresql-without-breaking-things
title: Evolving PostgreSQL Without Breaking the World
excerpt: Techniques and strategies for safely evolving PostgreSQL schemas in production environments.
date: 2024-04-20
readTime: 15 min read
categories: [Database, PostgreSQL, DevOps]
icon: Database
iconColor: blue
---

# Evolving PostgreSQL Without Breaking the World

Database schemas inevitably need to evolve as applications grow and change. This multi-part guide explores techniques for safely evolving PostgreSQL schemas in production environments without causing downtime or data integrity issues.

## About This Series

This series covers various aspects of PostgreSQL schema evolution, from basic concepts to advanced techniques. Each chapter focuses on a specific challenge or approach:

- Introduction - Setting the stage
- Prologue: The Immutable and the Changing
- Chapter 1: The Price of Order
- Chapter 2: Parallel Evolution – Creating Indexes Concurrently
- Chapter 3: The Challenge of Foreign Keys
- Chapter 4: The Burden of Bloat – Using pg_repack
- Chapter 5: Observing Migrations in Production
- Final Thoughts

Choose a chapter to begin your journey into safe PostgreSQL evolution.
`;
        }
        
        throw new Error(`Blog content not found`);
      }
    }
    
    // We should never reach here for now as we're using mock data
    throw new Error(`Blog content not found for chapter: ${chapter}`);
  } catch (error) {
    console.error(`Content import error:`, error);
    throw new Error(`Blog content not found`);
  }
};

// Check if a blog post has chapters
const checkForChapters = async (slug: string): Promise<Chapter[]> => {
  try {
    // This would typically involve checking for a chapters directory
    // For now, we're using hard-coded chapters for the evolving-postgresql example
    if (slug === 'evolving-postgresql-without-breaking-things') {
      return getPostgresChapters();
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
    
    // Dynamically import the blog post content
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
