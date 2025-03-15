
import { Database, Server, Code, BookText, Layout, BarChart, Key, RefreshCw, Eye, BookOpen } from 'lucide-react';
import React from 'react';
import { marked } from 'marked';
import matter from 'gray-matter';
import { Buffer } from 'buffer';

// Make Buffer available globally for gray-matter
window.Buffer = Buffer;

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

const getBlogSlugs = (): string[] => {
  return [
    'evolving-postgresql-without-breaking-things',
    'building-high-performance-ticketing-systems',
    'event-driven-architecture-in-practice'
  ];
};

const importBlogContent = async (slug: string): Promise<string> => {
  try {
    // First, try to import from the directory structure (for posts with chapters)
    if (slug === 'evolving-postgresql-without-breaking-things') {
      try {
        return (await import(`../content/blog/${slug}/index.md?raw`)).default;
      } catch (error) {
        console.error(`Failed to import ${slug}/index.md:`, error);
        // Fall back to trying the single file
        return (await import(`../content/blog/${slug}.md?raw`)).default;
      }
    }
    
    // For regular blog posts (single file)
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

const getChapters = async (slug: string): Promise<Chapter[]> => {
  try {
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
      
      const chaptersPromises = chapterFiles.map(async (chapterFile) => {
        try {
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
          return {
            id: chapterFile.id,
            title: chapterFile.id.charAt(0).toUpperCase() + chapterFile.id.slice(1).replace(/-/g, ' '),
            description: '',
            order: 0
          };
        }
      });
      
      const chapters = await Promise.all(chaptersPromises);
      
      return chapters.sort((a, b) => a.order - b.order);
    }
    
    return [];
  } catch (error) {
    console.error('Error loading chapters:', error);
    return [];
  }
};

const importChapterContent = async (slug: string, chapterId: string): Promise<string> => {
  try {
    return (await import(`../content/blog/${slug}/${chapterId}.md?raw`)).default;
  } catch (error) {
    console.error(`Error importing chapter content for ${slug}/${chapterId}:`, error);
    throw new Error(`Chapter content not found for ${chapterId}`);
  }
};

export const loadBlogPost = async (slug: string): Promise<{ post: BlogPost | null, chapters: Chapter[] }> => {
  try {
    const chapters = await getChapters(slug);
    const hasChapters = chapters.length > 0;
    
    // Load the blog post content
    const fileContents = await importBlogContent(slug);
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContents);
    
    if (!data || Object.keys(data).length === 0) {
      console.error(`Failed to parse frontmatter for ${slug}`);
      throw new Error(`Failed to parse frontmatter for ${slug}`);
    }
    
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

export const loadBlogChapter = async (slug: string, chapterId: string): Promise<{ post: BlogPost; content: string; chapterInfo: ChapterInfo } | null> => {
  try {
    const { post, chapters } = await loadBlogPost(slug);
    
    if (!post) {
      throw new Error('Blog post not found');
    }
    
    const chapterIndex = chapters.findIndex(ch => ch.id === chapterId);
    if (chapterIndex === -1) {
      throw new Error('Chapter not found');
    }
    
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
    
    const validPosts = posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
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

export const parseMarkdownToHtml = (markdown: string): string => {
  try {
    return marked.parse(markdown, {
      gfm: true,
      breaks: true
    }) as string;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return '<p>Error parsing content</p>';
  }
};
