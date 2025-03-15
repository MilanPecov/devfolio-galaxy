
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

// Manual frontmatter parser since gray-matter is having issues
const parseMarkdownFrontmatter = (content: string): { data: Record<string, any>; content: string } => {
  // Check if the content starts with a frontmatter delimiter
  if (!content.startsWith('---')) {
    return { data: {}, content };
  }

  // Find the end of the frontmatter block
  const endOfFrontmatter = content.indexOf('---', 3);
  if (endOfFrontmatter === -1) {
    return { data: {}, content };
  }

  // Extract frontmatter and content
  const frontmatterBlock = content.substring(3, endOfFrontmatter).trim();
  const mainContent = content.substring(endOfFrontmatter + 3).trim();
  
  // Parse frontmatter
  const data: Record<string, any> = {};
  const lines = frontmatterBlock.split('\n');
  
  let currentKey: string | null = null;
  let inArray = false;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Check if this is a list item
    if (trimmedLine.startsWith('- ') && currentKey && inArray) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(trimmedLine.substring(2).trim());
      continue;
    }
    
    // Check if this is a new key-value pair
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex > 0) {
      currentKey = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      
      // Check if this is potentially the start of an array
      if (!value) {
        inArray = true;
        data[currentKey] = [];
      } else {
        inArray = false;
        data[currentKey] = value;
      }
    }
  }
  
  console.log("Parsed frontmatter:", data); // Debug
  
  return {
    data,
    content: mainContent
  };
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
    
    console.log(`Raw content for ${slug}:`, fileContents.substring(0, 150) + '...');
    
    // Parse frontmatter with our custom parser
    try {
      // Parse the markdown content
      const { data, content } = parseMarkdownFrontmatter(fileContents);
      
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
    console.log('First post sample:', validPosts[0] ? {
      title: validPosts[0].title,
      excerpt: validPosts[0].excerpt?.substring(0, 50) + '...'
    } : 'No posts');
    
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
