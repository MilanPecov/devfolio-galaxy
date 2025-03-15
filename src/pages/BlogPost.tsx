
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import { createBlogPostContent } from "@/utils/blogUtils";
import { loadBlogPost, type BlogPost, type Chapter } from "@/services/blogService";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
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
        
        const { post, chapters } = await loadBlogPost(slug);
        if (post) {
          setPost(post);
          setChapters(chapters || []);
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

  const hasChapters = chapters && chapters.length > 0;

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
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
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
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
              {hasChapters && (
                <span className="flex items-center gap-1">
                  <BookOpen size={16} />
                  {chapters.length} {chapters.length === 1 ? 'Chapter' : 'Chapters'}
                </span>
              )}
            </div>

            {/* Introduction content */}
            {post.content && (
              <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg mb-12">
                {createBlogPostContent(post.content)}
              </div>
            )}

            {/* Chapters list */}
            {hasChapters && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-6 text-left">Chapters</h2>
                <div className="space-y-4">
                  {chapters.map((chapter) => (
                    <Link 
                      key={chapter.id}
                      to={`/blog/${slug}/${chapter.id}`}
                      className="block p-6 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 font-medium">
                          {chapter.order}
                        </div>
                        <div>
                          <h3 className="font-medium text-lg text-left">{chapter.title}</h3>
                          {chapter.description && (
                            <p className="text-gray-600 mt-1 text-left">{chapter.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
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
