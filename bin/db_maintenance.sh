#!/bin/bash
#
# Weekly maintenance for the conduit sandbox DB.
#
# Removes user-generated data accumulated by QA students, keeping only a
# whitelist of seed users and tags. Runs from cron on the EC2 instance:
#
#   0 0 * * 1 /home/ec2-user/projects/conduit-node-express-sequelize-nextjs/bin/db_maintenance.sh >> /home/ec2-user/db_maintenance.log 2>&1
#
# Deletes happen in FK-safe order (children before parents) because the
# schema has no ON DELETE CASCADE.

set -euo pipefail

: "${PGHOST:=mateacademy-database-development.cqw7zu22pde8.eu-central-1.rds.amazonaws.com}"
: "${PGPORT:=5432}"
: "${PGUSER:=realworld_next_user}"
: "${PGDATABASE:=realworld_next}"
: "${PGPASSWORD:=a}"
export PGHOST PGPORT PGUSER PGDATABASE PGPASSWORD

KEEP_USER_IDS="134946, 455152, 455148, 455140, 455150, 455156, 455144, 455154, 455146, 455138, 455142, 541999, 541997, 542012, 541995, 542014, 542001, 541991, 542003, 541993, 542010, 823587, 823638"
KEEP_TAG_NAMES="'welcome', '4308', 'text', 'longLongLongLong', 'oneMore', 'TestTag', 'ATB', 'newTag', 'softwareTesting', 'testingTheory', 'wilcommen', 'articleTag', 'tags'"

echo "=== db_maintenance started at $(date --utc) ==="

psql -v ON_ERROR_STOP=1 <<SQL
BEGIN;

-- Child tables that reference User or Article must be cleaned first,
-- otherwise deleting Users/Articles leaves orphan rows that crash the app
-- (e.g. Comment.toJson would null-deref on a missing author).

DELETE FROM "UserFollowUser"
 WHERE "userId"   NOT IN (${KEEP_USER_IDS})
    OR "followId" NOT IN (${KEEP_USER_IDS});

DELETE FROM "UserFavoriteArticle"
 WHERE "userId" NOT IN (${KEEP_USER_IDS});

DELETE FROM "Comment"
 WHERE "authorId" NOT IN (${KEEP_USER_IDS});

DELETE FROM "ArticleTag"
 WHERE "articleId" IN (SELECT id FROM "Article" WHERE "authorId" NOT IN (${KEEP_USER_IDS}));

DELETE FROM "Article"
 WHERE "authorId" NOT IN (${KEEP_USER_IDS});

-- Now safe to remove users.
DELETE FROM "User"
 WHERE id NOT IN (${KEEP_USER_IDS});

-- Tag cleanup (no FK dependency).
DELETE FROM "Tag" WHERE "name" NOT IN (${KEEP_TAG_NAMES});
DELETE FROM "Tag" WHERE "name" IS NULL;

COMMIT;
SQL

echo "=== db_maintenance finished at $(date --utc) ==="
