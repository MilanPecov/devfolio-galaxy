
import { BlogPost } from "@/apps/blog";

interface BlogPostContentProps {
  post: BlogPost;
}

export const BlogPostContent = ({ post }: BlogPostContentProps) => {
  return (
    <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
      {post.content}
    </div>
  );
};
