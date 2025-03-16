
import { BlogPost } from "@/apps/blog";
import { TableOfContents } from "./TableOfContents";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { Button } from "@/shared/components/ui/button";
import { ChevronDown, BookOpen } from "lucide-react";
import { useState } from "react";

interface BlogPostContentProps {
  post: BlogPost;
  seriesChapters?: BlogPost[];
  loadingChapters?: boolean;
}

export const BlogPostContent = ({ post, seriesChapters = [], loadingChapters = false }: BlogPostContentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasSeriesChapters = post.isSeries && post.seriesSlug && seriesChapters.length > 0;

  return (
    <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
      {post.content}
      
      {/* For series main page, show table of contents in a collapsible section */}
      {hasSeriesChapters && (
        <div className="my-8 border border-slate-200 rounded-lg overflow-hidden bg-slate-50/50 not-prose">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800 m-0">Chapters in this Series</h3>
            </div>
            
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  {isOpen ? "Hide chapters" : "View all chapters"}
                  <ChevronDown 
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`} 
                  />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4 data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up overflow-hidden">
                <TableOfContents seriesChapters={seriesChapters} />
              </CollapsibleContent>
            </Collapsible>
          </div>
          
          {/* Always show the first 2 chapters by default (if available) */}
          {!isOpen && seriesChapters.length > 0 && (
            <div className="p-4">
              <TableOfContents 
                seriesChapters={seriesChapters.slice(0, Math.min(2, seriesChapters.length))} 
                compact={true}
              />
              {seriesChapters.length > 2 && (
                <div className="text-center mt-2 pb-2">
                  <span className="text-slate-400 text-sm">
                    + {seriesChapters.length - 2} more chapters
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
