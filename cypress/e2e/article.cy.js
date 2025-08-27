/// <reference types="cypress" />
/// <reference types="../support" />

import { faker } from '@faker-js/faker';
import EditorPageObject from '../support/pages/editor.pageObject';
import ArticlePageObject from '../support/pages/article.pageObject';

const editor = new EditorPageObject();
const article = new ArticlePageObject();

describe('Article', () => {
  let user;

  before(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((u) => { user = u; });
  });

  beforeEach(() => {
    cy.task('db:clear');
    cy.register(user.email, user.username, user.password);
    cy.login(user.email, user.password);
  });

  it('should be created using New Article form', () => {
    const title = faker.lorem.words(3);
    const desc = faker.lorem.sentence();
    const body = faker.lorem.paragraphs(2, '\n\n');
    const tags = ['cypress', 'e2e', faker.word.noun()].join(' ');

    editor.visit();
    editor.typeTitle(title);
    editor.typeAbout(desc);
    editor.typeBody(body);
    editor.typeTags(tags);
    editor.publish();

    article.title.should('contain', title);
    article.body.should('contain', body.split('\n')[0]);
    cy.url().should('match', /#\/article\/.+/);
  });

  it('should be edited using Edit button', () => {
    const title = faker.lorem.words(3);
    const body = faker.lorem.paragraph();
    editor.visit();
    editor.typeTitle(title);
    editor.typeAbout(faker.lorem.sentence());
    editor.typeBody(body);
    editor.publish();

    const updated = faker.lorem.paragraph();
    article.clickEdit();
    editor.typeBody(`${updated} (edited)`);
    editor.publish();

    article.body.should('contain', '(edited)');
  });

  it('should be deleted using Delete button', () => {
    const title = faker.lorem.words(3);
    const body = faker.lorem.paragraph();

    editor.visit();
    editor.typeTitle(title);
    editor.typeAbout(faker.lorem.sentence());
    editor.typeBody(body);
    editor.publish();

    article.clickDelete();

    cy.url().should('match', /#\/(tag|login|)$/);
    cy.contains(title).should('not.exist');
  });
});
