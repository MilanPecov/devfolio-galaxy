
const posts = [
  {
    title: "Building High-Performance Ticketing Systems",
    excerpt:
      "Learn how we architected a system capable of handling over 100,000 bookings per minute using modern cloud infrastructure.",
    date: "March 15, 2024",
    readTime: "10 min read",
    categories: ["Architecture", "Cloud", "Performance"],
  },
  {
    title: "Scaling Django Applications with Kubernetes",
    excerpt:
      "A deep dive into our journey of scaling Django applications using Kubernetes and Google Cloud Platform.",
    date: "March 10, 2024",
    readTime: "8 min read",
    categories: ["Backend", "Infrastructure", "DevOps"],
  },
  {
    title: "Event-Driven Architecture in Practice",
    excerpt:
      "How we implemented event-driven architecture using RabbitMQ and Kafka to handle high-throughput ticketing operations.",
    date: "March 5, 2024",
    readTime: "12 min read",
    categories: ["System Design", "Backend", "Architecture"],
  },
];

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-[#E2E8F0] rounded-full text-sm font-medium mb-4">
            Technical Insights
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-4">
            Engineering Blog
          </h2>
          <p className="text-gray-600">
            Sharing experiences and insights from building large-scale systems.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up border border-[#E2E8F0] hover:border-[#CBD5E1]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 bg-[#F1F5F9] text-[#475569] rounded text-xs font-medium"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1E293B]">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              </div>
              <a
                href="#"
                className="inline-block text-[#1E293B] font-medium hover:text-[#475569] transition-colors"
              >
                Read More →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
