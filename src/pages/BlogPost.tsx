
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createBlogPostContent } from "@/utils/blogUtils";
import { loadBlogPost, type BlogPost } from "@/services/blogService";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!slug) {
          setError("Post not found");
          return;
        }
        
        const postData = await loadBlogPost(slug);
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
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Return home
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
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={20} />
            Back to all posts
          </Link>

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
            </div>

            <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
              {post.content && createBlogPostContent(post.content)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
