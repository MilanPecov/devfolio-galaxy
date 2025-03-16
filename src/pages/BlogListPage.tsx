
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/shared/components/Navbar";
import { blogController, type BlogPost } from "@/apps/blog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import GroupedBlogList from "@/apps/blog/ui/components/GroupedBlogList";

const BlogListPage = () => {
  const [regularPosts, setRegularPosts] = useState<BlogPost[]>([]);
  const [seriesWithEntries, setSeriesWithEntries] = useState<{main: BlogPost, entries: BlogPost[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Function to fetch all blog posts
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await blogController.loadAllBlogPosts();
        
        // Check if posts were successfully loaded
        if (allPosts && allPosts.length > 0) {
          // Separate regular posts from series posts
          const regularPostsList = allPosts.filter(post => !post.isSeries && !post.isSeriesEntry);
          const seriesMainPosts = allPosts.filter(post => post.isSeries);
          
          // For each series, get its entries
          const seriesWithEntriesList = await Promise.all(
            seriesMainPosts.map(async (mainPost) => {
              if (mainPost.seriesSlug) {
                const entries = await blogController.getSeriesChapters(mainPost.seriesSlug);
                return { main: mainPost, entries };
              }
              return { main: mainPost, entries: [] };
            })
          );
          
          setRegularPosts(regularPostsList);
          setSeriesWithEntries(seriesWithEntriesList);
        } else {
          setRegularPosts([]);
          setSeriesWithEntries([]);
          setError("No blog posts available.");
        }
      } catch (error) {
        setError("Failed to load blog posts. Please try again later.");
        setRegularPosts([]);
        setSeriesWithEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
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
                <BreadcrumbPage>Blog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {/* Page Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
              Engineering Blog
            </h1>
            <p className="text-gray-600">
              Sharing experiences and insights from building large-scale systems.
            </p>
          </div>

          {/* Grouped Blog Posts */}
          <GroupedBlogList
            regularPosts={regularPosts}
            seriesWithEntries={seriesWithEntries}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
