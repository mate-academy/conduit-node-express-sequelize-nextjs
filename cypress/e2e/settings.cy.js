/// <reference types="cypress" />
/// <reference types="../support" />

import { faker } from '@faker-js/faker';
import SettingsPageObject from '../support/pages/settings.pageObject';
import ProfilePageObject from '../support/pages/profile.pageObject';
import HomePageObject from '../support/pages/home.pageObject';

const settings = new SettingsPageObject();
const profile = new ProfilePageObject();
const home = new HomePageObject();

describe('Settings page', () => {
  let user;

  before(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((u) => { user = u; });
  });

  beforeEach(() => {
    cy.task('db:clear');
    cy.register(user.email, user.username, user.password);
    cy.login(user.email, user.password);
    settings.visit();
  });

  it('should provide an ability to update username', () => {
    const newUsername = faker.internet.username({ firstName: faker.person.firstName() }).slice(0, 15);

    settings.typeUsername(newUsername);
    settings.submit();

    cy.visit(profile.urlFor(newUsername));
    profile.assertUsernameIs(newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence(8);

    settings.typeBio(newBio);
    settings.submit();

    cy.visit(profile.urlFor(user.username));
    profile.assertBioIs(newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet.email({ allowSpecialCharacters: false }).toLowerCase();

    settings.typeEmail(newEmail);
    settings.submit();

    settings.visit();
    settings.logout();

    cy.visit('/#/login');
    cy.login(newEmail, user.password);

    home.assertHeaderContainUsername(user.username);
  });

  it('should provide an ability to update password', () => {
    const newPassword = faker.internet.password({ length: 12, memorable: false, pattern: /[A-Za-z0-9!@#$%]/ });

    settings.typePassword(newPassword);
    settings.submit();

    settings.visit();
    settings.logout();

    cy.visit('/#/login');
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      failOnStatusCode: false,
      body: { user: { email: user.email, password: user.password } }
    }).its('status').should('eq', 422);

    cy.login(user.email, newPassword);
    home.assertHeaderContainUsername(user.username);
  });

  it('should provide an ability to log out', () => {
    settings.logout();
    cy.getByDataCy('nav-sign-in').should('be.visible');
    cy.getCookie('auth').should('not.exist');
    cy.visit('/#/settings');
    cy.url().should('include', '/#/login');
  });
});
