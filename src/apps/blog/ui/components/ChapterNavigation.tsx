
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChapterNavigationProps {
  post: BlogPost;
}

export const ChapterNavigation = ({ post }: ChapterNavigationProps) => {
  if (!post.isSeriesEntry) return null;
  
  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-lg font-semibold mb-4">Chapter Navigation</h3>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {post.previousChapter ? (
          <Link
            to={`/blog/${post.previousChapter.slug}`}
            className="flex items-center group p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors w-full sm:w-1/2"
          >
            <ChevronLeft className="mr-2 h-5 w-5 text-slate-400 group-hover:text-slate-600" />
            <div>
              <p className="text-sm text-slate-500">Previous</p>
              <p className="font-medium text-slate-700">{post.previousChapter.title}</p>
            </div>
          </Link>
        ) : (
          <div className="w-full sm:w-1/2"></div>
        )}

        {post.nextChapter && (
          <Link
            to={`/blog/${post.nextChapter.slug}`}
            className="flex items-center justify-between group p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors w-full sm:w-1/2"
          >
            <div className="text-right">
              <p className="text-sm text-slate-500">Next</p>
              <p className="font-medium text-slate-700">{post.nextChapter.title}</p>
            </div>
            <ChevronRight className="ml-2 h-5 w-5 text-slate-400 group-hover:text-slate-600" />
          </Link>
        )}
      </div>
    </div>
  );
};
