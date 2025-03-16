
---
slug: evolving-postgresql-chapter-4
title: "Chapter 4: The Burden of Bloat – Using pg_repack"
excerpt: Over time, PostgreSQL tables develop bloat that degrades performance. Learn how to reclaim space and improve query speed without downtime.
date: March 15, 2024
readTime: 14 min read
categories:
  - Database
  - PostgreSQL
  - DevOps
icon: Database
iconColor: blue
isSeriesEntry: true
seriesSlug: evolving-postgresql-without-breaking-things
seriesTitle: Evolving PostgreSQL Without Breaking the World
chapterTitle: "Chapter 4: The Burden of Bloat – Using pg_repack"
chapterNumber: 4
previousChapter: evolving-postgresql-chapter-3
previousChapterTitle: "Chapter 3: The Challenge of Foreign Keys"
nextChapter: evolving-postgresql-chapter-5
nextChapterTitle: "Chapter 5: Observing Migrations in Production"
---

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
