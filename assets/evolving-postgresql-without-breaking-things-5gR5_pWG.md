
---
slug: "evolving-postgresql-without-breaking-things"
title: "Evolving PostgreSQL Without Breaking the World"
excerpt: "PostgreSQL is built for integrity, but applications demand agility. How do you evolve a live database without halting the system? This guide explores zero-downtime migration techniques—concurrent indexing, safe foreign keys, and schema changes that preserve uptime."
date: "March 15, 2024"
readTime: "10 min read"
categories: ["Database", "PostgreSQL", "DevOps", "Django"]
icon: "Database"
---

To change a database is to change the world in miniature. It is an act of transformation, of restructuring something vast and interconnected while it continues to pulse with life. The database does not pause for us; it does not yield easily to our aspirations. Its architecture is built on the principles of order, consistency, and unbreakable rules. And yet, we must change it, we must move forward—without halting time itself.

In this journey, we will encounter resistance. PostgreSQL does not allow change without consequence. Every modification is an assertion of control over the system, an attempt to impose new order upon a structure already settled into its form. But we have tools. We have techniques. We can navigate this process, ensuring that the database evolves without collapsing under the weight of its own integrity.

## Prologue: The Immutable and the Changing

It began with a simple requirement: enforce uniqueness on the `email` field in our `users` table. A trivial change, or so we thought.

```python
class User(models.Model):
    email = models.CharField(max_length=255)  # The past: free, unrestricted
```

Our goal:

```python
email = models.CharField(max_length=255, unique=True)  # The future: structured, ordered
```

The request seemed innocent. But PostgreSQL sees differently. To apply a uniqueness constraint, it must inspect every row, verify every entry, ensure that order has always existed in a structure that was previously indifferent to it.

## Chapter 1: The Price of Order

PostgreSQL enforces its rules through a formidable mechanism: the **AccessExclusiveLock**. When modifying a table's schema, the database halts operations, preventing all writes, reads, and transactions until the change is complete.

Consider this naive approach:

```sql
-- A dangerous change that will lock the entire table
ALTER TABLE users_user ADD CONSTRAINT users_email_unique UNIQUE(email);
```

On a small table, this would be instant. On a table with millions of records, it could take minutes—or longer. During this time, all queries that depend on this table will queue up, waiting for the migration to finish. The application will freeze. Users will see timeouts. Customer support will flood with complaints. And all because we asked PostgreSQL to enforce a rule that was not there before.

But we are not without options. There is a way to achieve order without bringing the system to its knees.

## Chapter 2: Parallel Evolution – Creating Indexes Concurrently

In 2001, PostgreSQL introduced a new approach: **concurrent indexing**. Instead of freezing the system while building an index, it constructs it in the background.

```sql
-- A safe approach: create a unique index without locking writes
CREATE UNIQUE INDEX CONCURRENTLY users_email_idx ON users_user(email);
```

This method allows us to build the index while the system remains live. Here's how it works:
- **Snapshot phase:** PostgreSQL takes a static view of existing data.
- **Incremental build:** It constructs the index while tracking new changes.
- **Final validation:** It briefly locks the table to verify consistency before finalizing the index.

It is not without cost—this method is slower, requiring twice as much disk space during the process. But it allows the system to breathe.

### Applying This in Django

Since Django's migration system does not natively support concurrent indexes, we must use a special approach:

```python
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
```

By separating the database operation from Django's model state, we ensure that the system does not attempt to enforce the constraint in a way that would trigger unnecessary locks.

## Chapter 3: The Challenge of Foreign Keys

Foreign keys are another enforcer of order, ensuring referential integrity. But adding them retroactively to an existing table can be devastating.

A naive approach:

```sql
ALTER TABLE users_user ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams_team(id);
```

PostgreSQL, upon encountering this command, will immediately scan the entire table, locking it until it is certain that no orphaned records exist. In an active system, this is unacceptable.

### The Alternative: Deferred Validation

PostgreSQL allows us to add a foreign key constraint without validating it immediately:

```sql
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
```

Later, when the system can afford the validation step:

```sql
ALTER TABLE users_user VALIDATE CONSTRAINT fk_user_team;
```

### The Django Equivalent

```python
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
```

Through this process, we make peace with PostgreSQL, navigating between its demand for integrity and our need for uptime.

## Chapter 4: The Burden of Bloat – Using pg_repack

Time leaves its mark on a database. It grows, shifts, and accumulates inefficiencies—wasted space from deleted rows, fragmented data pages, indexes that no longer fit neatly within memory. PostgreSQL does not clean up after itself perfectly; it relies on `AUTOVACUUM`, a background process that tidies up table bloat when the system allows.

But some problems outgrow `AUTOVACUUM`. A heavily updated table, rewritten thousands of times per second, accumulates so much overhead that queries slow down, indexes swell beyond reason, and storage consumption spirals upward. The traditional solution? `VACUUM FULL`. But like many ancient remedies, it comes with a cost—table-wide locks.

```sql
-- VACUUM FULL rewrites the entire table but locks it for the duration
VACUUM FULL users_user;
```

To call this method a disruption would be an understatement. The entire table becomes inaccessible until the operation is complete. Reads, writes, and transactions—everything halts. If the table is small, the lock is brief. If the table is large, it is an eternity.

### The Alternative: pg_repack

