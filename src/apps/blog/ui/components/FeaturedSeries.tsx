
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BookText } from "lucide-react";
import { BlogPost } from "@/apps/blog";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

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
      <div className="flex items-center mb-6">
        <div className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">Featured Series</h3>
        </div>
      </div>

      <Tabs
        defaultValue="0"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="mb-6 relative">
          <ScrollArea className="w-full pb-2" type="scroll" scrollHideDelay={100}>
            <TabsList className="bg-slate-100 p-1 flex w-max min-w-full">
              {series.map((item, index) => (
                <TabsTrigger
                  key={item.main.slug}
                  value={index.toString()}
                  className="whitespace-nowrap px-4 py-2 transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600"
                >
                  {item.main.seriesTitle || item.main.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollArea>
        </div>

        {series.map((item, index) => (
          <TabsContent
            key={item.main.slug}
            value={index.toString()}
            className="mt-2 animate-fade-up"
          >
            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Series description */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-1">
                      {item.main.categories && item.main.categories.map((category, catIndex) => (
                        <span
                          key={`${item.main.slug}-cat-${catIndex}`}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {item.main.seriesTitle || item.main.title}
                    </h2>
                    <p className="text-slate-600">
                      {item.main.excerpt}
                    </p>
                    <Link
                      to={`/blog/${item.main.slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group"
                    >
                      Read Series Overview
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                  
                  {/* Series chapters */}
                  <div className="space-y-4 max-w-xl mx-auto">
                    <h3 className="font-medium text-slate-700">
                      Chapters in this series:
                    </h3>
                    <div className="space-y-3">
                      {item.entries.slice(0, 3).map((entry) => (
                        <Link
                          key={entry.slug}
                          to={`/blog/${entry.slug}`}
                          className="block p-3 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700 transition-colors">
                                {entry.chapterTitle || entry.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">{entry.readTime}</p>
                            </div>
                            <ArrowRight size={14} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </Link>
                      ))}

                      {item.entries.length > 3 && (
                        <Link
                          to={`/blog/${item.main.slug}`}
                          className="flex items-center justify-center w-full p-2 mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-dashed border-blue-200 rounded-lg hover:bg-blue-50/30 group transition-colors"
                        >
                          View all {item.entries.length} chapters
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
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
