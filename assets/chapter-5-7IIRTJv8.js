const n=`
---
title: "Chapter 5: Observing Migrations in Production"
slug: chapter-5
order: 7
---

# Chapter 5: Observing Migrations in Production

In the realm of databases, visibility is survival. To migrate a system while it is alive—to change it without stopping its pulse—we must see everything. Every long-running query, every locking transaction, every blocked process: these are the signals, the whispers of PostgreSQL telling us when something is wrong.

Running a migration in production is not an act of blind faith. It is an exercise in watchfulness, in keeping one hand on the system's pulse while the other reshapes its structure. Without observation, even the most carefully planned migration can become a silent catastrophe.

### Watching for Long-Running Queries

Before starting a migration, and certainly while it is in progress, we must monitor queries that take too long. A migration can only proceed smoothly if we understand what else the database is doing.

\`\`\`sql
-- Identify queries that have been running for more than 1 minute
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle' AND now() - query_start > interval '1 minute'
ORDER BY duration DESC;
\`\`\`

**What this tells us:**
- It exposes long-running queries that may interfere with a migration.
- If an index creation or schema change is running too long, this will reveal it.
- It allows us to make a decision: wait, or intervene?

### Identifying Blocking Locks

PostgreSQL is a patient gatekeeper. If a migration requires a lock, it will wait. And if another query is holding that lock, everything behind it will queue. The longer the queue, the more pressure builds, until finally—timeouts, failures, and rolling errors spread across the application.

\`\`\`sql
-- Identify transactions that are waiting for a lock
SELECT blocking.pid AS blocking_pid, blocked.pid AS blocked_pid, 
       blocking.query AS blocking_query, blocked.query AS blocked_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
ON blocked.wait_event_type = 'Lock' AND blocked.wait_event IS NOT NULL
AND blocked.wait_event = blocking.wait_event
ORDER BY blocking_pid;
\`\`\`

**What this tells us:**
- It reveals which queries are blocking others.
- It helps us determine if a migration is stalled due to an uncommitted transaction.
- It shows whether user queries (e.g., long-running reports) are affecting migrations.

### Tracking Index Creation Progress

Creating an index \`CONCURRENTLY\` allows us to avoid locking writes, but it can still take time. It is important to know how far along an index creation process is.

\`\`\`sql
-- Check the progress of active index creation
SELECT pid, phase, index_relid::regclass, 
       now() - query_start AS duration, query
FROM pg_stat_progress_create_index;
\`\`\`

**What this tells us:**
- It tracks the \`CREATE INDEX CONCURRENTLY\` process.
- It reveals whether an index build is stuck in validation.
- It helps us estimate how much longer an index creation will take.

### Finding and Terminating Problem Queries

Sometimes, a query must die. A migration cannot proceed if a long-running transaction refuses to yield. But we must tread carefully. Killing queries arbitrarily can cause errors, lost work, and rollback storms.

#### Canceling a Query (Gentle Approach)

First, we attempt to cancel the query gracefully:

\`\`\`sql
-- Cancel a long-running query without terminating the backend process
SELECT pg_cancel_backend(pid) 
FROM pg_stat_activity 
WHERE now() - query_start > interval '5 minutes';
\`\`\`

This sends a soft termination signal. If the query can be safely canceled, it will stop.

#### Forcibly Terminating a Query (Last Resort)

If cancellation does not work, we must remove the process entirely:

\`\`\`sql
-- Kill a query by terminating the backend process
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE now() - query_start > interval '10 minutes';
\`\`\`

**When to use termination:**
- When a query has been running far beyond an acceptable threshold.
- When blocking locks are preventing migrations from proceeding.
- When a migration is failing because a process is stuck in an uncommitted state.

### Keeping Watch During a Migration

It is not enough to check once and walk away. Migration observability is an ongoing process. Some habits that ensure smooth transitions:
- Run \`pg_stat_activity\` every few minutes to watch for slow queries.
- Check \`pg_stat_progress_create_index\` when creating large indexes.
- Use \`pg_stat_replication\` to ensure streaming replication isn't lagging due to a migration.
- Set up an alerting system to notify when queries exceed a reasonable execution time.
`;export{n as default};
