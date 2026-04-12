/// <reference types="cypress" />
import { settingsPage } from '../support/PageObject';

Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('fetch is not defined')) {
    return false;
  }
});

describe('Settings page', () => {
  let user;

  beforeEach(() => {

    cy.task('db:clear');
    
    cy.task('generateUser').then((res) => {
      user = res;
      cy.register(user.email, user.username, user.password);

      cy.login(user.email, user.username, user.password);
      
      
      cy.visit('/');
      settingsPage.visit();
    });
  });

  it('should provide an ability to update username', () => {
    const newUsername = user.username + 'NEW';
    
    settingsPage.usernameField.clear().type(newUsername);
    settingsPage.updateButton.click();

    cy.url({ timeout: 10000 }).should('include', `/profile/${newUsername}`);
    cy.get('.navbar', { timeout: 10000 }).should('contain', newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = 'I am a new bio ' + Math.random(); // Додаємо рандом, щоб уникнути кешування
    
    settingsPage.bioField.clear().type(newBio);
    settingsPage.updateButton.click();

    cy.url().should('not.include', '/settings'); 

    cy.visit(`/profile/${user.username}`);
    cy.get('.user-info', { timeout: 10000 }).should('contain', newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = 'new_' + user.email;
    
    settingsPage.emailField.clear().type(newEmail);
    settingsPage.updateButton.click();


    cy.url().should('not.include', '/settings');
    

    settingsPage.visit();
    settingsPage.emailField.should('have.value', newEmail);
  });

  it('should provide an ability to update password', () => {
    const newPassword = 'new' + user.password;
    
    settingsPage.passwordField.clear().type(newPassword);
    settingsPage.updateButton.click();


    cy.url().should('not.include', '/settings');
    

    cy.get('.nav-link').contains('Logout').should('be.visible').click();
    
       cy.login(user.email, user.username, newPassword);
    cy.visit('/');
    cy.get('.navbar', { timeout: 10000 }).should('contain', user.username);
  });
});