
import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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

      <h2>Implementation Example</h2>
      <p>Here's how we implemented our rate limiting using Python:</p>

      <pre><code class="language-python">
import redis
from functools import wraps
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def limit_requests(self, max_requests=100, window_seconds=60):
        def decorator(f):
            @wraps(f)
            async def wrapped(request, *args, **kwargs):
                key = f"rate_limit:{request.client_ip}"
                
                # Get current count
                current = await self.redis.get(key) or 0
                
                if int(current) >= max_requests:
                    raise Exception("Rate limit exceeded")
                
                # Increment and set expiry
                pipe = self.redis.pipeline()
                pipe.incr(key)
                pipe.expire(key, window_seconds)
                await pipe.execute()
                
                return await f(request, *args, **kwargs)
            return wrapped
        return decorator
      </code></pre>

      <p>And here's the corresponding frontend JavaScript code:</p>

      <pre><code class="language-javascript">
const handleBooking = async (eventId) => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        quantity: 1,
        timestamp: Date.now()
      })
    });

    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }

    const data = await response.json();
    return data.bookingId;
  } catch (error) {
    console.error('Booking failed:', error);
    throw error;
  }
};
      </code></pre>

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
        <div className="container mx-auto px-6 py-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Return home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(post.content, 'text/html');
    const elements: React.ReactNode[] = [];

    const processNode = (node: Node, index: number): React.ReactNode => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;

        // Handle code blocks
        if (element.tagName === 'PRE' && element.querySelector('code')) {
          const codeElement = element.querySelector('code');
          const language = codeElement?.className.replace('language-', '') || '';
          const code = codeElement?.textContent || '';

          return (
            <SyntaxHighlighter
              key={index}
              language={language}
              style={oneDark}
              className="rounded-lg !bg-[#1E293B] !p-4 my-4"
            >
              {code.trim()}
            </SyntaxHighlighter>
          );
        }

        // Handle other HTML elements
        const children: React.ReactNode[] = [];
        element.childNodes.forEach((child, childIndex) => {
          const processedChild = processNode(child, childIndex);
          if (processedChild) {
            children.push(processedChild);
          }
        });

        if (element.tagName === 'H2') {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{children}</h2>;
        }

        if (element.tagName === 'P') {
          return <p key={index} className="mb-4">{children}</p>;
        }

        return children;
      }

      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      return null;
    };

    doc.body.childNodes.forEach((node, index) => {
      const processedNode = processNode(node, index);
      if (processedNode) {
        elements.push(processedNode);
      }
    });

    return elements;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft size={20} />
            Back to all posts
          </Link>

          <div className="animate-fade-up">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>

            <h1 className="text-4xl font-bold text-[#1E293B] mb-4 text-left">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
              {renderContent()}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
