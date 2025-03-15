
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

// Get chapters for a blog post
const getChapters = async (slug: string): Promise<Chapter[]> => {
  try {
    // For evolving-postgresql, we now use the actual chapter files
    if (slug === 'evolving-postgresql-without-breaking-things') {
      const chapterFiles = [
        { id: 'introduction', path: 'introduction.md' },
        { id: 'prologue', path: 'prologue.md' },
        { id: 'chapter-1', path: 'chapter-1.md' },
        { id: 'chapter-2', path: 'chapter-2.md' },
        { id: 'chapter-3', path: 'chapter-3.md' },
        { id: 'chapter-4', path: 'chapter-4.md' },
        { id: 'chapter-5', path: 'chapter-5.md' },
        { id: 'final-thoughts', path: 'final-thoughts.md' }
      ];
      
      // Read and parse each chapter file
      const chaptersPromises = chapterFiles.map(async (chapterFile) => {
        try {
          // Try to dynamically import the chapter file
          const fileContents = await importChapterContent(slug, chapterFile.id);
          const { data } = matter(fileContents);
          
          return {
            id: chapterFile.id,
            title: data.title || chapterFile.id,
            description: data.description || '',
            order: data.order || 0
          };
        } catch (error) {
          console.error(`Failed to load chapter ${chapterFile.id}:`, error);
          // Fallback for missing files
          return {
            id: chapterFile.id,
            title: chapterFile.id.charAt(0).toUpperCase() + chapterFile.id.slice(1).replace(/-/g, ' '),
            description: '',
            order: 0
          };
        }
      });
      
      const chapters = await Promise.all(chaptersPromises);
      
      // Sort chapters by order
      return chapters.sort((a, b) => a.order - b.order);
    }
    
    // For other posts, return empty array (no chapters)
    return [];
  } catch (error) {
    console.error('Error loading chapters:', error);
    return [];
  }
};

// Helper function to dynamically import chapter content
const importChapterContent = async (slug: string, chapterId: string): Promise<string> => {
  try {
    // Try to dynamically import the chapter file
    // In a real-world app, this would import from the filesystem
    // For this example, we'll use mock content
    return `---
title: ${chapterId === 'introduction' ? 'Introduction' : 
        chapterId === 'prologue' ? 'Prologue: The Immutable and the Changing' :
        chapterId === 'chapter-1' ? 'Chapter 1: The Price of Order' :
        chapterId === 'chapter-2' ? 'Chapter 2: Parallel Evolution – Creating Indexes Concurrently' :
        chapterId === 'chapter-3' ? 'Chapter 3: The Challenge of Foreign Keys' :
        chapterId === 'chapter-4' ? 'Chapter 4: The Burden of Bloat – Using pg_repack' :
        chapterId === 'chapter-5' ? 'Chapter 5: Observing Migrations in Production' :
        chapterId === 'final-thoughts' ? 'Final Thoughts' : 'Unknown Chapter'}
order: ${chapterId === 'introduction' ? 1 : 
        chapterId === 'prologue' ? 2 :
        chapterId === 'chapter-1' ? 3 :
        chapterId === 'chapter-2' ? 4 :
        chapterId === 'chapter-3' ? 5 :
        chapterId === 'chapter-4' ? 6 :
        chapterId === 'chapter-5' ? 7 :
        chapterId === 'final-thoughts' ? 8 : 0}
---

# ${chapterId === 'introduction' ? 'Introduction' : 
        chapterId === 'prologue' ? 'Prologue: The Immutable and the Changing' :
        chapterId === 'chapter-1' ? 'Chapter 1: The Price of Order' :
        chapterId === 'chapter-2' ? 'Chapter 2: Parallel Evolution – Creating Indexes Concurrently' :
        chapterId === 'chapter-3' ? 'Chapter 3: The Challenge of Foreign Keys' :
        chapterId === 'chapter-4' ? 'Chapter 4: The Burden of Bloat – Using pg_repack' :
        chapterId === 'chapter-5' ? 'Chapter 5: Observing Migrations in Production' :
        chapterId === 'final-thoughts' ? 'Final Thoughts' : 'Unknown Chapter'}

${chapterId === 'introduction' ? 'To change a database is to change the world in miniature. It is an act of transformation, of restructuring something vast and interconnected while it continues to pulse with life. The database does not pause for us; it does not yield easily to our aspirations. Its architecture is built on the principles of order, consistency, and unbreakable rules. And yet, we must change it, we must move forward—without halting time itself.' : 
  chapterId === 'prologue' ? 'It began with a simple requirement: enforce uniqueness on the `email` field in our `users` table. A trivial change, or so we thought.' : 
  chapterId === 'chapter-1' ? 'PostgreSQL enforces its rules through a formidable mechanism: the **AccessExclusiveLock**. When modifying a table\'s schema, the database halts operations, preventing all writes, reads, and transactions until the change is complete.' : 
  chapterId === 'chapter-2' ? 'In 2001, PostgreSQL introduced a new approach: **concurrent indexing**. Instead of freezing the system while building an index, it constructs it in the background.' : 
  chapterId === 'chapter-3' ? 'Foreign keys are another enforcer of order, ensuring referential integrity. But adding them retroactively to an existing table can be devastating.' : 
  chapterId === 'chapter-4' ? 'Time leaves its mark on a database. It grows, shifts, and accumulates inefficiencies—wasted space from deleted rows, fragmented data pages, indexes that no longer fit neatly within memory.' : 
  chapterId === 'chapter-5' ? 'In the realm of databases, visibility is survival. To migrate a system while it is alive—to change it without stopping its pulse—we must see everything.' : 
  chapterId === 'final-thoughts' ? 'PostgreSQL does not resist change—it resists careless change. By understanding its mechanisms, we find ways to move forward while preserving the system\'s integrity. We do not break its rules; we learn to work within them.' : 
  'Placeholder content for this chapter.'}`;
  } catch (error) {
    console.error(`Error importing chapter content for ${slug}/${chapterId}:`, error);
    throw new Error(`Chapter content not found for ${chapterId}`);
  }
};

