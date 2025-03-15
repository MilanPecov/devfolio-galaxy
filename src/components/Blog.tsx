
import { Link } from "react-router-dom";
import { ArrowRight, Database, Code, Server } from "lucide-react";

// Reorder posts to put PostgreSQL post at the top
const posts = [
  {
    slug: "evolving-postgresql-without-breaking-things",
    title: "Evolving PostgreSQL Without Breaking the World",
    excerpt:
      "PostgreSQL is built for integrity, but applications demand agility. How do you evolve a live database without halting the system? This guide explores zero-downtime migration techniques—concurrent indexing, safe foreign keys, and schema changes that preserve uptime.",
    date: "March 15, 2024",
    readTime: "10 min read",
    categories: ["Database", "PostgreSQL", "DevOps", "Django"],
    icon: <Database className="w-6 h-6 text-blue-600" />,
  },
  {
    slug: "building-high-performance-ticketing-systems",
    title: "Building High-Performance Ticketing Systems",
    excerpt:
      "Learn how we architected a system capable of handling over 100,000 bookings per minute using modern cloud infrastructure.",
    date: "March 10, 2024",
    readTime: "8 min read",
    categories: ["Architecture", "Cloud", "Performance"],
    icon: <Server className="w-6 h-6 text-indigo-600" />,
  },
  {
    slug: "event-driven-architecture-in-practice",
    title: "Event-Driven Architecture in Practice",
    excerpt:
      "How we implemented event-driven architecture using RabbitMQ and Kafka to handle high-throughput ticketing operations.",
    date: "March 5, 2024",
    readTime: "12 min read",
    categories: ["System Design", "Backend", "Architecture"],
    icon: <Code className="w-6 h-6 text-emerald-600" />,
  },
];

const Blog = () => {
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

        {/* Changed from grid to flex column layout */}
        <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group relative bg-white rounded-xl p-8 hover:shadow-xl transition-all duration-500 animate-fade-up border border-gray-100 hover:border-gray-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="p-3 rounded-full bg-[#F8FAFC] md:self-start">
                  {post.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category) => (
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
      </div>
    </section>
  );
};

export default Blog;
