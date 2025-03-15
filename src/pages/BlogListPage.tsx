
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { loadAllBlogPosts, type BlogPost } from "@/services/blog";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BlogList from "@/components/BlogList";

const BlogListPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Function to fetch all blog posts
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await loadAllBlogPosts();
        
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

          {/* Blog Posts */}
          <BlogList
            posts={posts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
