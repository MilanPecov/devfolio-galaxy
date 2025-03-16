
import { useEffect, useState } from "react";
import Navbar from "@/shared/components/Navbar";
import { useParams } from "react-router-dom";
import { blogController, type BlogPost as BlogPostType } from "@/apps/blog";
import { 
  BlogPostHeader,
  BlogPostContent,
  ChapterNavigation,
  SeriesChapterList
} from "@/apps/blog/ui/components";
import { LoadingState } from "@/apps/blog/ui/components/LoadingState";
import { ErrorState } from "@/apps/blog/ui/components/ErrorState";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [seriesChapters, setSeriesChapters] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingChapters, setLoadingChapters] = useState(false);

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
          
          // If this is a series main post, fetch all chapters
          if (postData.isSeries && postData.seriesSlug) {
            setLoadingChapters(true);
            const chapters = await blogController.getSeriesChapters(postData.seriesSlug);
            setSeriesChapters(chapters);
            setLoadingChapters(false);
          }
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
        <LoadingState />
      </div>
    );
  }

  // Show error state or not found
  if (error || !post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <ErrorState error={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <BlogPostHeader post={post} />
          <BlogPostContent post={post} />
          <ChapterNavigation post={post} />
          <SeriesChapterList 
            post={post} 
            seriesChapters={seriesChapters} 
            loading={loadingChapters} 
          />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
