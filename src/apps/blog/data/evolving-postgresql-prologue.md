---
slug: evolving-postgresql-prologue
title: "Prologue: The Immutable and the Changing"
excerpt: The introduction to our PostgreSQL evolution journey begins with a seemingly simple change that reveals the fundamental tension between database integrity and application agility.
date: March 15, 2024
readTime: 10 min read
categories:
  - Database
  - PostgreSQL
  - DevOps
icon: Database
iconColor: blue
isSeriesEntry: true
seriesSlug: evolving-postgresql-without-breaking-things
seriesTitle: "Evolving PostgreSQL Without Breaking the World"
chapterTitle: "Prologue: The Immutable and the Changing"
chapterNumber: 0
nextChapter: evolving-postgresql-chapter-1
nextChapterTitle: "Chapter 1: The Price of Order"
---

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

And thus begins our journey into the world of PostgreSQL migrations, where we'll learn to navigate the tension between the database's need for integrity and our application's demand for continuous availability.
