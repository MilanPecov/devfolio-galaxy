
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { BlogPost } from "@/apps/blog";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/shared/components/ui/accordion";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface GroupedBlogListProps {
  regularPosts: BlogPost[];
  seriesWithEntries: {
    main: BlogPost;
    entries: BlogPost[];
  }[];
  loading: boolean;
  error: string | null;
}

const GroupedBlogList = ({ 
  regularPosts, 
  seriesWithEntries, 
  loading, 
  error 
}: GroupedBlogListProps) => {
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);

  const toggleSeriesExpansion = (seriesSlug: string) => {
    setExpandedSeries(prev => 
      prev.includes(seriesSlug) 
        ? prev.filter(slug => slug !== seriesSlug)
        : [...prev, seriesSlug]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!regularPosts.length && !seriesWithEntries.length) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <p className="text-gray-500">No blog posts available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Series Posts Group */}
      {seriesWithEntries.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2 text-left">
            <BookOpen className="h-5 w-5 text-blue-500" />
            Series
          </h2>
          
          <Accordion type="multiple" className="space-y-4">
            {seriesWithEntries.map((series) => (
              <AccordionItem 
                key={series.main.slug}
                value={series.main.slug}
                className="border-none"
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {series.main.categories && series.main.categories.map((category, catIndex) => (
                          <span
                            key={`${series.main.slug}-cat-${catIndex}`}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{series.main.date}</span>
                        <span>{series.entries.length} chapters</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Link 
                          to={`/blog/${series.main.slug}`}
                          className="text-xl md:text-2xl font-semibold text-slate-800 hover:text-blue-600 transition-colors text-left"
                        >
                          {series.main.seriesTitle || series.main.title}
                        </Link>
                        
                        <AccordionTrigger className="!no-underline flex-shrink-0">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="gap-1 text-slate-500 hover:text-blue-600"
                          >
                            Chapters
                            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                          </Button>
                        </AccordionTrigger>
                      </div>
                      
                      <p className="text-gray-600 mt-3 text-left">
                        {series.main.excerpt}
                      </p>
                      
                      <div className="mt-4 text-left">
                        <Link
                          to={`/blog/${series.main.slug}`}
                          className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group"
                        >
                          Read Series Overview
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                    
                    <AccordionContent>
                      <div className="border-t border-slate-200 bg-slate-50 p-4">
                        <ul className="space-y-2">
                          {series.entries.map((entry) => (
                            <li key={entry.slug}>
                              <Link
                                to={`/blog/${entry.slug}`}
                                className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group"
                              >
                                <div className="text-left">
                                  <p className="font-medium text-slate-800 group-hover:text-blue-700">
                                    {entry.chapterNumber === 0 ? 'Prologue' : `Chapter ${entry.chapterNumber}`}: {entry.chapterTitle || entry.title}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                    <span>{entry.date}</span>
                                    <span>{entry.readTime}</span>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </CardContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {/* Regular Posts Group */}
      {regularPosts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 text-left">
            Articles
          </h2>
          
          <div className="space-y-6">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-500 animate-fade-up border border-gray-100 hover:border-gray-200"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="p-3 rounded-full bg-[#F8FAFC] md:self-start">
                    {post.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories && post.categories.map((category, catIndex) => (
                        <span
                          key={`${post.slug}-cat-${catIndex}`}
                          className="px-3 py-1 bg-[#1E293B]/5 text-[#1E293B] rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 text-slate-800 group-hover:text-slate-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group"
                    >
                      Read More 
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupedBlogList;
