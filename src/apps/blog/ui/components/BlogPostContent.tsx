
import { BlogPost } from "@/apps/blog";
import { TableOfContents } from "./TableOfContents";
import { useEffect } from "react";

interface BlogPostContentProps {
  post: BlogPost;
  seriesChapters?: BlogPost[];
}

export const BlogPostContent = ({ post, seriesChapters = [] }: BlogPostContentProps) => {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
      {post.content}
      
      {/* For series main page, show table of contents after the content */}
      {post.isSeries && post.seriesSlug && seriesChapters.length > 0 && (
        <TableOfContents seriesChapters={seriesChapters} />
      )}
    </div>
  );
};
