
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { BlogPost } from "@/apps/blog";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

interface FeaturedSeriesProps {
  series: {
    main: BlogPost;
    entries: BlogPost[];
  }[];
}

export const FeaturedSeries = ({ series = [] }: FeaturedSeriesProps) => {
  const [activeTab, setActiveTab] = useState("0");

  if (!series.length) return null;

  return (
    <div className="my-10 animate-fade-up">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">Featured Series</h3>
        </div>
        <Link
          to="/blog"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
        >
          View all articles
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <Tabs
        defaultValue="0"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-slate-100 p-1 overflow-x-auto max-w-full flex flex-nowrap">
          {series.map((item, index) => (
            <TabsTrigger
              key={item.main.slug}
              value={index.toString()}
              className="whitespace-nowrap px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {item.main.seriesTitle || item.main.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {series.map((item, index) => (
          <TabsContent
            key={item.main.slug}
            value={index.toString()}
            className="mt-2 animate-fade-up"
          >
            <Card className="border-slate-200">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Series description */}
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.main.categories && item.main.categories.map((category, catIndex) => (
                        <span
                          key={`${item.main.slug}-cat-${catIndex}`}
                          className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">
                      {item.main.seriesTitle || item.main.title}
                    </h2>
                    <p className="text-slate-600 mb-4">
                      {item.main.excerpt}
                    </p>
                    <Link
                      to={`/blog/${item.main.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Read Series Overview
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {/* Series chapters */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-slate-700 mb-2">
                      Chapters in this series:
                    </h3>
                    <div className="space-y-3">
                      {item.entries.slice(0, 3).map((entry) => (
                        <Link
                          key={entry.slug}
                          to={`/blog/${entry.slug}`}
                          className="block p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {entry.chapterNumber === 0 ? 'Prologue' : `Chapter ${entry.chapterNumber}`}: {entry.chapterTitle || entry.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">{entry.readTime}</p>
                            </div>
                            <ArrowRight size={14} className="text-slate-400" />
                          </div>
                        </Link>
                      ))}
                      
                      {item.entries.length > 3 && (
                        <div className="text-center mt-2">
                          <Link
                            to={`/blog/${item.main.slug}`}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            View all {item.entries.length} chapters
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FeaturedSeries;
