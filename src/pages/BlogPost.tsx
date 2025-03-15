import Navbar from "@/components/Navbar";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Database, Server, Code, ExternalLink } from "lucide-react";
import { createBlogPostContent } from "../utils/blogUtils";

const posts = [
{
  slug: "evolving-postgresql-without-breaking-things",
  title: "Evolving PostgreSQL Without Breaking the World",
  excerpt:
    "PostgreSQL is built for integrity, but applications demand agility. How do you evolve a live database without halting the system? This guide explores zero-downtime migration techniques—concurrent indexing, safe foreign keys, and schema changes that preserve uptime.",
  date: "March 15, 2024",
  readTime: "40 min read",
  categories: ["Database", "PostgreSQL", "DevOps", "Django"],
  icon: <Database className="w-6 h-6 text-blue-600" />,
  content: `
    <p>To change a database is to change the world in miniature. It is an act of transformation, of restructuring something vast and interconnected while it continues to pulse with life. The database does not pause for us; it does not yield easily to our aspirations. Its architecture is built on the principles of order, consistency, and unbreakable rules. And yet, we must change it, we must move forward—without halting time itself.</p>

    <p>In this journey, we will encounter resistance. PostgreSQL does not allow change without consequence. Every modification is an assertion of control over the system, an attempt to impose new order upon a structure already settled into its form. But we have tools. We have techniques. We can navigate this process, ensuring that the database evolves without collapsing under the weight of its own integrity.</p>

    <h2>Prologue: The Immutable and the Changing</h2>
    <p>It began with a simple requirement: enforce uniqueness on the <code>email</code> field in our <code>users</code> table. A trivial change, or so we thought.</p>

    <pre><code class="language-python">
class User(models.Model):
    email = models.CharField(max_length=255)  # The past: free, unrestricted
    </code></pre>

    <p>Our goal:</p>

    <pre><code class="language-python">
email = models.CharField(max_length=255, unique=True)  # The future: structured, ordered
    </code></pre>

    <p>The request seemed innocent. But PostgreSQL sees differently. To apply a uniqueness constraint, it must inspect every row, verify every entry, ensure that order has always existed in a structure that was previously indifferent to it.</p>

    <h2>Chapter 1: The Price of Order</h2>
    <p>PostgreSQL enforces its rules through a formidable mechanism: the <strong>AccessExclusiveLock</strong>. When modifying a table’s schema, the database halts operations, preventing all writes, reads, and transactions until the change is complete.</p>

    <p>Consider this naive approach:</p>

    <pre><code class="language-sql">
-- A dangerous change that will lock the entire table
ALTER TABLE users_user ADD CONSTRAINT users_email_unique UNIQUE(email);
    </code></pre>

    <p>On a small table, this would be instant. On a table with millions of records, it could take minutes—or longer. During this time, all queries that depend on this table will queue up, waiting for the migration to finish. The application will freeze. Users will see timeouts. Customer support will flood with complaints. And all because we asked PostgreSQL to enforce a rule that was not there before.</p>

    <p>But we are not without options. There is a way to achieve order without bringing the system to its knees.</p>

    <h2>Chapter 2: Parallel Evolution – Creating Indexes Concurrently</h2>
    <p>In 2001, PostgreSQL introduced a new approach: <strong>concurrent indexing</strong>. Instead of freezing the system while building an index, it constructs it in the background.</p>

    <pre><code class="language-sql">
-- A safe approach: create a unique index without locking writes
CREATE UNIQUE INDEX CONCURRENTLY users_email_idx ON users_user(email);
    </code></pre>

    <p>This method allows us to build the index while the system remains live. Here's how it works:</p>
    <ul>
      <li><strong>Snapshot phase:</strong> PostgreSQL takes a static view of existing data.</li>
      <li><strong>Incremental build:</strong> It constructs the index while tracking new changes.</li>
      <li><strong>Final validation:</strong> It briefly locks the table to verify consistency before finalizing the index.</li>
    </ul>

    <p>It is not without cost—this method is slower, requiring twice as much disk space during the process. But it allows the system to breathe.</p>

    <h3>Applying This in Django</h3>
    <p>Since Django’s migration system does not natively support concurrent indexes, we must use a special approach:</p>

    <pre><code class="language-python">
# migrations/0002_safe_unique_email.py
from django.db import migrations

operations = [
    migrations.SeparateDatabaseAndState(
        database_operations=[
            migrations.RunSQL(
                "CREATE UNIQUE INDEX CONCURRENTLY users_email_uniq ON users_user(email);",
                reverse_sql="DROP INDEX CONCURRENTLY users_email_uniq;"
            )
        ],
        state_operations=[
            migrations.AlterField(
                model_name='user',
                name='email',
                field=models.EmailField(unique=True),
            )
        ]
    ),
]
    </code></pre>

    <p>By separating the database operation from Django’s model state, we ensure that the system does not attempt to enforce the constraint in a way that would trigger unnecessary locks.</p>

    <h2>Chapter 3: The Challenge of Foreign Keys</h2>
    <p>Foreign keys are another enforcer of order, ensuring referential integrity. But adding them retroactively to an existing table can be devastating.</p>

    <p>A naive approach:</p>

    <pre><code class="language-sql">
ALTER TABLE users_user ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams_team(id);
    </code></pre>

    <p>PostgreSQL, upon encountering this command, will immediately scan the entire table, locking it until it is certain that no orphaned records exist. In an active system, this is unacceptable.</p>

    <h3>The Alternative: Deferred Validation</h3>
    <p>PostgreSQL allows us to add a foreign key constraint without validating it immediately:</p>

    <pre><code class="language-sql">
-- Step 1: Add the column without constraints
ALTER TABLE users_user ADD COLUMN team_id INT NULL;

-- Step 2: Create an index on the column
CREATE INDEX CONCURRENTLY idx_users_team_id ON users_user(team_id);

-- Step 3: Add the foreign key constraint, but defer validation
ALTER TABLE users_user 
ADD CONSTRAINT fk_user_team 
FOREIGN KEY (team_id) 
REFERENCES teams_team(id) 
NOT VALID;
    </code></pre>

    <p>Later, when the system can afford the validation step:</p>

    <pre><code class="language-sql">
ALTER TABLE users_user VALIDATE CONSTRAINT fk_user_team;
    </code></pre>

    <h3>The Django Equivalent</h3>
    <pre><code class="language-python">
# migrations/0003_add_team_fk.py
from django.db import migrations, models

operations = [
    migrations.SeparateDatabaseAndState(
        database_operations=[
            migrations.RunSQL(
                "ALTER TABLE users_user ADD COLUMN team_id INT NULL;",
                reverse_sql="ALTER TABLE users_user DROP COLUMN team_id;"
            ),
            migrations.RunSQL(
                "ALTER TABLE users_user ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams_team(id) NOT VALID;",
                reverse_sql="ALTER TABLE users_user DROP CONSTRAINT fk_user_team;"
            )
        ],
        state_operations=[
            migrations.AddField(
                model_name='user',
                name='team',
                field=models.ForeignKey(null=True, on_delete=models.SET_NULL, to='teams.Team'),
            )
        ]
    ),
    migrations.RunSQL(
        "ALTER TABLE users_user VALIDATE CONSTRAINT fk_user_team;",
        reverse_sql=migrations.RunSQL.noop
    )
]
    </code></pre>

    <p>Through this process, we make peace with PostgreSQL, navigating between its demand for integrity and our need for uptime.</p>

    <h2>Chapter 4: The Burden of Bloat – Using pg_repack</h2>
<p>Time leaves its mark on a database. It grows, shifts, and accumulates inefficiencies—wasted space from deleted rows, fragmented data pages, indexes that no longer fit neatly within memory. PostgreSQL does not clean up after itself perfectly; it relies on <code>AUTOVACUUM</code>, a background process that tidies up table bloat when the system allows.</p>

<p>But some problems outgrow <code>AUTOVACUUM</code>. A heavily updated table, rewritten thousands of times per second, accumulates so much overhead that queries slow down, indexes swell beyond reason, and storage consumption spirals upward. The traditional solution? <code>VACUUM FULL</code>. But like many ancient remedies, it comes with a cost—table-wide locks.</p>

<pre><code class="language-sql">
-- VACUUM FULL rewrites the entire table but locks it for the duration
VACUUM FULL users_user;
</code></pre>

<p>To call this method a disruption would be an understatement. The entire table becomes inaccessible until the operation is complete. Reads, writes, and transactions—everything halts. If the table is small, the lock is brief. If the table is large, it is an eternity.</p>

<h3>The Alternative: pg_repack</h3>
<p>In 2013, PostgreSQL developers introduced <a href="https://reorg.github.io/pg_repack/" target="_blank">pg_repack</a>, a tool designed to clean up tables without blocking operations. Instead of locking the table, it creates a temporary duplicate, repopulates it in the background, and atomically swaps it with the original.</p>

<pre><code class="language-bash">
# Install pg_repack (if not installed)
sudo apt install postgresql-14-repack  # Debian-based systems
brew install pg_repack  # macOS

# Run pg_repack on a bloated table
pg_repack --table=users_user --jobs=4
</code></pre>

<h3>How It Works</h3>
<p>Unlike <code>VACUUM FULL</code>, which locks the table while rewriting it, <code>pg_repack</code> follows a more careful process:</p>
<ul>
  <li><strong>Step 1:</strong> Creates a shadow table with an identical schema.</li>
  <li><strong>Step 2:</strong> Copies rows from the original table into the shadow table.</li>
  <li><strong>Step 3:</strong> Applies any new changes that happened during the copy.</li>
  <li><strong>Step 4:</strong> Swaps the tables in a single atomic operation.</li>
</ul>

<p>The final swap is instantaneous. PostgreSQL never sees an inconsistent state, and queries remain functional throughout the process.</p>

<h3>When to Use pg_repack</h3>
<p><code>pg_repack</code> is useful when:</p>
<ul>
  <li>The table has severe bloat from high write/delete activity.</li>
  <li>Indexes have grown inefficient due to fragmentation.</li>
  <li>Disk usage has increased significantly despite removing data.</li>
  <li>Queries have slowed down, and <code>AUTOVACUUM</code> is insufficient.</li>
</ul>
 
<h2>Chapter 5: Observing Migrations in Production</h2>
<p>In the realm of databases, visibility is survival. To migrate a system while it is alive—to change it without stopping its pulse—we must see everything. Every long-running query, every locking transaction, every blocked process: these are the signals, the whispers of PostgreSQL telling us when something is wrong.</p>

<p>Running a migration in production is not an act of blind faith. It is an exercise in watchfulness, in keeping one hand on the system’s pulse while the other reshapes its structure. Without observation, even the most carefully planned migration can become a silent catastrophe.</p>

<h3>Watching for Long-Running Queries</h3>
<p>Before starting a migration, and certainly while it is in progress, we must monitor queries that take too long. A migration can only proceed smoothly if we understand what else the database is doing.</p>

<pre><code class="language-sql">
-- Identify queries that have been running for more than 1 minute
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle' AND now() - query_start > interval '1 minute'
ORDER BY duration DESC;
</code></pre>

<p><strong>What this tells us:</strong></p>
<ul>
  <li>It exposes long-running queries that may interfere with a migration.</li>
  <li>If an index creation or schema change is running too long, this will reveal it.</li>
  <li>It allows us to make a decision: wait, or intervene?</li>
</ul>

<h3>Identifying Blocking Locks</h3>
<p>PostgreSQL is a patient gatekeeper. If a migration requires a lock, it will wait. And if another query is holding that lock, everything behind it will queue. The longer the queue, the more pressure builds, until finally—timeouts, failures, and rolling errors spread across the application.</p>

<pre><code class="language-sql">
-- Identify transactions that are waiting for a lock
SELECT blocking.pid AS blocking_pid, blocked.pid AS blocked_pid, 
       blocking.query AS blocking_query, blocked.query AS blocked_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
ON blocked.wait_event_type = 'Lock' AND blocked.wait_event IS NOT NULL
AND blocked.wait_event = blocking.wait_event
ORDER BY blocking_pid;
</code></pre>

<p><strong>What this tells us:</strong></p>
<ul>
  <li>It reveals which queries are blocking others.</li>
  <li>It helps us determine if a migration is stalled due to an uncommitted transaction.</li>
  <li>It shows whether user queries (e.g., long-running reports) are affecting migrations.</li>
</ul>

<h3>Tracking Index Creation Progress</h3>
<p>Creating an index <code>CONCURRENTLY</code> allows us to avoid locking writes, but it can still take time. It is important to know how far along an index creation process is.</p>

<pre><code class="language-sql">
-- Check the progress of active index creation
SELECT pid, phase, index_relid::regclass, 
       now() - query_start AS duration, query
FROM pg_stat_progress_create_index;
</code></pre>

<p><strong>What this tells us:</strong></p>
<ul>
  <li>It tracks the <code>CREATE INDEX CONCURRENTLY</code> process.</li>
  <li>It reveals whether an index build is stuck in validation.</li>
  <li>It helps us estimate how much longer an index creation will take.</li>
</ul>

<h3>Finding and Terminating Problem Queries</h3>
<p>Sometimes, a query must die. A migration cannot proceed if a long-running transaction refuses to yield. But we must tread carefully. Killing queries arbitrarily can cause errors, lost work, and rollback storms.</p>

<h4>Canceling a Query (Gentle Approach)</h4>
<p>First, we attempt to cancel the query gracefully:</p>

<pre><code class="language-sql">
-- Cancel a long-running query without terminating the backend process
SELECT pg_cancel_backend(pid) 
FROM pg_stat_activity 
WHERE now() - query_start > interval '5 minutes';
</code></pre>

<p>This sends a soft termination signal. If the query can be safely canceled, it will stop.</p>

<h4>Forcibly Terminating a Query (Last Resort)</h4>
<p>If cancellation does not work, we must remove the process entirely:</p>

<pre><code class="language-sql">
-- Kill a query by terminating the backend process
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE now() - query_start > interval '10 minutes';
</code></pre>

<p><strong>When to use termination:</strong></p>
<ul>
  <li>When a query has been running far beyond an acceptable threshold.</li>
  <li>When blocking locks are preventing migrations from proceeding.</li>
  <li>When a migration is failing because a process is stuck in an uncommitted state.</li>
</ul>

<h3>Keeping Watch During a Migration</h3>
<p>It is not enough to check once and walk away. Migration observability is an ongoing process. Some habits that ensure smooth transitions:</p>
<ul>
  <li>Run <code>pg_stat_activity</code> every few minutes to watch for slow queries.</li>
  <li>Check <code>pg_stat_progress_create_index</code> when creating large indexes.</li>
  <li>Use <code>pg_stat_replication</code> to ensure streaming replication isn't lagging due to a migration.</li>
  <li>Set up an alerting system to notify when queries exceed a reasonable execution time.</li>
</ul>

    <h2>Final Thoughts</h2>
    <p>PostgreSQL does not resist change—it resists careless change. By understanding its mechanisms, we find ways to move forward while preserving the system’s integrity. We do not break its rules; we learn to work within them.</p>
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
