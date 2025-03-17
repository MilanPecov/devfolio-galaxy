---
slug: evolving-postgresql-chapter-3
title: "Chapter 3: The Vows That Bind"
excerpt: Foreign keys enforce relationships but can be troublesome to add to existing tables. Learn how to safely implement them without disrupting your system.
date: March 15, 2024
readTime: 12 min read
categories:
  - Database
  - PostgreSQL
  - DevOps
icon: Database
iconColor: blue
isSeriesEntry: true
seriesSlug: evolving-postgresql-without-breaking-things
seriesTitle: Evolving PostgreSQL Without Breaking the World
chapterTitle: "Chapter 3: The Vows That Bind"
chapterNumber: 3
previousChapter: evolving-postgresql-chapter-2
previousChapterTitle: "Chapter 2: Whispers from the Heap"
nextChapter: evolving-postgresql-chapter-4
nextChapterTitle: "Chapter 4: The Burden of Bloat – Using pg_repack"
---

**—On Promises, Patience, and Hidden Costs**  

Leo found himself alone in the quiet sanctuary of Kairo Analytics. The monitors cast gentle shadows around him, the silence interrupted only by the soft hum of the server room. Marcus was absent today—called away abruptly by a replication issue that had thrown read consistency into chaos. Leo was left alone, his thoughts accompanied only by Marcus’s worn notebook.  

He felt strangely calm. After Marcus’s careful lessons, PostgreSQL no longer felt like a puzzle—rather, it was a dialogue. A negotiation with silent laws he had begun to understand.  

But then came the urgent ping:  

> **@CTO:** Legal says users must link explicitly to their teams. It can’t wait. Can you handle this?  

Leo stared at the Slack notification, a mixture of pride and quiet apprehension stirring inside him. He glanced at Marcus’s notebook, open on a heavily annotated page titled simply:  

## Foreign Keys: Promises and Consequences  

Marcus’s familiar handwriting jumped off the page:  

> "Foreign keys bind tables like vows. They promise consistency, row by row, across boundaries. Add them hastily, and PostgreSQL will freeze the world until trust is proven."  

Leo opened Django’s familiar `models.py`, fingers hovering cautiously over the keyboard. He could almost hear Marcus’s calm, measured voice:  

*"Django will make you believe it’s simple. It isn’t."*  

Still, curiosity urged him forward. He made the change, adding the foreign key with deceptive ease:  

```python
class User(models.Model):  
    # ... existing fields ...
    team = models.ForeignKey(
        'teams.Team', null=True, on_delete=models.SET_NULL
    )
```

He saved the file and ran Django’s migration generator:

```bash
python manage.py makemigrations users
```

A new migration file appeared, its structure familiar. But before blindly trusting it, Leo hesitated.  

*"Always inspect what Django creates before applying it."*  

He ran:  

```bash
python manage.py sqlmigrate users 0003
```

The terminal printed out the raw SQL Django intended to execute:  

```sql
ALTER TABLE users_user ADD COLUMN team_id INTEGER;
ALTER TABLE users_user ADD CONSTRAINT fk_users_team FOREIGN KEY (team_id) REFERENCES teams_team(id);
```

Leo's stomach tightened.  

*"That’s it? Just like that?"*  

His fingers hovered over the keyboard. He knew this pattern now. The ALTER TABLE would execute in a single, blunt move—locking the entire `users_user` table while PostgreSQL painstakingly validated every existing row. If the table were small, it might not matter. But this was a production database, millions of rows deep.  

He opened Marcus’s notebook again, scanning the familiar handwriting:  

> "Django’s `AddField()` is seductive but dangerous. Behind its simplicity lies PostgreSQL’s demand for validation—every single row checked, locking the table until certainty is absolute."  

Leo exhaled slowly. He pushed away Django’s abstraction, resisting its allure. If he wanted control, he would have to craft the migration himself.  

---

## Breaking the Illusion  

Instead of running the auto-generated migration, Leo wrote his own, carefully threading PostgreSQL’s requirements into something gentler—something PostgreSQL would accept without resistance.  

```python
from django.db import migrations, models

operations = [
    migrations.SeparateDatabaseAndState(
        database_operations=[
            migrations.RunSQL(
                sql="ALTER TABLE users_user ADD COLUMN team_id INT NULL;",
                reverse_sql="ALTER TABLE users_user DROP COLUMN team_id;"
            ),
            migrations.RunSQL(
                sql="CREATE INDEX CONCURRENTLY idx_users_team_id ON users_user(team_id);",
                reverse_sql="DROP INDEX CONCURRENTLY idx_users_team_id;"
            ),
            migrations.RunSQL(
                sql="""
                ALTER TABLE users_user ADD CONSTRAINT fk_users_team
                FOREIGN KEY (team_id) REFERENCES teams_team(id)
                NOT VALID;
                """ ,
                reverse_sql="ALTER TABLE users_user DROP CONSTRAINT fk_user_team;"
            ),
        ],
        state_operations=[
            migrations.AddField(
                model_name='user',
                name='team',
                field=models.ForeignKey(null=True, on_delete=models.SET_NULL, to='teams.Team'),
            ),
        ]
    ),
]
```

Leo paused, considering the `NOT VALID` clause he'd included. It felt precarious—a promise postponed, validation deferred to an unknown future. Marcus’s words echoed clearly:  

*"Validation deferred isn’t validation ignored. It's simply trust deferred—waiting patiently to be proven."*  

As the migration began, Leo monitored the quiet whispers of PostgreSQL’s internal state, running Marcus’s familiar query to check for potential locks:  

```sql
SELECT pid, query, state, wait_event_type
  FROM pg_stat_activity
 WHERE query ILIKE '%ALTER TABLE%';
```  

The query returned empty, reassuring him that no locks had emerged. Leo breathed easier, understanding that by deferring validation, PostgreSQL had quietly accepted his cautious diplomacy.  

Leo let out a breath, heart steady. Moments later, the CTO pinged again:  

> **@CTO:** All good?  

Leo replied calmly, fingers typing steadily:  

> Leo: Migration complete. No issues. No downtime.  

He sat back, relieved. It had worked—his careful approach had prevented downtime. The database remained responsive, and PostgreSQL had accepted the migration without protest.  

But as the adrenaline faded, new questions emerged.  

The constraint was there now—quiet, unvalidated. A promise made silently, awaiting verification. But this wasn’t the last time he’d have to alter a live table.

What if, next time, the change was more invasive?  

**What if he had to change a column type—how would that affect existing indexes? Would PostgreSQL force a full rewrite, locking everything down?**  

And what about tables that had grown unwieldy over time?  

**Would there always be a way to clean them up, or was there some deeper mechanism for reclaiming wasted space?**  

Marcus’s voice rose again gently in his thoughts:  

*"PostgreSQL forgives, but it never forgets. Every change leaves a mark, and if you don’t account for them, they will slow you down."*  

Leo tapped his fingers thoughtfully on Marcus’s notebook.  

*"Next time I see him, I'll ask. I'll ask how to alter columns safely without rewriting history. How to keep tables lean and queries fast, even after years of growth. How to make sure today's migrations don't become tomorrow's bottlenecks."*  

He closed the notebook.  