# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A fork of the RealWorld Conduit example app (Node.js + Express + Sequelize +
Next.js), used by Mate academy as a **QA sandbox** — students practise
testing against `https://conduit.mate.academy/`. Not a production app; data
is regenerated weekly. The `next` branch is the default and what prod runs.

## Architecture

- Next.js custom server: both the REST API (under `/api`) and the pages are
  served from a single Express process (`app.js`).
- Articles use Next.js **ISR** (`getStaticProps` + `revalidate`). A rebuild
  wipes the cache and forces re-generation — this is how a latent data issue
  can suddenly surface after a routine deploy.
- SSR/backend helpers live under `back/`; shared front config under `front/`;
  REST endpoints under `api/`; Sequelize models under `models/`.
- Ops scripts live under `bin/`. Anything that runs on the instance
  (including scheduled cron scripts) belongs here — **never** maintain a
  script only on the EC2 box.

## Deployment

Runs on a single EC2 instance behind an AWS ALB:

- Instance: `i-08d3e4dea44452167` (IP `3.74.142.3`), Amazon Linux 2,
  node v16.15.1 via nvm, pm2 in **fork** mode (single process — no cluster).
- SSL: ALB `mate-utility-alb` terminates TLS with an ACM wildcard cert for
  `*.mate.academy` (auto-renew). Conduit listens on port 3000 behind it.
- SSH: `ssh -i ~/.ssh/conduit_key.pem ec2-user@3.74.142.3`.
- nvm is not loaded in non-interactive sessions — always `source ~/.nvm/nvm.sh`
  before `pm2`/`npm`.

**Deploy steps:**

```bash
ssh -i ~/.ssh/conduit_key.pem ec2-user@3.74.142.3
source ~/.nvm/nvm.sh
cd ~/projects/conduit-node-express-sequelize-nextjs
git pull
npm run build-prod
pm2 restart Conduit
```

`git pull` and `npm run build-prod` are zero-downtime (app keeps serving the
in-memory build). `pm2 restart Conduit` causes **~1–3 seconds of 502s**
because of fork mode — factor this in. True zero-downtime would require
cluster mode + `pm2 reload`.

## Database

Postgres on RDS (shared instance hosting multiple unrelated databases):

- Host: `mateacademy-database-development.cqw7zu22pde8.eu-central-1.rds.amazonaws.com:5432`
- DB: `realworld_next` (conduit-only)
- User: `realworld_next_user` / password `a` (hardcoded in `front/config.js`
  — this is a sandbox, treat it as non-sensitive but don't log it anywhere
  public). RDS is not publicly reachable — connect from the EC2 box.

**Critical schema constraint — no `ON DELETE CASCADE`** on any FK to
`User`/`Article`. Deleting users or articles directly leaves orphan rows in
`Comment`, `Article`, `UserFavoriteArticle`, `UserFollowUser`, `ArticleTag`.
Orphaned `Comment` rows cause article pages to 500 because `Comment.toJson`
would null-deref on `this.author`. The code has defensive null-guards in
`models/comment.js`, `back/ArticlePage.ts`, and `api/articles.js` for safety,
but prevention is better: use `bin/db_maintenance.sh` for all bulk cleanups,
which deletes dependents in FK-safe order inside a transaction.

## Operational scripts

- `bin/db_maintenance.sh` — weekly DB cleanup. Runs on the instance from
  cron every Monday 00:00 UTC:
  ```
  0 0 * * 1 /home/ec2-user/projects/conduit-node-express-sequelize-nextjs/bin/db_maintenance.sh >> /home/ec2-user/db_maintenance.log 2>&1
  ```
  Whitelists ~23 seed user IDs and 13 tag names; deletes everything else.
  Edit via PR, never on the instance.
- `bin/generate-demo-data.js` — seed test data.
- `bin/sync-db.js` — Sequelize sync used by `npm run build`.

## Conventions

- Default branch is **`next`** (not `master`/`main`). PRs target `next`.
- Commit message format: `[Conduit]: <what changed>` for the first commit on
  a branch; subsequent commits are free-form. Never co-author with an AI in
  the trailer — company policy.
- PR title mirrors the first commit message.
- PR description leads with `## Summary`. Keep it concise. Never use `#N`
  patterns in prose (GitHub renders them as cross-links).
- Do not make changes directly on the instance — always PR, pull, deploy.

## Related documentation

Canonical operational docs live in ClickUp (not in this repo because they
cover the whole sandbox fleet, not just Conduit):

- [How to set up sandbox apps on EC2 Amazon Linux 2](https://app.clickup.com/24383048/v/dc/q83j8-59281/q83j8-100741)
  — AWS/ALB setup, deployment procedure, instance layout.
- [Support](https://app.clickup.com/24383048/v/dc/q83j8-59281/q83j8-197724)
  — admin credentials, DB cleanup procedure, cron jobs, test-data restoration,
  disk cleanup commands.

## Keeping this file and the ClickUp docs in sync

When you (Claude Code or any future maintainer) change anything that affects
the facts documented above — **update this file and the two ClickUp pages in
the same change**. Examples of changes that require a doc update:

- Instance IP or ID, region, or ALB ARN changes
- Node version, pm2 mode, or deploy command changes
- New or removed `bin/` ops script, or cron schedule changes
- Schema changes (especially anything involving FK behaviour — add/remove
  CASCADE, new join tables, renamed columns)
- Whitelist of seed users or tag names in `bin/db_maintenance.sh` changes
- Default branch name, commit convention, or PR workflow changes
- New hardcoded credentials or config moves

For ClickUp edits, use the `mcp__claude_ai_ClickUp__clickup_update_document_page`
tool (workspace `24383048`, doc `q83j8-59281`, pages `q83j8-100741` and
`q83j8-197724`). ClickUp updates fully replace page content — always read the
page first and include all unchanged sections in the new content.

Surface drift proactively: if you notice this file contradicts what you see
in the code or on the instance, fix the file as part of whatever you're
doing rather than leaving a TODO.
