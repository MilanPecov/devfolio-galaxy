import { BlogPost } from "@/apps/blog";
import { TableOfContents } from "./TableOfContents";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";

interface BlogPostContentProps {
  post: BlogPost;
  seriesChapters?: BlogPost[];
}

export const BlogPostContent = ({
  post,
  seriesChapters = [],
}: BlogPostContentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSeriesChapters = post.isSeries && post.seriesSlug && seriesChapters.length > 0;

  return (
    <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
      {post.content}

      {hasSeriesChapters && (
        <div className="my-6 border border-slate-200 rounded-lg overflow-hidden bg-white">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800 m-0">Table of Contents</h3>
            </div>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 px-2 py-1">
                  {isOpen ? "Hide chapters" : "View all chapters"}
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* Collapsible full TOC */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleContent className="p-3">
              <TableOfContents seriesChapters={seriesChapters} hideHeader={true} />
            </CollapsibleContent>
          </Collapsible>

          {/* Compact view (when collapsed) */}
          {!isOpen && seriesChapters.length > 0 && (
            <>
              <div className="p-3">
                <TableOfContents
                  seriesChapters={seriesChapters.slice(0, 2)}
                  compact={true}
                  hideHeader={true}
                />
              </div>
              {seriesChapters.length > 2 && (
                <div className="text-center py-2 border-t border-slate-200">
                  <span className="text-slate-400 text-sm">
                    + {seriesChapters.length - 2} more chapters
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
