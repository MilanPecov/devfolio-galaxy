
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createBlogPostContent } from "@/utils/blogUtils";
import { loadBlogChapter, type BlogPost, type ChapterInfo } from "@/services/blogService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ChapterNavigation from "@/components/ChapterNavigation";

const BlogChapter = () => {
  const { slug, chapter } = useParams<{ slug: string; chapter: string }>();
  const [chapterData, setChapterData] = useState<{ post: BlogPost; content: string; chapterInfo: ChapterInfo } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts or params change
    window.scrollTo(0, 0);
    
    const fetchChapter = async () => {
      try {
        if (!slug || !chapter) {
          setError("Chapter not found");
          return;
        }
        
        const data = await loadBlogChapter(slug, chapter);
        if (data) {
          setChapterData(data);
        } else {
          setError("Chapter not found");
        }
      } catch (err) {
        console.error("Error loading blog chapter:", err);
        setError("Failed to load chapter");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [slug, chapter]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading chapter...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state or not found
  if (error || !chapterData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{error || "Chapter not found"}</h1>
            <Link to={`/blog/${slug}`} className="text-blue-600 hover:text-blue-800">
              Return to post
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { post, content, chapterInfo } = chapterData;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb navigation */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={`/blog/${slug}`}>{post.title}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{chapterInfo.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="animate-fade-up">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <div className="p-2 rounded-full bg-[#F8FAFC]">
                {post.icon}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-[#1E293B] mb-4 text-left">
              {chapterInfo.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>Chapter {chapterInfo.order} of {chapterInfo.totalChapters}</span>
              <span>{post.readTime}</span>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
              {content && createBlogPostContent(content)}
            </div>

            {/* Chapter navigation */}
            <ChapterNavigation 
              slug={slug} 
              currentChapter={chapterInfo.id} 
              chapters={chapterInfo.allChapters}
              postTitle={post.title}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogChapter;
