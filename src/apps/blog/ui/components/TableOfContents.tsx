
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface TableOfContentsProps {
  seriesChapters: BlogPost[];
}

export const TableOfContents = ({ seriesChapters }: TableOfContentsProps) => {
  if (!seriesChapters.length) return null;

  return (
    <div className="mt-8 animate-fade-up">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-blue-500" />
        <h2 className="text-2xl font-bold text-slate-800">Table of Contents</h2>
      </div>
      
      <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-0">
          {seriesChapters.map((chapter, index) => (
            <Link
              key={chapter.slug}
              to={`/blog/${chapter.slug}`}
              className={`block p-5 transition-colors hover:bg-slate-50 ${
                index !== seriesChapters.length - 1 ? "border-b border-slate-200" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                  {chapter.chapterNumber === 0 ? "P" : chapter.chapterNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-slate-600">
                    {chapter.chapterTitle || chapter.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2 mt-1">{chapter.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                    <span>{chapter.date}</span>
                    <span>{chapter.readTime}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 mt-1" />
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
