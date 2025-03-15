
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
  [key: string]: any;
}
