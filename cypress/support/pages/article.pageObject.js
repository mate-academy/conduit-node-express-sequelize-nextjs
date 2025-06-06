import PageObject from '../PageObject';

class ArticlePageObject extends PageObject {
  visit() {
    cy.visit('/articles');
  }

  createArticle({ title, description, body }) {
    cy.contains('New Article').click();
    cy.get('[data-cy=title]').type(title);
    cy.get('[data-cy=description]').type(description);
    cy.get('[data-cy=body]').type(body);
    cy.contains('Publish').click();
  }

  editArticle(newTitle) {
    cy.contains('.article-title', newTitle).click();
    cy.contains('Edit').click();
    cy.get('[data-cy=title]').clear();
    cy.get('[data-cy=title]').type(newTitle);
    cy.contains('Save Changes').click();
  }

  deleteArticle() {
    cy.contains('Delete').click();
  }

  assertArticleExists(title) {
    cy.get('.article-list').should('contain', title);
  }

  assertArticleUpdated(newTitle) {
    cy.get('.article-list').should('contain', newTitle);
  }

  assertArticleDeleted(title) {
    cy.get('.article-list').should('not.contain', title);
  }
}

export default ArticlePageObject;
