
import matter from 'gray-matter';
import { marked } from 'marked';
import { Database, Server, Code } from 'lucide-react';
import React from 'react';

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
const getIconComponent = (iconName: string, colorClass: string): React.ReactNode => {
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
    const module = await import(`../content/blog/${slug}.md?raw`);
    const fileContents = module.default;
    
    // Parse frontmatter
    const { data, content } = matter(fileContents);
    
    // Map the parsed data to our BlogPost interface
    return {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      readTime: data.readTime,
      categories: data.categories,
      icon: getIconComponent(data.icon, data.iconColor),
      content
    };
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
    
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await loadBlogPost(slug);
        return post;
      })
    );
    
    // Filter out any null results and sort by date (newest first)
    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        // Simple date string comparison (assumes format is consistent)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error('Failed to load all blog posts', error);
    return [];
  }
};

// Function to parse markdown content to HTML
export const parseMarkdownToHtml = (markdown: string): string => {
  return marked.parse(markdown, {
    gfm: true, // GitHub flavored markdown
    breaks: true // Convert line breaks to <br>
  });
};
