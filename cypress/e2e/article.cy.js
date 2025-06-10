/*eslint-disable*/
/// <reference types="cypress" />
/// <reference types="../support" />

import ArticlePageObject from '../support/pages/article.pageObject'
import { faker } from '@faker-js/faker'

const articlePage = new ArticlePageObject()

describe('Article Management', () => {
  before(() => {
    cy.task('db:clear') // Reset DB before tests
    cy.login('riot', '12345Qwert!', 'riot@qa.team') // Use valid user
    articlePage.visit()
  })

  it('should be created using New Article form', () => {
    const title = faker.lorem.words(5);
    const description = faker.lorem.sentence();
    const body = faker.lorem.paragraph();

    articlePage.createArticle({ title, description, body });
    cy.wait(2000); // Allow time for article creation

    articlePage.assertArticleExists(title);
    cy.log('Article successfully created:', title);
  })

  it('should be edited using CustomLink', () => {
    const newTitle = faker.lorem.words(6);

    cy.get('.article-list').should('contain', newTitle); // Ensure article exists before editing
    articlePage.editArticle(newTitle);
    cy.wait(2000); // Allow UI updates before asserting

    articlePage.assertArticleUpdated(newTitle);
    cy.log('Article successfully edited:', newTitle);
  })

  it('should be deleted using Delete button', () => {
    cy.get('.article-list').should('exist'); // Ensure article exists before deleting
    articlePage.deleteArticle();
    cy.wait(2000); // Allow UI time to remove the article

    articlePage.assertArticleDeleted();
    cy.log('Article successfully deleted');
  })
})
