
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { loadAllBlogPosts, type BlogPost } from "@/services/blogService";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await loadAllBlogPosts();
        setPosts(allPosts);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
        setError("Failed to load blog posts. Please try again later.");
        // Ensure posts is at least an empty array to prevent mapping errors
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-20 relative overflow-hidden">
      {/* Abstract background */}
      <div className="absolute inset-0 bg-[#F8FAFC]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.6)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.6)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white/90 to-[#F8FAFC]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-[#1E293B]/5 text-[#1E293B] rounded-full text-sm font-medium mb-4 backdrop-blur-sm border border-[#1E293B]/10">
            Technical Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
            Engineering Blog
          </h2>
          <p className="text-gray-600">
            Sharing experiences and insights from building large-scale systems.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-center">
              <p className="text-gray-500">Loading blog posts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="group relative bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 animate-fade-up border border-gray-100 hover:border-gray-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="p-3 rounded-full bg-[#F8FAFC] md:self-start">
                    {post.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories && post.categories.map((category) => (
                        <span
                          key={category}
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
                    <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[#1E293B] group-hover:text-[#334155] transition-colors text-left">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-left">
                      {post.excerpt}
                    </p>
                    <div className="text-left">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-2 text-[#1E293B] font-medium group-hover:text-[#475569] transition-colors"
                      >
                        Read More 
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <p className="text-gray-500">No blog posts available.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
