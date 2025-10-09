/// <reference types="cypress" />
/// <reference types="../support" />

import SettingsPageObject from '../support/pages/settings.pageObject';
import { faker } from '@faker-js/faker';

const settingsPage = new SettingsPageObject();

describe('Settings page', () => {
  let user;

  before(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generateUser) => {
      user = generateUser;
      cy.register(user.email, user.username, user.password);
      cy.login(user.email, user.password);
    });
  });

  beforeEach(() => {
    settingsPage.visit();
  });

  it('should provide an ability to update username', () => {
    const newUsername = faker.internet.userName();
    settingsPage.typeUsername(newUsername);
    settingsPage.clickUpdate();
    settingsPage.assertUpdatedUsername(newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence();
    settingsPage.typeBio(newBio);
    settingsPage.clickUpdate();
    settingsPage.assertUpdatedBio(newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet.email();
    settingsPage.typeEmail(newEmail);
    settingsPage.clickUpdate();
    settingsPage.assertUpdatedEmail(newEmail);
  });

  it('should provide an ability to update password', () => {
    const newPassword = faker.internet.password(12);
    settingsPage.typePassword(newPassword);
    settingsPage.clickUpdate();

    settingsPage.clickLogout();
    cy.login(user.email, newPassword);
    cy.get('body').should('contain.text', user.username);
  });

  it('should provide an ability to log out', () => {
    settingsPage.clickLogout();
    cy.url().should('include', '/login');
  });
});
