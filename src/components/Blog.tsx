
const posts = [
  {
    title: "Building Scalable React Applications",
    excerpt:
      "Learn the best practices for building large-scale React applications with optimal performance.",
    date: "March 15, 2024",
    readTime: "5 min read",
  },
  {
    title: "Modern CSS Techniques",
    excerpt:
      "Exploring modern CSS features and techniques for better web development.",
    date: "March 10, 2024",
    readTime: "4 min read",
  },
  {
    title: "Getting Started with TypeScript",
    excerpt:
      "A comprehensive guide to start using TypeScript in your JavaScript projects.",
    date: "March 5, 2024",
    readTime: "6 min read",
  },
];

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-2 bg-primary rounded-full text-sm font-medium mb-4">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600">
            Sharing knowledge and experiences in web development.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600">{post.excerpt}</p>
              </div>
              <a
                href="#"
                className="inline-block text-gray-900 font-medium hover:text-gray-600 transition-colors"
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
