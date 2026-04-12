/// <reference types="cypress" />

describe('Article', () => {
  let user;
  let article;

  beforeEach(() => {
    cy.intercept('POST', '**/api/articles').as('createArticle');
    cy.intercept('PUT', '**/api/articles/**').as('updateArticle');
    cy.intercept('DELETE', '**/api/articles/**').as('deleteArticle');
    
    cy.task('db:clear');
    
    cy.task('generateUser').then((resUser) => {
      user = resUser;
      cy.register(user.email, user.username, user.password);
      cy.login(user.email, user.username, user.password);
    });

    cy.task('generateArticle').then((resArticle) => {
      article = resArticle;
    });
  });

  it('should be created using New Article form', () => {
    cy.visit('/editor');

    cy.get('input[placeholder="Article Title"]').type(article.title);
    
  
    const descPlaceholder = 'What\'s this article about?';
    cy.get(`input[placeholder="${descPlaceholder}"]`)
      .type(article.description);

    const bodyPlaceholder = 'Write your article (in markdown)';
    cy.get(`textarea[placeholder="${bodyPlaceholder}"]`)
      .type(article.body);

    cy.get('input[placeholder="Enter tags"]').type(article.tag + '{enter}');
    cy.contains('button', 'Publish Article').click();

    cy.wait('@createArticle', { timeout: 15000 });
    cy.get('h1').should('contain', article.title);
  });

  it('should be edited using Edit button', () => {
    cy.getCookie('auth').then((cookie) => {

      cy.request({
        method: 'POST',
        url: '/api/articles',
        headers: { Authorization: `Token ${cookie.value}` },
        body: { article: { ...article, tagList: [article.tag] } },
      }).as('articleResponse');

      cy.get('@articleResponse').then((res) => {
        const initialSlug = res.body.article.slug;
        cy.visit(`/article/${initialSlug}`);

        cy.contains('a', 'Edit Article').should('be.visible').click();

        cy.get('input[placeholder="Article Title"]').clear();
        cy.get('input[placeholder="Article Title"]').type('Update Title');

        cy.contains('button', 'Update Article').click();
        
        cy.wait('@updateArticle');
        cy.get('h1').should('contain', 'Update Title');
      });
    });
  });

  it('should be deleted using Delete button', () => {
    cy.getCookie('auth').then((cookie) => {
      cy.request({
        method: 'POST',
        url: '/api/articles',
        headers: { Authorization: `Token ${cookie.value}` },
        body: { article: { ...article, tagList: [article.tag] } },
      }).as('deleteResponse');

      cy.get('@deleteResponse').then((res) => {
        cy.visit(`/article/${res.body.article.slug}`);
        cy.contains('button', 'Delete Article').click();
        cy.wait('@deleteArticle');
        cy.url().should('eq', Cypress.config().baseUrl + '/');
      });
    });
  });
});
