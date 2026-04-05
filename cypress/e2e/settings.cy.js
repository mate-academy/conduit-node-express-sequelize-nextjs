/// <reference types="cypress" />
import SettingsPageObject from '../support/pages/settings.pageObject';
import HomePageObject from '../support/pages/home.pageObject';
import { faker } from '@faker-js/faker';

const settingsPage = new SettingsPageObject();
const homePage = new HomePageObject();

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generateUser) => {
      user = generateUser;
      cy.register(user.email, user.username, user.password);
      cy.login(user.email, user.username, user.password);

      cy.visit('/');

      cy.get('a[href*="settings"]', { timeout: 10000 }).click();
      cy.contains('h1', 'Your Settings').should('be.visible');
    });
  });

  it('should provide an ability to update username', () => {
    cy.visit('/settings');
    cy.get('.nav-link', { timeout: 10000 }).should('contain', user.username);
    cy.get('input[placeholder="Username"]', { timeout: 10000 })
      .should('be.visible');
    cy.get('input[placeholder="Username"]').clear();
    cy.get('input[placeholder="Username"]').type(user.username + 'new');

    cy.get('button[type="submit"]').click();

    cy.get('.nav-link').should('contain', user.username + 'new');
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence();
    settingsPage.updateField('bioField', newBio);
    settingsPage.clickSubmit();

    cy.visit('/settings');
    settingsPage.bioField.should('have.value', newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet.email().toLowerCase();
    settingsPage.updateField('emailField', newEmail);
    settingsPage.clickSubmit();
    cy.visit('/settings');
    settingsPage.emailField.should('have.value', newEmail);
  });

  it('should provide an ability to update password', () => {
    const newPassword = 'NewPassword123!';
    settingsPage.updateField('passwordField', newPassword);
    settingsPage.clickSubmit();
    settingsPage.clickLogout();

    cy.login(user.email, user.username, newPassword).then((res) => {
      cy.getCookie('auth').should('exist');
    });
  });

  it('should provide an ability to log out', () => {
    settingsPage.clickLogout();
    cy.url().should('not.contain', '/settings');
    homePage.usernameLink.should('not.exist');
  });
});
