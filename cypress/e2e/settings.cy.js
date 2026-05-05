/// <reference types="cypress" />
/// <reference types="../support" />

import { faker } from '@faker-js/faker';
import SettingsPageObject from '../support/pages/settings.pageObject';
import PageObject from '../support/pages/pageObject';

const settingsPage = new SettingsPageObject();
const pageObject = new PageObject();

describe('Settings page', () => {
  let user;
  let newData;

  before(() => {
    // Clear database
    cy.task('db:clear');

    // Generate initial user
    cy.task('generateUser').then((generatedUser) => {
      user = generatedUser;
      // Register user via API or UI
      cy.register(user.email, user.username, user.password);
    });

    // Generate new data for updates
    newData = {
      bio: faker.lorem.sentence({ min: 5, max: 10 }).slice(0, 160), // Max 160 chars
      username: faker.internet.userName().replace(/[^a-zA-Z0-9]/g, '').slice(0, 20), // Alphanumeric, 3–20 chars
      email: faker.internet.email().toLowerCase(), // Valid email
      password: faker.internet.password({ length: 12 }), // Min 8 chars
    };
  });

  beforeEach(() => {
    // Sign in before each test
    pageObject.signIn(user.email, user.password);
    settingsPage.visit();
  });

  it('should provide an ability to update bio', () => {
    settingsPage.typeBio(newData.bio);
    settingsPage.clickSaveButton();
    settingsPage.assertBioUpdated(newData.bio);
  });

  it('should provide an ability to update username', () => {
    settingsPage.typeUsername(newData.username);
    settingsPage.clickSaveButton();
    settingsPage.assertUsernameUpdated(newData.username);
  });

  it('should provide an ability to update email', () => {
    settingsPage.typeEmail(newData.email);
    settingsPage.clickSaveButton();
    settingsPage.assertEmailUpdated(newData.email);
  });

  it('should provide an ability to update password', () => {
    settingsPage.typePassword(newData.password);
    settingsPage.clickSaveButton();
    settingsPage.assertPasswordUpdated();

    // Verify new password by logging out and logging back in
    cy.get('[data-cy="logout-btn"]').click();
    pageObject.signIn(newData.email, newData.password);
    pageObject.assertHeaderContainUsername(newData.username);
  });
});
