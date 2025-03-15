const e=`
---
title: "Prologue: The Immutable and the Changing"
slug: prologue
order: 2
---

# Prologue: The Immutable and the Changing

It began with a simple requirement: enforce uniqueness on the \`email\` field in our \`users\` table. A trivial change, or so we thought.

\`\`\`python
class User(models.Model):
    email = models.CharField(max_length=255)  # The past: free, unrestricted
\`\`\`

Our goal:

\`\`\`python
email = models.CharField(max_length=255, unique=True)  # The future: structured, ordered
\`\`\`

The request seemed innocent. But PostgreSQL sees differently. To apply a uniqueness constraint, it must inspect every row, verify every entry, ensure that order has always existed in a structure that was previously indifferent to it.
`;export{e as default};
