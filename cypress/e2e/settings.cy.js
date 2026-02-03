/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import SettingsPage from '../support/pages/settings.pageObject';
import PageObject from '../support/PageObject';

describe('Settings page', () => {
  const settingsPage = new SettingsPage();
  const app = new PageObject();

  let user;

  before(() => {
    user = {
      username: `user${faker.number.int({ min: 1000, max: 9999 })}`,
      email: faker.internet.email().toLowerCase(),
      password: 'Password123!',
    };

    cy.register(user.email, user.username, user.password);
  });

  beforeEach(() => {
    cy.login(user.email, user.password);
    settingsPage.open();
  });

  it('should provide an ability to update username', () => {
    const newUsername = `user${faker.number.int({ min: 10000, max: 99999 })}`;

    settingsPage.updateUsername(newUsername);
    app.assertLoggedUsername(newUsername);

    user.username = newUsername;
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence();

    settingsPage.updateBio(newBio);
    settingsPage.bioTextarea.should('have.value', newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet.email().toLowerCase();

    settingsPage.updateEmail(newEmail);
    settingsPage.emailInput.should('have.value', newEmail);

    user.email = newEmail;
  });

  it('should provide an ability to update password and log out', () => {
    const newPassword = 'NewPassword123!';

    // 🔒 Intercept the real backend update
    cy.intercept('PUT', '/api/user').as('updateUser');

    settingsPage.updatePassword(newPassword);

    // ⏳ WAIT until backend REALLY finishes
    cy.wait('@updateUser').its('response.statusCode').should('eq', 200);

    // update local state only AFTER backend confirms
    user.password = newPassword;

    // logout
    settingsPage.logout();

    // login with new password
    cy.login(user.email, user.password);

    app.assertLoggedUsername(user.username);

    // final logout
    settingsPage.logout();
    cy.contains('Sign in').should('be.visible');
  });
});
