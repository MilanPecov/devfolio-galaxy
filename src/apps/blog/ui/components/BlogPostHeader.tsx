
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { Database } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

interface BlogPostHeaderProps {
  post: BlogPost;
}

export const BlogPostHeader = ({ post }: BlogPostHeaderProps) => {
  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/blog">Blog</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {/* Show series title as a middle step in breadcrumb if post is part of a series */}
          {post.isSeriesEntry && post.seriesSlug && post.seriesTitle && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/blog/${post.seriesSlug}`}>{post.seriesTitle}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          
          <BreadcrumbItem>
            <BreadcrumbPage>
              {post.isSeriesEntry && post.chapterTitle ? post.chapterTitle : post.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="animate-fade-up">
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-6 mb-4">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        {/* Series banner when viewing a chapter */}
        {post.isSeriesEntry && post.seriesTitle && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-sm text-slate-500">Series</p>
            <h3 className="text-lg font-medium text-slate-800">{post.seriesTitle}</h3>
            {post.chapterNumber !== undefined && (
              <p className="text-sm text-slate-600">
                {post.chapterNumber === 0 ? 'Prologue' : `Chapter ${post.chapterNumber}`}
              </p>
            )}
          </div>
        )}

        {/* Series introduction when viewing the main series page */}
        {post.isSeries && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm font-medium text-blue-800">This is a multi-part series</p>
            <p className="text-sm text-blue-600">
              This series contains multiple chapters. Navigate through them using the links below.
            </p>
          </div>
        )}

        <div className="flex justify-between items-start mb-6">
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="p-2 rounded-full bg-[#F8FAFC]">
            {post.icon || <Database className="h-6 w-6 text-blue-500" />}
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#1E293B] mb-4 text-left">
          {post.isSeriesEntry && post.chapterTitle ? post.chapterTitle : post.title}
        </h1>
      </div>
    </div>
  );
};
