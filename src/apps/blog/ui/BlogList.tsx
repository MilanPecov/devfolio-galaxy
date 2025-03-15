import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { type BlogPost } from "@/apps/blog";

interface BlogListProps {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

const BlogList = ({ posts, loading, error }: BlogListProps) => {
  return (
    <>
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        </div>
      ) : error ? (
        // Error state
        <div className="flex justify-center py-12">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      ) : posts && posts.length > 0 ? (
        // Blog posts list
        <div className="flex flex-col space-y-8">
          {posts.map((post, index) => (
            <article
              key={post.slug || index}
              className="group relative bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 animate-fade-up border border-gray-100 hover:border-gray-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Post icon */}
                <div className="p-3 rounded-full bg-[#F8FAFC] md:self-start">
                  {post.icon}
                </div>
                <div className="flex-1 text-left">
                  {/* Post categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories && post.categories.map((category, catIndex) => (
                      <span
                        key={`${post.slug}-cat-${catIndex}`}
                        className="px-3 py-1 bg-[#1E293B]/5 text-[#1E293B] rounded-full text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  {/* Post metadata */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                  {/* Post title */}
                  <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[#1E293B] group-hover:text-[#334155] transition-colors text-left">
                    {post.title}
                  </h3>
                  {/* Post excerpt */}
                  <p className="text-gray-600 mb-6 text-left">
                    {post.excerpt}
                  </p>
                  {/* Read more link */}
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
        // Empty state - no posts available
        <div className="flex justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500">No blog posts available.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogList;
