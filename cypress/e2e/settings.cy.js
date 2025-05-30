/// <reference types="cypress" />
/// <reference types="../support" />

import SignInPageObject from '../support/pages/signIn.pageObject';
import SettingsPageObject from '../support/pages/settings.pageObject';
import { faker } from '@faker-js/faker';

const signInPage = new SignInPageObject();
const settingsPage = new SettingsPageObject();

const newData = {
  newName: faker.internet.userName().replace(/[^a-zA-Z0-9_]/g, ''),
  newBio: faker.lorem.text(),
  newEmail: faker.internet.email(),
  newPassword: faker.internet.password(),
};

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear');

    cy.task('generateUser').then((generateUser) => {
      user = generateUser;

      signInPage.visit();
      cy.login(user.email, user.username, user.password);

      signInPage.typeEmail(user.email);
      signInPage.typePassword(user.password);
      signInPage.clickSignInBtn();

      settingsPage.visit();
    });
  });

  it('should provide an ability to update username', () => {
    settingsPage.userNameField.should('have.value', user.username);
    settingsPage.userNameField.clear();
    settingsPage.typeUserName(newData.newName);
    settingsPage.userNameField.should('have.value', newData.newName);
    settingsPage.updateSettings();
  });

  it('should provide an ability to update bio', () => {
    settingsPage.bioField.should('have.value', '');
    settingsPage.typeBio(newData.newBio);
    settingsPage.bioField.should('contain.text', newData.newBio);
    settingsPage.updateSettings();
  });

  it('should provide an ability to update an email', () => {
    settingsPage.emailField.should('have.value', user.email);
    settingsPage.emailField.clear();
    settingsPage.typeEmail(newData.newEmail);
    settingsPage.emailField.should('have.value', newData.newEmail);
    settingsPage.updateSettings();
  });

  it('should provide an ability to update password', () => {
    settingsPage.typePassword(newData.newPassword);
    settingsPage.passwordField.should('have.value', newData.newPassword);
    settingsPage.updateSettings();
  });
});
