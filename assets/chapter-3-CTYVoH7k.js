const e=`
---
title: "Chapter 3: The Challenge of Foreign Keys"
slug: chapter-3
order: 5
---

# Chapter 3: The Challenge of Foreign Keys

Foreign keys are another enforcer of order, ensuring referential integrity. But adding them retroactively to an existing table can be devastating.

A naive approach:

\`\`\`sql
ALTER TABLE users_user ADD CONSTRAINT fk_user_team FOREIGN KEY (team_id) REFERENCES teams_team(id);
\`\`\`

PostgreSQL, upon encountering this command, will immediately scan the entire table, locking it until it is certain that no orphaned records exist. In an active system, this is unacceptable.

### The Alternative: Deferred Validation

PostgreSQL allows us to add a foreign key constraint without validating it immediately:

\`\`\`sql
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
\`\`\`

Later, when the system can afford the validation step:

\`\`\`sql
ALTER TABLE users_user VALIDATE CONSTRAINT fk_user_team;
\`\`\`

### The Django Equivalent

\`\`\`python
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
\`\`\`

Through this process, we make peace with PostgreSQL, navigating between its demand for integrity and our need for uptime.
`;export{e as default};
