/// <reference types="cypress" />
import SettingsPageObject from '../support/pages/settings.pageObject';
import HomePageObject from '../support/pages/home.pageObject';        
import { faker } from '@faker-js/faker';

const settingsPage = new SettingsPageObject();
const homePage = new HomePageObject();

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    cy.intercept('PUT', '**/api/user').as('updateUser');
    cy.task('db:clear');
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;
      cy.register(user.email, user.username, user.password);
      cy.login(user.email, user.username, user.password);
      cy.visit('/', { timeout: 30000 }); 

      cy.get('.nav-link', { timeout: 15000 }).should('contain', user.username);
      
      settingsPage.visit();
    });
  });

  it('should provide an ability to update username', () => {
    const newUsername = faker.person.firstName() + faker.number.int(1000);
    settingsPage.updateField('usernameField', newUsername);
    settingsPage.clickSubmit();
    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
    homePage.assertHeaderContainUsername(newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence();
    settingsPage.updateField('bioField', newBio);
    settingsPage.clickSubmit();
    cy.wait('@updateUser');
    settingsPage.visit();
    settingsPage.bioField.should('have.value', newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet.email().toLowerCase();
    settingsPage.updateField('emailField', newEmail);
    settingsPage.clickSubmit();
    cy.wait('@updateUser');
    settingsPage.visit();
    settingsPage.emailField.should('have.value', newEmail);
  });

  it('should provide an ability to update password', () => {
    const newPassword = faker.internet.password(12) + '1aA!'; 
    settingsPage.updateField('passwordField', newPassword);
    settingsPage.clickSubmit();
    settingsPage.clickLogout();
    cy.login(user.email, user.username, newPassword);
    cy.getCookie('auth').should('exist');
  });

  it('should provide an ability to log out', () => {
    settingsPage.clickLogout();
    cy.url().should('not.contain', '/settings');
    homePage.profileLink.should('not.exist');
  });
});
