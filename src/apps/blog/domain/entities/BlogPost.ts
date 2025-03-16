
import { ReactNode } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  categories: string[];
  icon: ReactNode;
  content?: ReactNode;
  
  // Series-related properties
  isSeries?: boolean;
  isSeriesEntry?: boolean;
  seriesSlug?: string;
  seriesTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  previousChapter?: {
    slug: string;
    title: string;
  };
  nextChapter?: {
    slug: string;
    title: string;
  };
}

export interface BlogPostFrontmatter {
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  categories?: string[];
  icon?: string;
  iconColor?: string;
  
  // Series-related frontmatter
  isSeries?: boolean;
  isSeriesEntry?: boolean;
  seriesSlug?: string;
  seriesTitle?: string;
  chapterTitle?: string;
  chapterNumber?: number;
  previousChapter?: string;
  previousChapterTitle?: string;
  nextChapter?: string;
  nextChapterTitle?: string;
  [key: string]: any;
}
