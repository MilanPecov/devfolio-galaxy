
import { Link } from "react-router-dom";
import { BlogPost } from "@/apps/blog";
import { ChevronRight, BookOpen } from "lucide-react";

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
      
      <div className="grid gap-4 mt-6">
        {seriesChapters.map((chapter) => (
          <Link
            key={chapter.slug}
            to={`/blog/${chapter.slug}`}
            className="p-6 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {chapter.chapterNumber === 0 ? 'Prologue' : `Chapter ${chapter.chapterNumber}`}
                </span>
                <h3 className="text-lg font-semibold text-slate-800">{chapter.chapterTitle || chapter.title}</h3>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-slate-600">{chapter.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
              <span>{chapter.date}</span>
              <span>{chapter.readTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
