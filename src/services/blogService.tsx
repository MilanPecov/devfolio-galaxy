
import { Database, Server, Code } from 'lucide-react';
import React from 'react';
import { marked } from 'marked';

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

// Improved frontmatter parser that handles YAML-style frontmatter more robustly
const parseMarkdownFrontmatter = (content: string): { data: Record<string, any>; content: string } => {
  // Check if content exists and starts with frontmatter delimiter
  if (!content || !content.startsWith('---')) {
    return { data: {}, content: content || '' };
  }

  // Find the end of the frontmatter block (second ---)
  const endOfFrontmatter = content.indexOf('---', 3);
  if (endOfFrontmatter === -1) {
    return { data: {}, content: content };
  }

  // Extract frontmatter and content
  const frontmatterBlock = content.substring(3, endOfFrontmatter).trim();
  const mainContent = content.substring(endOfFrontmatter + 3).trim();
  
  // Parse frontmatter using a more robust approach
  const data: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');
  
  let currentKey: string | null = null;
  let inArray = false;
  let arrayItems: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this is a list item (part of an array)
    if (line.startsWith('- ') && currentKey) {
      inArray = true;
      const value = line.substring(2).trim();
      arrayItems.push(value);
      
      // If this is the last line or the next line doesn't start with a dash,
      // save the accumulated array
      const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
      if (i === lines.length - 1 || !nextLine.startsWith('- ')) {
        data[currentKey] = [...arrayItems];
        arrayItems = [];
      }
      continue;
    }
    
    // Check if this is a new key-value pair
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      // Save any previous array if we were building one
      if (inArray && currentKey && arrayItems.length > 0) {
        data[currentKey] = [...arrayItems];
        arrayItems = [];
        inArray = false;
      }
      
      // Extract new key and value
      currentKey = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Empty value might indicate the start of an array in the next line
      if (!value) {
        inArray = true;
        arrayItems = [];
      } else {
        // Store simple key-value pair
        inArray = false;
        data[currentKey] = value;
      }
    }
  }
  
  // Make sure we save any final array that was being built
  if (inArray && currentKey && arrayItems.length > 0) {
    data[currentKey] = [...arrayItems];
  }
  
  return {
    data,
    content: mainContent
  };
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
const importBlogContent = async (slug: string): Promise<string> => {
  try {
    return (await import(`../content/blog/${slug}.md?raw`)).default;
  } catch (error) {
    throw new Error(`Blog post with slug: ${slug} not found`);
  }
};

// Helper function to load blog post content
export const loadBlogPost = async (slug: string): Promise<BlogPost | null> => {
  try {
    // Dynamically import the blog post content
    const fileContents = await importBlogContent(slug);
    
    // Parse frontmatter
    const { data, content } = parseMarkdownFrontmatter(fileContents);
    
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
      content: content || ''
    };
    
    return blogPost;
  } catch (error) {
    console.error(`Failed to load blog post with slug: ${slug}`, error);
    return null;
  }
};

// Function to load all blog posts
export const loadAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const slugs = getBlogSlugs();
    
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
