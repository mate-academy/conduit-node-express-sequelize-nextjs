import PageObject from '../PageObject';

class ArticlePageObject extends PageObject {
  visit() {
    cy.visit('/editor');
  }

  createArticle({ title, description, body }) {
    cy.get('[data-cy=title]').type(title);
    cy.get('[data-cy=description]').type(description);
    cy.get('[data-cy=body]').type(body);
    cy.get('[data-cy=publish]').click();
  }

  editArticle() {
    cy.get('[data-cy=edit-article]').click();
    cy.get('[data-cy=title]').clear();
    cy.get('[data-cy=title]').type('Your new title here');
    cy.contains('Save Changes').click();
  }

  deleteArticle() {
    cy.getByDataCy('delete-article').click();
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
