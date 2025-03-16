
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

interface SeriesChapterListProps {
  post: BlogPost;
  seriesChapters: BlogPost[];
  loading?: boolean;
}

export const SeriesChapterList = ({ post, seriesChapters, loading = false }: SeriesChapterListProps) => {
  // Debug logging
  console.log("SeriesChapterList props:", { 
    isSeries: post.isSeries, 
    seriesSlug: post.seriesSlug,
    chaptersCount: seriesChapters.length,
    loading
  });
  
  // Only show for series main posts
  if (!post.isSeries || (!loading && seriesChapters.length === 0)) {
    console.log("Not showing chapter list - conditions not met");
    return null;
  }

  if (loading) {
    return (
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-xl font-semibold mb-4">Chapters in this Series</h3>
        <div className="flex flex-col gap-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded-lg border border-slate-200">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h3 className="text-xl font-semibold mb-4">Chapters in this Series</h3>
      <div className="flex flex-col gap-3 mt-4">
        {seriesChapters.map((chapter) => (
          <Link 
            key={chapter.slug}
            to={`/blog/${chapter.slug}`} 
            className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-slate-800">
                {chapter.chapterNumber === 0 
                  ? 'Prologue' 
                  : `Chapter ${chapter.chapterNumber}`}
                : {chapter.chapterTitle || chapter.title}
              </p>
              <p className="text-sm text-slate-500">{chapter.readTime}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-400" />
          </Link>
        ))}
      </div>
    </div>
  );
};
