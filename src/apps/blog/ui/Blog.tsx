
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { blogController, type BlogPost } from "@/apps/blog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import BlogList from "@/apps/blog/ui/BlogList.tsx";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch all blog posts
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await blogController.loadAllBlogPosts();
        
        // Check if posts were successfully loaded
        if (allPosts && allPosts.length > 0) {
          setPosts(allPosts);
        } else {
          // Handle case where no posts are returned
          setPosts([]);
          setError("No blog posts available.");
        }
      } catch (error) {
        // Handle any errors that occur during fetching
        setError("Failed to load blog posts. Please try again later.");
        toast.error("Failed to load blog posts");
        // Ensure posts is at least an empty array to prevent mapping errors
        setPosts([]);
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-20 relative overflow-hidden">
      {/* Abstract background with gradient and grid pattern */}
      <div className="absolute inset-0 bg-[#F8FAFC]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(238,238,238,0.6)_1px,transparent_1px),linear-gradient(rgba(238,238,238,0.6)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8FAFC] via-white/90 to-[#F8FAFC]"></div>
      </div>

      <div className="container mx-auto px-6 relative">
        {/* Section header */}
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

        {/* Blog posts */}
        <div className="max-w-4xl mx-auto">
          <BlogList
            posts={posts}
            loading={loading}
            error={error}
          />
          
          {/* Link to blog page if there are posts */}
          {posts.length > 0 && (
            <div className="mt-12 text-center">
              <Button asChild variant="outline">
                <Link to="/blog">View All Articles</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
