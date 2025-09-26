 testing
const { expect } = require('chai');
const { generateDemoData } = require('./test_lib');

describe('feed', () => {
  beforeEach(async () => {
    await generateDemoData();
  });

  it('shows articles by followers', async () => {
    expect(true).to.be.true;
  });

const { generateDemoData, closeDb } = require('./test_lib');

let db; // tutaj przechowamy demo data + sequelize

beforeEach(async function() {
  db = await generateDemoData();
});

afterEach(async function() {
  await closeDb();
});

it('feed shows articles by followers', async function() {
  const { User, Article, alice, bob } = db;

  // przykładowy test
  const articles = await Article.findAll({ where: { authorId: alice.id } });
  console.log(articles.length); // powinno zwrócić 1
next
});
