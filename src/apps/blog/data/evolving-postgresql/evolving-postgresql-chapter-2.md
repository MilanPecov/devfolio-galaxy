---
slug: evolving-postgresql-chapter-2
title: "Chapter 2: Whispers from the Heap"
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
chapterTitle: "Chapter 2: Whispers from the Heap"
chapterNumber: 2
previousChapter: evolving-postgresql-chapter-1
previousChapterTitle: "Chapter 1: Whispers to the Machine"
nextChapter: evolving-postgresql-chapter-3
nextChapterTitle: "Chapter 3: The Vows That Bind"
---
 
## —On Timelines, Shadows, and Silent Promises  

The Kairo Analytics office was unusually quiet that morning, the hum of the servers the only sign of movement. The usual rush of Slack notifications and frantic debugging had yet to begin.  

Leo arrived to find Marcus already seated, the glow of his terminal casting sharp lines across his face. He was studying something—numbers shifting across the screen in steady rhythm, as though tracing the pulse of a machine.  

Marcus spoke without looking up. 

*"Do you remember what we talked about yesterday?"*  

Leo set his coffee down carefully, recalling their discussion. 

*"That PostgreSQL doesn’t overwrite rows—it appends. That every update creates a new version instead of modifying the old one."*  

Marcus nodded slightly, still focused on his screen. 

*"Good. Now, tell me—what do you think happens to all those outdated versions?"*  

Leo hesitated. 

*"They... stay there?"*  

Marcus finally turned, giving Leo an approving glance. 

*"Exactly. The heap is a journal, Leo. It keeps every past version of a row until it is no longer needed."*  

Leo stepped forward, curiosity piqued. 

*"Can I see it?"*  

Marcus smirked, his fingers tapping the keyboard.  

```sql
SELECT ctid, xmin, xmax, email FROM users_user LIMIT 3;
```  

Rows appeared on the screen, but they didn’t look like the usual data Leo was used to:  

```
 ctid  | xmin | xmax |          email
-------+------+------+---------------------
 (0,1) | 7425 | 0    | user1@kairoanalyitics.ai
 (0,2) | 7425 | 0    | user2@kairoanalyitics.ai
 (0,3) | 7425 | 7431 | user3@kairoanalyitics.ai -- updated version
```  

Leo frowned. 

*"What's with those numbers? xmin, xmax?"*  

Marcus leaned back, satisfied that Leo was asking the right questions. 

*"xmin is the transaction that created the row. xmax is when it was invalidated—when a new version took its place. If xmax is zero, the row is still considered alive."*  

Leo stared at the output, realization dawning. 

*"So even after an update, the old version is still here?"*  

*"Yes,"* Marcus said, nodding. 

*"PostgreSQL doesn’t delete data in the way you’d expect. It just marks older rows as obsolete and moves forward, always writing at the end of the file."*  

Leo’s brows furrowed. 

*"Wait, but that means... the database just keeps growing? Doesn't that slow things down?"*  

Marcus’s lips curled into a knowing smile. 

*"Now you’re asking the right questions."*  

He turned back to the terminal and ran another command:  

```sql
SELECT schemaname, relname, n_live_tup, n_dead_tup
FROM pg_stat_user_tables
WHERE relname = 'users_user';
```  

Leo studied the output carefully:  

```
 schemaname |   relname   | n_live_tup | n_dead_tup
------------+-------------+------------+------------
 public     | users_user  | 8300021    | 124789
```  

Marcus tapped the screen. 

*"See that last column? Dead tuples. Rows that no transaction cares about anymore, but that still exist in the heap."*  

Leo’s eyes widened. 

*"That number is huge. And it's just... sitting there?"*  

*"Just sitting there,"* Marcus confirmed.  

Leo looked back at the screen, the problem starting to take shape in his mind. 

*"So over time, these dead rows accumulate. If nothing clears them, queries will have to scan through more and more junk."*  

Marcus nodded. 

*"That’s the cost of MVCC. Every query you run is like opening a book at a specific moment in time. The dead rows are necessary—until they aren't."*  

Leo turned to him, feeling a growing tension in his chest. 

*"And what happens when they aren’t?"*  

Marcus smirked and finally typed:  

```sql
VACUUM (VERBOSE) users_user;
```  

The terminal responded methodically:  

```
INFO: vacuuming "public.users_user"
INFO: removed 45320 dead row versions in 184 pages
DETAIL: CPU: user: 0.07 s, system: 0.01 s, elapsed: 0.15 s.
```  

Leo watched, fascinated. 

*"That just… wiped them away?"*  

*"Not quite,"* Marcus corrected. 

*"It marked them as reusable space. But the table is still fragmented, and those pages still exist. The space is free, but the structure remains the same."*  

Leo thought for a moment, then spoke carefully. 

*"So if enough dead rows build up, even after VACUUM, the table itself becomes inefficient?"*  

*"Yes,"* Marcus replied. 

*"That’s called bloat. At a certain point, we need to rewrite the table entirely to reclaim space. But doing that requires an **ACCESS EXCLUSIVE LOCK**—freezing the table, blocking all reads and writes."*  

Leo exhaled sharply. 

*"And that would be bad."*  

*"Very bad,"* Marcus confirmed. 

*"That’s why we monitor dead tuples and use frequent, careful VACUUMs before it gets out of hand."*  

A quiet moment passed between them as Leo processed the weight of what he'd learned. He looked down at the query results, then at the migration files he’d been working on the day before.  

*"Every change we make… it all leaves something behind,"* Leo murmured.  

Marcus nodded solemnly. 

*"Every update, every delete, every ALTER TABLE—they’re not just changes. They’re promises to the heap. Break too many, and the cost catches up with you."*  

A sharp buzzing interrupted them. Marcus pulled out his phone, his expression tightening. He stood abruptly, grabbing his laptop.  

Leo hesitated. 

*"Something wrong?"*  

Marcus frowned, already packing up. 

*"Replication issues. Our read replicas are lagging behind—data inconsistency across nodes."*  

Leo instinctively reached for his laptop. 

*"I can help."*  

Marcus shook his head, smiling slightly. 

*"Not this time. But here—"*  

He handed Leo a worn notebook, pages filled with careful, handwritten notes. 

*"Everything I’ve learned about PostgreSQL’s internals is in here. Read it. Tomorrow, you’ll need it."*  

Leo took the notebook carefully, feeling its weight. 

*"Tomorrow?"*  

Marcus gave him one last glance before heading toward the door. 

*"You’ll be on your own soon, Leo. Listen to the database—it’s telling you more than you think."*  

As the door clicked shut, Leo opened the notebook. Pages filled with diagrams of B-trees, transaction snapshots, and handwritten warnings:  

> "Indexes don’t just speed up queries. They shape how the heap is read. Ignore them at your peril."  
>   
> "Foreign keys validate row by row. Without CONCURRENTLY, they lock entire tables. Django hides this—until it’s too late."  
>   
> "Every ALTER TABLE is a negotiation. Respect the heap, and it will respect you."  

Leo exhaled slowly. He glanced back at the screen, then at his own migration files.  

Tomorrow, he would be alone.  

But for the first time, that didn’t seem so frightening.  