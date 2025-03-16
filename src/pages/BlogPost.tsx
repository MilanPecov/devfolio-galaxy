
import { useEffect, useState } from "react";
import Navbar from "@/shared/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { blogController, type BlogPost as BlogPostType } from "@/apps/blog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const fetchPost = async () => {
      try {
        if (!slug) {
          setError("Post not found");
          return;
        }
        
        const postData = await blogController.loadBlogPost(slug);
        if (postData) {
          setPost(postData);
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error loading blog post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 flex justify-center">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state or not found
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{error || "Post not found"}</h1>
            <Link to="/blog" className="text-blue-600 hover:text-blue-800">
              Return to blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb navigation with series support */}
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
              
              {/* Show series title as a middle step in breadcrumb if post is part of a series */}
              {post.isSeriesEntry && post.seriesSlug && post.seriesTitle && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={`/blog/${post.seriesSlug}`}>{post.seriesTitle}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {post.isSeriesEntry && post.chapterTitle ? post.chapterTitle : post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="animate-fade-up">
            {/* Series banner when viewing a chapter */}
            {post.isSeriesEntry && post.seriesTitle && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500">Series</p>
                <h3 className="text-lg font-medium text-slate-800">{post.seriesTitle}</h3>
                {post.chapterNumber && (
                  <p className="text-sm text-slate-600">
                    {post.chapterNumber === 0 ? 'Prologue' : `Chapter ${post.chapterNumber}`}
                  </p>
                )}
              </div>
            )}

            {/* Series introduction when viewing the main series page */}
            {post.isSeries && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-800">This is a multi-part series</p>
                <p className="text-sm text-blue-600">
                  This series contains multiple chapters. Navigate through them using the links at the end of each article.
                </p>
              </div>
            )}

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
              {post.isSeriesEntry && post.chapterTitle ? post.chapterTitle : post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
              {post.content}
            </div>

            {/* Chapter Navigation */}
            {post.isSeriesEntry && (
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-semibold mb-4">Chapter Navigation</h3>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  {post.previousChapter ? (
                    <Link
                      to={`/blog/${post.previousChapter.slug}`}
                      className="flex items-center group p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors w-full sm:w-1/2"
                    >
                      <ChevronLeft className="mr-2 h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                      <div>
                        <p className="text-sm text-slate-500">Previous</p>
                        <p className="font-medium text-slate-700">{post.previousChapter.title}</p>
                      </div>
                    </Link>
                  ) : (
                    <div className="w-full sm:w-1/2"></div>
                  )}

                  {post.nextChapter && (
                    <Link
                      to={`/blog/${post.nextChapter.slug}`}
                      className="flex items-center justify-between group p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors w-full sm:w-1/2"
                    >
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Next</p>
                        <p className="font-medium text-slate-700">{post.nextChapter.title}</p>
                      </div>
                      <ChevronRight className="ml-2 h-5 w-5 text-slate-400 group-hover:text-slate-600" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Series Chapter List - only on the main series page */}
            {post.isSeries && (
              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="text-xl font-semibold mb-4">Chapters in this Series</h3>
                <div className="flex flex-col gap-3 mt-4">
                  {/* This would be populated by a function in the BlogController that returns all chapters */}
                  <p className="text-sm text-slate-500">
                    Loading chapters... (To be implemented in the next step)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