In 2013, PostgreSQL developers introduced [pg_repack](https://reorg.github.io/pg_repack/), a tool designed to clean up tables without blocking operations. Instead of locking the table, it creates a temporary duplicate, repopulates it in the background, and atomically swaps it with the original.

```bash
# Install pg_repack (if not installed)
sudo apt install postgresql-14-repack  # Debian-based systems
brew install pg_repack  # macOS

# Run pg_repack on a bloated table
pg_repack --table=users_user --jobs=4
```

### How It Works

Unlike `VACUUM FULL`, which locks the table while rewriting it, `pg_repack` follows a more careful process:
- **Step 1:** Creates a shadow table with an identical schema.
- **Step 2:** Copies rows from the original table into the shadow table.
- **Step 3:** Applies any new changes that happened during the copy.
- **Step 4:** Swaps the tables in a single atomic operation.

The final swap is instantaneous. PostgreSQL never sees an inconsistent state, and queries remain functional throughout the process.

### When to Use pg_repack

`pg_repack` is useful when:
- The table has severe bloat from high write/delete activity.
- Indexes have grown inefficient due to fragmentation.
- Disk usage has increased significantly despite removing data.
- Queries have slowed down, and `AUTOVACUUM` is insufficient.
 
## Chapter 5: Observing Migrations in Production

In the realm of databases, visibility is survival. To migrate a system while it is alive—to change it without stopping its pulse—we must see everything. Every long-running query, every locking transaction, every blocked process: these are the signals, the whispers of PostgreSQL telling us when something is wrong.

Running a migration in production is not an act of blind faith. It is an exercise in watchfulness, in keeping one hand on the system's pulse while the other reshapes its structure. Without observation, even the most carefully planned migration can become a silent catastrophe.

### Watching for Long-Running Queries

Before starting a migration, and certainly while it is in progress, we must monitor queries that take too long. A migration can only proceed smoothly if we understand what else the database is doing.

```sql
-- Identify queries that have been running for more than 1 minute
SELECT pid, now() - query_start AS duration, query
FROM pg_stat_activity
WHERE state != 'idle' AND now() - query_start > interval '1 minute'
ORDER BY duration DESC;
```

**What this tells us:**
- It exposes long-running queries that may interfere with a migration.
- If an index creation or schema change is running too long, this will reveal it.
- It allows us to make a decision: wait, or intervene?

### Identifying Blocking Locks

PostgreSQL is a patient gatekeeper. If a migration requires a lock, it will wait. And if another query is holding that lock, everything behind it will queue. The longer the queue, the more pressure builds, until finally—timeouts, failures, and rolling errors spread across the application.

```sql
-- Identify transactions that are waiting for a lock
SELECT blocking.pid AS blocking_pid, blocked.pid AS blocked_pid, 
       blocking.query AS blocking_query, blocked.query AS blocked_query
FROM pg_stat_activity blocked
JOIN pg_stat_activity blocking
ON blocked.wait_event_type = 'Lock' AND blocked.wait_event IS NOT NULL
AND blocked.wait_event = blocking.wait_event
ORDER BY blocking_pid;
```

**What this tells us:**
- It reveals which queries are blocking others.
- It helps us determine if a migration is stalled due to an uncommitted transaction.
- It shows whether user queries (e.g., long-running reports) are affecting migrations.

### Tracking Index Creation Progress

Creating an index `CONCURRENTLY` allows us to avoid locking writes, but it can still take time. It is important to know how far along an index creation process is.

```sql
-- Check the progress of active index creation
SELECT pid, phase, index_relid::regclass, 
       now() - query_start AS duration, query
FROM pg_stat_progress_create_index;
```

**What this tells us:**
- It tracks the `CREATE INDEX CONCURRENTLY` process.
- It reveals whether an index build is stuck in validation.
- It helps us estimate how much longer an index creation will take.

### Finding and Terminating Problem Queries

Sometimes, a query must die. A migration cannot proceed if a long-running transaction refuses to yield. But we must tread carefully. Killing queries arbitrarily can cause errors, lost work, and rollback storms.

#### Canceling a Query (Gentle Approach)

First, we attempt to cancel the query gracefully:

```sql
-- Cancel a long-running query without terminating the backend process
SELECT pg_cancel_backend(pid) 
FROM pg_stat_activity 
WHERE now() - query_start > interval '5 minutes';
```

This sends a soft termination signal. If the query can be safely canceled, it will stop.

#### Forcibly Terminating a Query (Last Resort)

If cancellation does not work, we must remove the process entirely:

```sql
-- Kill a query by terminating the backend process
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE now() - query_start > interval '10 minutes';
```

**When to use termination:**
- When a query has been running far beyond an acceptable threshold.
- When blocking locks are preventing migrations from proceeding.
- When a migration is failing because a process is stuck in an uncommitted state.

### Keeping Watch During a Migration

It is not enough to check once and walk away. Migration observability is an ongoing process. Some habits that ensure smooth transitions:
- Run `pg_stat_activity` every few minutes to watch for slow queries.
- Check `pg_stat_progress_create_index` when creating large indexes.
- Use `pg_stat_replication` to ensure streaming replication isn't lagging due to a migration.
- Set up an alerting system to notify when queries exceed a reasonable execution time.

## Final Thoughts

PostgreSQL does not resist change—it resists careless change. By understanding its mechanisms, we find ways to move forward while preserving the system's integrity. We do not break its rules; we learn to work within them.
