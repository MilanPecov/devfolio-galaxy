
import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const posts = [
  {
    slug: "building-high-performance-ticketing-systems",
    title: "Building High-Performance Ticketing Systems",
    excerpt:
      "Learn how we architected a system capable of handling over 100,000 bookings per minute using modern cloud infrastructure.",
    date: "March 15, 2024",
    readTime: "10 min read",
    categories: ["Architecture", "Cloud", "Performance"],
    content: `
      <h2>Introduction</h2>
      <p>At Showpass, we faced the challenge of building a ticketing system that could handle massive concurrent user load during high-demand event sales. This article details our journey in architecting a solution that can process over 100,000 bookings per minute.</p>

      <h2>The Challenge</h2>
      <p>High-demand events present unique technical challenges. When thousands of users attempt to purchase tickets simultaneously, traditional architectures often struggle to maintain consistency while delivering acceptable performance.</p>

      <h2>Our Solution</h2>
      <p>We implemented a distributed system using:</p>
      <ul>
        <li>Kubernetes for orchestration</li>
        <li>Redis for distributed locking</li>
        <li>ClickHouse for real-time analytics</li>
        <li>Event-driven architecture with Kafka</li>
      </ul>

      <h2>Results</h2>
      <p>The new architecture allowed us to handle peak loads of over 100,000 concurrent users while maintaining sub-second response times and ensuring transaction consistency.</p>
    `,
  },
  {
    slug: "scaling-django-applications-with-kubernetes",
    title: "Scaling Django Applications with Kubernetes",
    excerpt:
      "A deep dive into our journey of scaling Django applications using Kubernetes and Google Cloud Platform.",
    date: "March 10, 2024",
    readTime: "8 min read",
    categories: ["Backend", "Infrastructure", "DevOps"],
    content: `
      <h2>Introduction</h2>
      <p>As Showpass grew, we needed to scale our Django applications to handle increasing load. This article shares our experience migrating to Kubernetes and the lessons learned along the way.</p>

      <h2>Why Kubernetes?</h2>
      <p>We chose Kubernetes for its robust orchestration capabilities, automated scaling, and container management features. The transition wasn't without challenges, but the benefits have been substantial.</p>

      <h2>Implementation</h2>
      <p>Key aspects of our Kubernetes implementation:</p>
      <ul>
        <li>Containerization of Django applications</li>
        <li>Implementation of horizontal pod autoscaling</li>
        <li>Configuration of ingress controllers</li>
        <li>Setting up monitoring and logging</li>
      </ul>
    `,
  },
  {
    slug: "event-driven-architecture-in-practice",
    title: "Event-Driven Architecture in Practice",
    excerpt:
      "How we implemented event-driven architecture using RabbitMQ and Kafka to handle high-throughput ticketing operations.",
    date: "March 5, 2024",
    readTime: "12 min read",
    categories: ["System Design", "Backend", "Architecture"],
    content: `
      <h2>Introduction</h2>
      <p>Event-driven architecture has been crucial in building our scalable ticketing platform. This post explores how we use RabbitMQ and Kafka to handle complex ticketing workflows.</p>

      <h2>Why Event-Driven?</h2>
      <p>The ticketing industry presents unique challenges that make event-driven architecture particularly valuable. We'll explore the benefits and tradeoffs of this approach.</p>

      <h2>Implementation Details</h2>
      <p>Our event-driven architecture includes:</p>
      <ul>
        <li>Message queues for async processing</li>
        <li>Event sourcing for ticket transactions</li>
        <li>CQRS pattern implementation</li>
        <li>Real-time updates and notifications</li>
      </ul>
    `,
  },
];

const BlogPost = () => {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Return home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={20} />
            Back to all posts
          </Link>

          <div className="animate-fade-up">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-[#1E293B] mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>

            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
