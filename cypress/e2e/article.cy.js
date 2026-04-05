/// <reference types="cypress" />

describe('Article', () => {
  let user;
  let article;

  beforeEach(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((resUser) => {
      user = resUser;
      cy.register(user.email, user.username, user.password);
      cy.login(user.email, user.username, user.password);

      return cy.task('generateArticle');
    }).then((resArticle) => {
      article = resArticle;
    });
  });

  it('should be created using New Article form', () => {
    cy.visit('/editor');

    cy.get('.nav-link', { timeout: 10000 }).should('contain', user.username);

    cy.get('input[placeholder="Article Title"]').type(article.title);
    cy.get('input[placeholder="What\'s this article about?"]')
      .type(article.description);

    cy.get('textarea[placeholder="Write your article (in markdown)"]')
      .should('be.visible').type(article.body);
    cy.get('input[placeholder="Enter tags"]').type(article.tag + '{enter}');

    cy.contains('button', 'Publish Article').click();

    cy.get('h1', { timeout: 10000 }).should('contain', article.title);
  });

  it('should be edited using Edit button', () => {
    cy.getCookie('auth').then((cookie) => {
      cy.request({
        method: 'POST',
        url: '/api/articles',
        headers: { Authorization: `Token ${cookie.value}` },
        body: { article: { ...article, tagList: [article.tag] } }
      }).then((res) => {
        const initialSlug = res.body.article.slug;
        cy.visit(`/article/${initialSlug}`);

        cy.contains('a', 'Edit Article').click()
        cy.get('input[placeholder="Article Title"]', { timeout: 10000 })
          .should('be.visible')
          .clear()
          .type('Update Title');
        cy.contains('button', 'Update Article').should('be.visible').click();
        cy.url().should('include', '/article/');
        cy.get('h1', { timeout: 15000 }).should('contain', 'Update Title');
      });
    });
  });

  it('should be deleted using Delete button', () => {
    cy.getCookie('auth').then((cookie) => {
      cy.request({
        method: 'POST',
        url: '/api/articles',
        headers: { Authorization: `Token ${cookie.value}` },
        body: { article: { ...article, tagList: [article.tag] } }
      }).then((res) => {
        cy.visit(`/article/${res.body.article.slug}`);

        cy.contains('button', 'Delete Article').click();

        cy.url().should('eq', Cypress.config().baseUrl + '/');
      });
    });
  });
});
