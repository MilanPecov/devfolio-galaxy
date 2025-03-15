
import matter from 'gray-matter';
import { marked } from 'marked';
import { Database, Server, Code } from 'lucide-react';
import React from 'react';
import { Buffer } from 'buffer';

// Explicitly set Buffer on window for gray-matter
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

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

// Helper function to load blog post content
export const loadBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    // In a real application, this would fetch from an API or file system
    // For this demo, we're importing directly
    let fileContents;
    
    // Use a switch statement to manually handle each blog post file
    switch (slug) {
      case 'evolving-postgresql-without-breaking-things':
        fileContents = (await import('../content/blog/evolving-postgresql-without-breaking-things.md?raw')).default;
        break;
      case 'building-high-performance-ticketing-systems':
        fileContents = (await import('../content/blog/building-high-performance-ticketing-systems.md?raw')).default;
        break;
      case 'event-driven-architecture-in-practice':
        fileContents = (await import('../content/blog/event-driven-architecture-in-practice.md?raw')).default;
        break;
      default:
        console.error(`Blog post with slug: ${slug} not found`);
        return null;
    }
    
    console.log(`Raw content for ${slug}:`, fileContents.substring(0, 200) + '...');
    
    // Parse frontmatter with proper error handling
    try {
      // Handle Buffer not defined issue
      if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = Buffer;
      }
      
      // Parse the markdown content
      const { data, content } = matter(fileContents);
      
      console.log(`Parsed frontmatter for ${slug}:`, data);
      
      // Map the parsed data to our BlogPost interface with validation
      return {
        slug: data.slug || slug,
        title: data.title || 'Untitled Post',
        excerpt: data.excerpt || 'No excerpt available',
        date: data.date || 'No date',
        readTime: data.readTime || '5 min read',
        categories: Array.isArray(data.categories) ? data.categories : [],
        icon: getIconComponent(data.icon || 'Code', data.iconColor || 'blue'),
        content: content || ''
      };
    } catch (parseError) {
      console.error(`Error parsing frontmatter for ${slug}:`, parseError);
      return {
        slug: slug,
        title: 'Error Loading Post',
        excerpt: 'There was an error parsing this post',
        date: 'No date',
        readTime: '0 min read',
        categories: [],
        icon: getIconComponent('Code', 'red'),
        content: 'Error loading content'
      };
    }
  } catch (error) {
    console.error(`Failed to load blog post with slug: ${slug}`, error);
    return null;
  }
};

// Function to load all blog posts
export const loadAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    // In a real application, this would scan a directory or call an API
    // For this demo, we're hardcoding the available slugs
    const slugs = [
      'evolving-postgresql-without-breaking-things',
      'building-high-performance-ticketing-systems',
      'event-driven-architecture-in-practice'
    ];
    
    console.log('Loading blog posts for slugs:', slugs);
    
    const postsPromises = slugs.map(async (slug) => {
      try {
        return await loadBlogPost(slug);
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
    
    console.log('Successfully loaded blog posts:', validPosts.length);
    console.log('First post:', validPosts[0]?.title);
    
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
