
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { blogController, type BlogPost } from "@/apps/blog";
import { Button } from "@/shared/components/ui/button.tsx";
import BlogList from "@/apps/blog/ui/BlogList.tsx";
import FeaturedSeries from "@/apps/blog/ui/components/FeaturedSeries.tsx";
import { ArrowRight } from "lucide-react";

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredSeries, setFeaturedSeries] = useState<{main: BlogPost, entries: BlogPost[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch all blog posts and organize series
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await blogController.loadAllBlogPosts();
        
        // Check if posts were successfully loaded
        if (allPosts && allPosts.length > 0) {
          // Filter out series main posts
          const regularPosts = allPosts.filter(post => !post.isSeries && !post.isSeriesEntry);
          
          // Get series main posts
          const seriesMainPosts = allPosts.filter(post => post.isSeries);
          
          // Organize series with their entries
          const seriesWithEntries = await Promise.all(
            seriesMainPosts.map(async (mainPost) => {
              if (mainPost.seriesSlug) {
                const entries = await blogController.getSeriesChapters(mainPost.seriesSlug);
                return { main: mainPost, entries };
              }
              return { main: mainPost, entries: [] };
            })
          );
          
          setFeaturedSeries(seriesWithEntries);
          setPosts(regularPosts);
        } else {
          // Handle case where no posts are returned
          setPosts([]);
          setError("No blog posts available.");
        }
      } catch (error) {
        // Handle any errors that occur during fetching
        setError("Failed to load blog posts. Please try again later.");
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

        {/* Blog content */}
        <div className="max-w-4xl mx-auto">
          {/* Featured Series component */}
          {featuredSeries.length > 0 && (
            <FeaturedSeries series={featuredSeries} />
          )}
          
          {/* Regular Blog Posts */}
          {posts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">Latest Articles</h3>
              <BlogList
                posts={posts}
                loading={loading}
                error={error}
              />
            </div>
          )}
          
          {/* Loading and error states */}
          {loading && !posts.length && !featuredSeries.length && (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-center">
                <p className="text-gray-500">Loading blog posts...</p>
              </div>
            </div>
          )}
          
          {error && !loading && !posts.length && !featuredSeries.length && (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <p className="text-red-500">{error}</p>
              </div>
            </div>
          )}
          
          {/* Link to blog page if there are posts */}
          {(posts.length > 0 || featuredSeries.length > 0) && (
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
