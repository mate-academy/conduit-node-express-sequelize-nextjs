 testing
const { getSequelize, sync } = require('./models/sequelize');

async function generateDemoData() {
  const sequelize = getSequelize();
  await sync(sequelize);

  const Article = sequelize.models.Article;
  // przykład tworzenia demo danych:
  await Article.create({
    title: 'Demo article',
    description: 'This is a demo article for tests',
    body: 'Body content',
    authorId: 1,
  });

  return sequelize;
}

module.exports = { generateDemoData };
=======
const { Sequelize } = require('sequelize');
const UserModel = require('./models/user');
const ArticleModel = require('./models/article');

let sequelize;

async function initDb() {
  sequelize = new Sequelize('sqlite::memory:', {
    logging: false
  });

  const User = UserModel(sequelize);
  const Article = ArticleModel(sequelize);

  Article.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
  User.hasMany(Article, { as: 'authoredArticles', foreignKey: 'authorId' });

  await sequelize.sync({ force: true });

  return { sequelize, User, Article };
}

async function generateDemoData() {
  const { sequelize, User, Article } = await initDb();

  const alice = await User.create({
    username: 'alice',
    email: 'alice@test.com',
    password: '123'
  });

  const bob = await User.create({
    username: 'bob',
    email: 'bob@test.com',
    password: '123'
  });

  await Article.create({
    title: 'Article 1',
    description: 'Desc 1',
    body: 'Body 1',
    authorId: alice.id
  });
  await Article.create({
    title: 'Article 2',
    description: 'Desc 2',
    body: 'Body 2',
    authorId: bob.id
  });

  return { sequelize, User, Article, alice, bob };
}

async function closeDb() {
  if (sequelize) await sequelize.close();
}

module.exports = { generateDemoData, closeDb };
 next
