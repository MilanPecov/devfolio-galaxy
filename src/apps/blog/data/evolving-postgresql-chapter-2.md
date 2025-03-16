---
slug: evolving-postgresql-chapter-2
title: "Chapter 2: Parallel Evolution – Creating Indexes Concurrently"
excerpt: Discover how to create indexes without locking your database, allowing reads and writes to continue while your constraints are built.
date: March 15, 2024
readTime: 15 min read
categories:
  - Database
  - PostgreSQL
  - DevOps
icon: Database
iconColor: blue
isSeriesEntry: true
seriesSlug: evolving-postgresql-without-breaking-things
seriesTitle: Evolving PostgreSQL Without Breaking the World
chapterTitle: "Chapter 2: Parallel Evolution – Creating Indexes Concurrently"
chapterNumber: 2
previousChapter: evolving-postgresql-chapter-1
previousChapterTitle: "Chapter 1: The Price of Order"
nextChapter: evolving-postgresql-chapter-3
nextChapterTitle: "Chapter 3: The Challenge of Foreign Keys"
---

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
