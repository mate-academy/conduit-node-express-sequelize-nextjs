/// <reference types="cypress" />
/// <reference types="../support" />

import { faker } from '@faker-js/faker';

import SettingsPage from '../support/pages/settings.pageObject';

const settingPage = new SettingsPage();

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generateUser) => {
      cy.login(
        generateUser.email,
        generateUser.username,
        generateUser.password
      );
      user = generateUser;
      cy.then(() => {
        cy.visit('/settings');
      });
    });
  });

  it('should provide an ability to update username', () => {
    const newUsername = `${faker.person
      .lastName()
      .toLowerCase()}${faker.number.int({ min: 100, max: 999 })}`;

    settingPage.changeItemByDataCy('username', newUsername);
    settingPage.clickOnUpdateSettingsBtn();

    // Wait for the redirect to complete
    cy.url().should('include', `/profile/${newUsername}`);
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence({ min: 10, max: 50 });

    settingPage.changeItemByDataCy('bio', newBio);
    settingPage.clickOnUpdateSettingsBtn();

    // Wait for the redirect to complete
    cy.url().should('include', `/profile/${user.username}`);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet.email({ provider: 'gmail.com' });

    settingPage.changeItemByDataCy('email', newEmail);
    settingPage.clickOnUpdateSettingsBtn();

    // Wait for the redirect to complete
    cy.url().should('include', `/profile/${user.username}`);
  });

  it('should provide an ability to update password', () => {
    const newPass = faker.internet.password({
      length: 12,
      pattern: /[A-Za-z0-9!@#$%^&*]/,
    });

    settingPage.changeItemByDataCy('password', newPass);
    settingPage.clickOnUpdateSettingsBtn();

    // Wait for the redirect to complete
    cy.url().should('include', `/profile/${user.username}`);
  });

  it('should provide an ability to log out', () => {
    settingPage.clickOnLogoutBtn();
    cy.url().should('include', '/');
  });
});
