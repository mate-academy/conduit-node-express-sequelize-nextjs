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
      cy.login(user.email, user.username, user.password).as('currentUser');
    });

    cy.task('generateArticle').then((resArt) => {
      article = resArt;
    });
  });

  it('should be created using New Article form', function() {
    cy.visit('/editor');
    cy.get('input[placeholder="Article Title"]').type(article.title);
    cy.get('input[placeholder="What\'s this article about?"]')
    .type(article.description);
    cy.get('textarea[placeholder="Write your article (in markdown)"]')
    .type(article.body);
    cy.get('input[placeholder="Enter tags"]').type(article.tag + '{enter}');
    cy.contains('button', 'Publish Article').click();

    cy.wait('@createArticle').then((interception) => {
       expect(interception.response.statusCode).to.eq(200);
    });
    cy.get('h1', { timeout: 15000 }).should('contain', article.title);
  });

  it('should be edited using Edit button', function() {
    cy.get('@currentUser').then((currentUser) => {
      cy.request({
        method: 'POST',
        url: '/api/articles',
        headers: { Authorization: `Token ${currentUser.token}` },
        body: { article: { ...article, tagList: [article.tag] } },
      }).then((res) => {
        const slug = res.body.article.slug;

        cy.visit(`/article/${slug}`, { failOnStatusCode: false });
        cy.get('body').then(($body) => {
          if ($body.text().includes('404')) {
            cy.reload(); 
          }
        });
        
        cy.contains('a', 'Edit Article', { timeout: 15000 })
        .should('be.visible')
        .click();
        
        cy.get('input[placeholder="Article Title"]').clear();
        cy.get('input[placeholder="Article Title"]').type('Updated Title');
        cy.contains('button', 'Update Article').click();
        
        cy.wait('@updateArticle');
        cy.get('h1').should('contain', 'Updated Title');
      });
    });
  });
});