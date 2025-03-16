
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface TableOfContentsProps {
  seriesChapters: BlogPost[];
  compact?: boolean;
}

export const TableOfContents = ({ seriesChapters, compact = false }: TableOfContentsProps) => {
  if (!seriesChapters.length) return null;

  return (
    <div className={`${compact ? '' : 'mt-8'} animate-fade-up`}>
      {!compact && (
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-800">Table of Contents</h2>
        </div>
      )}
      
      <Card className={`border-slate-200 ${compact ? 'shadow-none' : 'shadow-sm hover:shadow-md'} transition-shadow duration-300 overflow-hidden`}>
        <CardContent className="p-0">
          {seriesChapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              to={`/blog/${chapter.slug}`}
              className={`block ${compact ? 'p-3' : 'p-5'} transition-colors hover:bg-blue-50/50 group ${
                index !== seriesChapters.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-sm group-hover:bg-blue-200 transition-colors">
                  {chapter.chapterNumber === 0 ? "P" : chapter.chapterNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {chapter.chapterTitle || chapter.title}
                  </h3>
                  {!compact && (
                    <p className="text-slate-600 text-sm line-clamp-2 mt-1">{chapter.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span>{chapter.date}</span>
                    <span>{chapter.readTime}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 mt-1 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
