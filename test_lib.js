const perf_hooks = require('perf_hooks');
const models = require('./models');

const now = perf_hooks.performance.now;

function addDays(oldDate, days) {
  const newDate = new Date(oldDate.valueOf());
  newDate.setDate(oldDate.getDate() + days);
  return newDate;
}

const DATE0 = new Date(2000, 0, 0, 0, 0, 0, 0);

function makeComment(articleId, authorId, i) {
  return {
    body: `my comment ${i}`,
    articleId,
    authorId,
  };
}
exports.makeComment = makeComment;

function makeArticle(i = 0, opts) {
  const ret = {
    title: `My title ${i}`,
    description: `My description ${i}`,
    body: `# h1

## h2

### h3

#### h4

##### h5

###### h6

*Italic*

**Bold**

[Link](http://example.com)

Code block:

    function myFunc() {
      return 1;
    }

Block quote:

> To be or not to be.
>
> That is the question.

List:

- item 1
- item 2
- item 3
`,
  };

  if (!opts.api) {
    const date = opts.date === undefined ? DATE0 : opts.date;
    Object.assign(ret, {
      authorId: opts.authorId,
      createdAt: date,
      updatedAt: date,
    });
  }

  return ret;
}
exports.makeArticle = makeArticle;

function makeTag(i) {
  return { name: `tag${i}` };
}
exports.makeTag = makeTag;

function makeUser(sequelize, i = 0) {
  const userArg = {
    username: `user${i}`,
    email: `user${i}@mail.com`,
  };

  if (i % 2 === 0) {
    userArg.bio = `My bio ${i}`;
  }

  const password = 'asdf';

  if (sequelize) {
    sequelize.models.User.setPassword(userArg, password);
  } else {
    userArg.password = password;
  }

  return userArg;
}
exports.makeUser = makeUser;

let printTimeNow;

function printTime() {
  const newNow = now();
  printTimeNow = newNow;
}

async function generateDemoData(params) {
  const nUsers = params.nUsers === undefined ? 10 : params.nUsers;
  const nArticlesPerUser =
    params.nArticlesPerUser === undefined ? 10 : params.nArticlesPerUser;
  const nMaxCommentsPerArticle =
    params.nMaxCommentsPerArticle === undefined ? 3 : params.nMaxCommentsPerArticle;
  const nMaxTagsPerArticle =
    params.nMaxTagsPerArticle === undefined ? 3 : params.nMaxTagsPerArticle;
  const nFollowsPerUser =
    params.nFollowsPerUser === undefined ? 2 : params.nFollowsPerUser;
  const nFavoritesPerUser =
    params.nFavoritesPerUser === undefined ? 5 : params.nFavoritesPerUser;
  const nTags = params.nTags === undefined ? 10 : params.nTags;
  const directory = params.directory;
  const basename = params.basename;
  const verbose = params.verbose === undefined ? false : params.verbose;

  const nArticles = nUsers * nArticlesPerUser;

  let sequelize = params.sequelize || models.getSequelize(directory, basename);
  await models.sync(sequelize, { force: true });

  if (!params.empty) {
    printTimeNow = now();

    const userArgs = [];
    for (let i = 0; i < nUsers; i += 1) {
      userArgs.push(makeUser(sequelize, i));
    }
    const users = await sequelize.models.User.bulkCreate(userArgs);
    if (verbose) printTime();

    const followArgs = [];
    for (let i = 0; i < nUsers; i += 1) {
      const userId = users[i].id;
      for (let j = 0; j < nFollowsPerUser; j += 1) {
        followArgs.push({
          userId,
          followId: users[(i + 1 + j) % nUsers].id,
        });
      }
    }
    await sequelize.models.UserFollowUser.bulkCreate(followArgs);
    if (verbose) printTime();

    const articleArgs = [];
    for (let i = 0; i < nArticles; i += 1) {
      const userIdx = i % nUsers;
      const date = addDays(DATE0, i);
      articleArgs.push(makeArticle(i, { authorId: users[userIdx].id, date }));
    }
    const articles = await sequelize.models.Article.bulkCreate(articleArgs, {
      validate: true,
      individualHooks: true,
    });
    if (verbose) printTime();

    let articleIdx = 0;
    const favoriteArgs = [];
    for (let i = 0; i < nUsers; i += 1) {
      const userId = users[i].id;
      for (let j = 0; j < nFavoritesPerUser; j += 1) {
        favoriteArgs.push({
          userId,
          articleId: articles[articleIdx % nArticles].id,
        });
        articleIdx += 1;
      }
    }
    await sequelize.models.UserFavoriteArticle.bulkCreate(favoriteArgs);
    if (verbose) printTime();

    const tagArgs = [];
    for (let i = 0; i < nTags; i += 1) {
      tagArgs.push(makeTag(i));
    }
    const tags = await sequelize.models.Tag.bulkCreate(tagArgs);
    if (verbose) printTime();

    let tagIdx = 0;
    const articleTagArgs = [];
    for (let i = 0; i < nArticles; i += 1) {
      for (let j = 0; j < i % (nMaxTagsPerArticle + 1); j += 1) {
        articleTagArgs.push({
          articleId: articles[i].id,
          tagId: tags[tagIdx % nTags].id,
        });
        tagIdx += 1;
      }
    }
    await sequelize.models.ArticleTag.bulkCreate(articleTagArgs);
    if (verbose) printTime();

    const commentArgs = [];
    let commentIdx = 0;
    for (let i = 0; i < nArticles; i += 1) {
      for (let j = 0; j < i % (nMaxCommentsPerArticle + 1); j += 1) {
        commentArgs.push(
          makeComment(articles[i].id, users[commentIdx % nUsers].id, commentIdx)
        );
      }
    }
    await sequelize.models.Comment.bulkCreate(commentArgs);
    if (verbose) printTime();
  }

  return sequelize;
}
exports.generateDemoData = generateDemoData;
