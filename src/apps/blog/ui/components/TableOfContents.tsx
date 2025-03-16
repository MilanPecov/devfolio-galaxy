
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

interface TableOfContentsProps {
  seriesChapters: BlogPost[];
  compact?: boolean;
}

export const TableOfContents = ({ seriesChapters, compact = false }: TableOfContentsProps) => {
  if (!seriesChapters.length) return null;

  return (
    <div className={`${compact ? '' : 'mt-4'} animate-fade-up w-full`}>
      {!compact && (
        <div className="flex items-center gap-2 mb-4 text-left">
          <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
          <h2 className="text-xl font-bold text-slate-800">Table of Contents</h2>
        </div>
      )}
      
      <Card className={cn("border-0 shadow-none overflow-hidden")}>
        <CardContent className="p-0">
          {seriesChapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              to={`/blog/${chapter.slug}`}
              className={`flex items-center justify-between ${compact ? 'p-3' : 'p-4'} transition-colors hover:bg-blue-50/50 group text-left ${
                index !== seriesChapters.length - 1 && !compact ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-sm group-hover:bg-blue-200 transition-colors">
                  {chapter.chapterNumber === 0 ? "P" : chapter.chapterNumber}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors mb-1">
                    {chapter.chapterTitle || chapter.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{chapter.date}</span>
                    <span>{chapter.readTime}</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
