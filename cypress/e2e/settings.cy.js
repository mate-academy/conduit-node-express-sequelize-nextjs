/* eslint-disable max-len */
/// <reference types="cypress" />
/// <reference types="../support" />

import SettingsPageObject from '../support/pages/settings.pageObject.js';
import SignInPageObject from '../support/pages/signIn.pageObject.js';
const settingsPage = new SettingsPageObject();
const signInPage = new SignInPageObject();
describe('Settings page', () => {
  let user1;
  let user2;
  before(() => {
    cy.task('db:clear');

    cy.task('generateUser').then((newuser) => {
      user2 = newuser;
      cy.log(user2.email, user2.username, user2.password, user2.bio);

      // signInPage.visit();
      // cy.login(email, username, password);

      // signInPage.typeEmail(user2.email);
      // signInPage.typePassword(user2.password);
      // signInPage.clickSignInBtn();
      // settingsPage.visit();
    });
  });

  beforeEach(() => {
    cy.task('generateUser').then((newuser) => {
      user1 = newuser;

      // signInPage.visit();
      cy.login(user1.email, user1.username, user1.password);
      cy.log(user1.email, user1.username, user1.password, user1.bio);

      signInPage.visit();
      cy.assertPageUrl('/user/login');
      signInPage.typeEmail(user1.email);
      signInPage.typePassword(user1.password);
      signInPage.clickSignInBtn();
      settingsPage.visit();
      cy.assertPageUrl('/settings');
    });
  });

  it('should provide an ability to update username', () => {
    settingsPage.userNameField.should('have.value', user1.username);
    settingsPage.userNameField.clear();
    settingsPage.typeUserName(user2.username);
    settingsPage.updateSettings();
    settingsPage.userNameField.should('have.value', user2.username);
  });

  it('should provide an ability to update bio', () => {
    settingsPage.bioField.should('have.value', '');

    settingsPage.typeBio(user2.bio);
    settingsPage.updateSettings();
    settingsPage.bioField.should('have.value', user2.bio);
  });

  it('should provide an ability to update an email', () => {
    settingsPage.emailField.should('have.value', user1.email);
    settingsPage.emailField.clear();
    settingsPage.typeEmail(user2.email);
    settingsPage.updateSettings();
    settingsPage.emailField.should('have.value', user2.email);
  });

  it('should provide an ability to update password', () => {
    settingsPage.passwordField.should('have.value', '');

    settingsPage.typePassword(user2.password);
    settingsPage.updateSettings();
    settingsPage.passwordField.should('have.value', user2.password);
  });

  it('should provide an ability to update username, bio, email and password', () => {
    settingsPage.userNameField.should('have.value', user1.username);
    settingsPage.userNameField.clear();
    settingsPage.typeUserName(user2.username);

    settingsPage.userNameField.should('have.value', user2.username);
    settingsPage.bioField.should('have.value', '');

    settingsPage.typeBio(user2.bio);

    settingsPage.bioField.should('have.value', user2.bio);
    settingsPage.emailField.should('have.value', user1.email);
    settingsPage.emailField.clear();
    settingsPage.typeEmail(user2.email);

    settingsPage.emailField.should('have.value', user2.email);
    settingsPage.passwordField.should('have.value', '');

    settingsPage.typePassword(user2.password);

    settingsPage.passwordField.should('have.value', user2.password);
    settingsPage.updateSettings();


  });

  it('should provide an ability to log out', () => {
    settingsPage.logoutSettings();
    cy.assertPageUrl('/');
  });
});