// Helper function to dynamically import blog post content
const importBlogContent = async (slug: string): Promise<string> => {
  try {
    // For evolving-postgresql, use the index.md file
    if (slug === 'evolving-postgresql-without-breaking-things') {
      return `---
slug: evolving-postgresql-without-breaking-things
title: Evolving PostgreSQL Without Breaking the World
excerpt: PostgreSQL is built for integrity, but applications demand agility. How do you evolve a live database without halting the system? This guide explores zero-downtime migration techniques—concurrent indexing, safe foreign keys, and schema changes that preserve uptime.
date: March 15, 2024
readTime: 40 min read
categories:
  - Database
  - PostgreSQL
  - DevOps
  - Django
icon: Database
iconColor: blue
---

# Evolving PostgreSQL Without Breaking the World

PostgreSQL is built for integrity, but applications demand agility. How do you evolve a live database without halting the system? This guide explores zero-downtime migration techniques—concurrent indexing, safe foreign keys, and schema changes that preserve uptime.

This multi-part guide breaks down the challenges and solutions for evolving PostgreSQL schemas safely in production environments. Each chapter focuses on a specific aspect of database evolution, providing practical techniques to implement changes without disrupting service.`;
    }
    
    // For other posts, try to import their .md files
    try {
      return (await import(`../content/blog/${slug}.md?raw`)).default;
    } catch (e) {
      console.error(`Failed to import ${slug}.md:`, e);
      throw new Error(`Blog content not found`);
    }
  } catch (error) {
    console.error(`Content import error for ${slug}:`, error);
    throw new Error(`Blog content not found`);
  }
};

// Helper function to load blog post content
export const loadBlogPost = async (slug: string): Promise<{ post: BlogPost | null, chapters: Chapter[] }> => {
  try {
    // Check if this post has chapters
    const chapters = await getChapters(slug);
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
    const chapterContent = await importChapterContent(slug, chapterId);
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
