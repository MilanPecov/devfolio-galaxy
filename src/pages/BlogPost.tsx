
import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Database, Server, Code } from "lucide-react";
import { createBlogPostContent } from "../utils/blogUtils";

const posts = [
  {
    slug: "zero-downtime-postgresql-migrations",
    title: "The Essential Guide to Zero-Downtime PostgreSQL Migrations in Production",
    excerpt:
      "Learn how to execute PostgreSQL schema changes without interrupting your service, using concurrent indexes, batched updates, and other battle-tested strategies.",
    date: "March 15, 2024",
    readTime: "10 min read",
    categories: ["Database", "PostgreSQL", "DevOps", "Django"],
    icon: <Database className="w-6 h-6 text-blue-600" />,
    content: `
      <p>When your business depends on PostgreSQL, migrations in production aren't just technical details—they're critical operations that can make or break user experience, revenue, and even your team's peace of mind. Imagine your database migration like performing open-heart surgery on your system: it demands precision, strategy, and readiness for unexpected complications.</p>
      
      <p>If you're running a Django application with PostgreSQL, here's your comprehensive guide to executing migrations seamlessly, minimizing risks, and maintaining uninterrupted service.</p>
      
      <h2>Why PostgreSQL Migrations Can Cause Downtime</h2>
      <p>Every PostgreSQL table corresponds to a physical file. Modifying schemas, such as adding constraints or changing column types, often requires PostgreSQL to rewrite these physical files, locking tables completely (AccessExclusiveLock). When a table is locked, your users experience interruptions ranging from sluggish responses to total service outages.</p>
      
      <p>Let's clarify this with a practical scenario:</p>
      
      <h3>The Dreaded Real-World Example: Locking Your User Table</h3>
      <p>Suppose you have a User table with millions of records:</p>

      <pre><code class="language-python">
class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)

# Desired change:
email = models.EmailField(unique=True)
      </code></pre>

      <p>A naive migration approach (ALTER TABLE ADD UNIQUE) can freeze the entire application for several minutes, resulting in HTTP 500 errors and angry customers.</p>

      <h2>Battle-Tested Strategies for Safe Migrations</h2>
      <p>Here are robust, actionable strategies to ensure zero-downtime migrations:</p>

      <h3>1. Concurrent Index Creation</h3>
      <p>Always use concurrent indexes to safely add uniqueness constraints without locking:</p>

      <pre><code class="language-sql">
CREATE UNIQUE INDEX CONCURRENTLY users_email_uniq ON users_user(email);
      </code></pre>

      <p>Concurrent indexes avoid long locks, allowing your app to operate seamlessly.</p>

      <h3>2. Delayed Constraint Validation</h3>
      <p>For foreign keys and other constraints, PostgreSQL supports delayed validations:</p>

      <pre><code class="language-sql">
ALTER TABLE users_user ADD CONSTRAINT fk_user_team 
FOREIGN KEY (team_id) REFERENCES teams_team(id) NOT VALID;

ALTER TABLE users_user VALIDATE CONSTRAINT fk_user_team;
      </code></pre>

      <p>This separates constraint checking from schema changes, significantly reducing downtime.</p>

      <h3>3. Decoupling Database and Django State</h3>
      <p>When Django's internal state diverges from the database schema:</p>

      <pre><code class="language-python">
SeparateDatabaseAndState(
    database_operations=[
        migrations.RunSQL(...)
    ],
    state_operations=[
        migrations.AlterField(...)
    ]
)
      </code></pre>

      <p>This approach keeps your Django models consistent without triggering disruptive locks.</p>

      <h3>4. Safe Table Rewrites with pg_repack</h3>
      <p>For column type changes or extensive table rewrites, use pg_repack:</p>

      <pre><code class="language-bash">
pg_repack -t users_user
      </code></pre>

      <p>It rebuilds tables with minimal locking, maintaining uninterrupted database availability.</p>

      <h3>5. Batched Data Updates</h3>
      <p>Perform large data backfills in manageable batches:</p>

      <pre><code class="language-python">
for users_batch in queryset_iterator(User.objects.all(), batch_size=1000):
    users.update(new_field=value)
      </code></pre>

      <p>Batches avoid extended locks and replication lag, making migrations manageable.</p>

      <h3>6. Lock Monitoring in Real-Time</h3>
      <p>Always monitor database activity to detect locks immediately:</p>

      <pre><code class="language-sql">
SELECT pid, now() - xact_start AS duration, left(query, 50) AS query_snippet, state
FROM pg_stat_activity
WHERE (now() - query_start) > interval '1 minute'
ORDER BY duration DESC;
      </code></pre>

      <p>Catching potential issues early prevents escalations into serious downtime.</p>

      <h2>Detailed Step-by-Step Example</h2>
      
      <h3>Safely Adding a Unique Email Constraint</h3>
      
      <h4>Step 1: Concurrent Index Creation</h4>
      <pre><code class="language-sql">
CREATE UNIQUE INDEX CONCURRENTLY users_email_uniq ON users_user(email);
      </code></pre>

      <h4>Step 2: Django Migration to Attach Constraint Safely</h4>
      <pre><code class="language-python">
class Migration(migrations.Migration):
    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql="ALTER TABLE users_user ADD CONSTRAINT email_unique UNIQUE USING INDEX users_email_uniq;",
                    reverse_sql="ALTER TABLE users_user DROP CONSTRAINT email_unique;"
                )
            ],
            state_operations=[
                migrations.AlterField(
                    model_name='user',
                    name='email',
                    field=models.EmailField(unique=True),
                )
            ]
        )
    ]
      </code></pre>

      <h3>Foreign Key Constraints with Minimal Risk</h3>
      <p>Follow a similar delayed validation approach:</p>
      <ul>
        <li>Add column as nullable</li>
        <li>Add constraint with NOT VALID</li>
        <li>Validate constraint separately</li>
      </ul>
      <p>This keeps your migrations smooth and transparent to users.</p>

      <h2>Emergency Preparedness Checklist</h2>
      
      <h3>Before Migration:</h3>
      <ul>
        <li>Test migrations on production-like datasets</li>
        <li>Prepare rollback scripts</li>
        <li>Set up lock monitoring tools</li>
      </ul>

      <h3>During Migration:</h3>
      <ul>
        <li>Monitor locks actively with pg_stat_activity</li>
        <li>Execute in non-atomic transactions</li>
      </ul>

      <h3>Post Migration:</h3>
      <ul>
        <li>Immediately validate constraints</li>
        <li>Monitor application performance closely</li>
        <li>Schedule clean-up with pg_repack</li>
      </ul>

      <h2>Design Philosophy: Expect Interruptions</h2>
      <p>A fundamental rule for successful migrations is to always design for interruption. A migration should gracefully handle unexpected connection drops, never leaving the database in an inconsistent state.</p>

      <h2>Final Thoughts</h2>
      <p>Zero-downtime PostgreSQL migrations aren't just about avoiding outages; they're about ensuring a seamless user experience and safeguarding your business reputation. By mastering these patterns, you're equipping yourself to handle migrations confidently, making your deployments robust and reliable.</p>
    `,
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
    slug: "event-driven-architecture-in-practice",
    title: "Event-Driven Architecture in Practice",
    excerpt:
      "How we implemented event-driven architecture using RabbitMQ and Kafka to handle high-throughput ticketing operations.",
    date: "March 5, 2024",
    readTime: "12 min read",
    categories: ["System Design", "Backend", "Architecture"],
    icon: <Code className="w-6 h-6 text-emerald-600" />,
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
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category}
                    className="px-3 py-1 bg-[#F1F5F9] text-[#475569] rounded-full text-sm font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
              <div className="p-2 rounded-full bg-[#F8FAFC]">
                {post.icon}
              </div>
            </div>

            <h1 className="text-4xl font-bold text-[#1E293B] mb-4 text-left">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:text-left prose-p:text-left prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-img:rounded-lg">
              {createBlogPostContent(post.content)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
