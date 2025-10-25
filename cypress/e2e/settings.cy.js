/// <reference types="cypress" />
/// <reference types="../support" />

import SettingsPage from '../support/pages/SettingsPage';
import SignInPageObject from '../support/pages/signIn.pageObject';
import { faker } from '@faker-js/faker';

describe('Settings page', () => {
  const settingsPage = new SettingsPage();
  const signInPage = new SignInPageObject();

  const userEmail = Cypress.env('USER_EMAIL');
  const userPassword = Cypress.env('USER_PASSWORD');

  beforeEach(() => {
    // Logowanie przed każdym testem
    cy.login(userEmail, userPassword);
    settingsPage.visit();
  });

  it('should provide an ability to update username', () => {
    const newUsername = faker.internet.userName();

    settingsPage.typeUsername(newUsername);
    settingsPage.clickUpdateBtn();
    settingsPage.assertUsername(newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence();

    settingsPage.typeBio(newBio);
    settingsPage.clickUpdateBtn();
    settingsPage.assertBio(newBio);
  });

  it('should provide an ability to update email', () => {
    const newEmail = faker.internet.email();

    settingsPage.typeEmail(newEmail);
    settingsPage.clickUpdateBtn();
    settingsPage.assertEmail(newEmail);
  });

  it('should provide an ability to update password', () => {
    const newPassword = faker.internet.password();

    settingsPage.typePassword(newPassword);
    settingsPage.clickUpdateBtn();
    // Log out and log in again with new password to verify
    settingsPage.clickLogoutBtn();
    cy.login(userEmail, newPassword);
    cy.url().should('not.include', '/user/login'); // Sprawdza, że logowanie powiodło się
  });

  it('should provide an ability to log out', () => {
    settingsPage.clickLogoutBtn();
    settingsPage.assertLoggedOut();
  });
});
