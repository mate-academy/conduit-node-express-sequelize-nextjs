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
