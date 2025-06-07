/*eslint-disable*/
/// <reference types="cypress" />
/// <reference types="../support" />

import ArticlePageObject from '../support/pages/article.pageObject';
import { faker } from '@faker-js/faker';

const articlePage = new ArticlePageObject();

Cypress.Commands.add('login', (username, password) => {
  cy.request('POST', '/api/users', {
    user: {
      username,
      email: faker.internet.email(), // Make sure this is valid!
      password,
    },
  });
});

describe('Article Management', () => {
  before(() => {
    cy.task('db:clear'); // Reset DB before tests
    cy.login('testuser', 'TestPassword123'); // Ensure user is logged in
    articlePage.visit();
  });

  it('should be created using New Article form', () => {
    articlePage.createArticle({
      title: faker.lorem.words(5),
      description: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
    });

    articlePage.assertArticleExists();
  });

  it('should be edited using Edit button', () => {
    articlePage.editArticle(faker.lorem.words(6));
    articlePage.assertArticleUpdated();
  });

  it('should be deleted using Delete button', () => {
    articlePage.deleteArticle();
    articlePage.assertArticleDeleted();
  });
});
