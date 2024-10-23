/// <reference types="cypress" />
/// <reference types="../support" />

import HomePageObject from '../support/pages/home.pageObject';

const { faker } = require('@faker-js/faker');
const { register } = require('module');

describe('Settings page', () => {
  const homePage = new HomePageObject();
  const username = faker.word.noun();
  const email = `${username}@gmail.com`;
  const password = '123qwe1234';
  const updatePasswrod = '123qwe321';
  const updateUsername = `${username}1`;
  const bio = faker.word.words(2);
  const updateBio = `${bio} ${username}`;
  const updateEmail = `${updateUsername}@gmail.com`;

  Cypress.on('uncaught:exception', (err, runnable) => {   
    return false; 
});  

  beforeEach(() => {
    cy.task('db:clear');
    cy.register(email, username, password, bio);
    cy.login(email, username, password);
    cy.visit('/');
  });

  it('should provide an ability to update  username', () => {
    homePage.clickOnSettingsLink();
    homePage.fillUpdateSettingUsername(updateUsername);
    homePage.clickOnUpdateSettingsBtn();
    homePage.veifyUpdateUsername(updateUsername);
  });

  it('should provide an ability to update bio', () => {
    homePage.clickOnSettingsLink();
    homePage.fillUpdateSettingsBio(updateBio);
    homePage.clickOnUpdateSettingsBtn();
    homePage.verifyUpdateBio(updateBio);
  });

  it('should provide an ability to update an email', () => {
    homePage.clickOnSettingsLink();
    homePage.fillUpdateSettingsEmail(updateEmail);
    homePage.clickOnUpdateSettingsBtn();
    homePage.clickOnSettingsLink();
    homePage.verifyUpdateEmail(updateEmail);

  });

  it('should provide an ability to update password', () => {
    homePage.clickOnSettingsLink();
    homePage.fillUpdateSettingPassword(updatePasswrod);
    homePage.clickOnUpdateSettingsBtn();
  });

});
