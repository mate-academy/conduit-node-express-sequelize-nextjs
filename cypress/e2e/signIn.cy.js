/// <reference types="cypress" />
import SignInPageObject from '../support/pages/signIn.pageObject';

const signInPage = new SignInPageObject();

describe('Sign In page', () => {
  beforeEach(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((user) => {
      cy.register(user.email, user.username, user.password);
      cy.wrap(user).as('user');
    });
  });

  it('should provide ability to log in with existing credentials', function() {
    signInPage.visit();
    signInPage.login(this.user.email, this.user.password);
    cy.get('.nav-link').should('contain', this.user.username);
  });

  it('should not log in with wrong credentials', function() {
    signInPage.visit();
    signInPage.login(this.user.email, 'wrong_password');
    cy.get('.error-messages').should('be.visible');
  });
});