/// <reference types="cypress" />
/// <reference types="../support" />

import ProfilePageObject from '../support/pages/profile.pageObject';
import { faker } from '@faker-js/faker';

const profilePage = new ProfilePageObject();

describe('Settings Page', () => {
  before(() => {
    cy.task('db:clear'); // Clear database before tests
    cy.login('testuser', 'TestPassword123');
    profilePage.visit();
  });

  it('should provide an ability to update username', () => {
    profilePage.updateUsername(faker.internet.userName());
    profilePage.assertUpdateSuccess();
  });

  it('should provide an ability to update bio', () => {
    profilePage.updateBio(faker.lorem.sentence());
    profilePage.assertUpdateSuccess();
  });

  it('should provide an ability to update email', () => {
    profilePage.updateEmail(faker.internet.email());
    profilePage.assertUpdateSuccess();
  });

  it('should provide an ability to update password', () => {
    profilePage.updatePassword('TestPassword123', faker.internet.password());
    profilePage.assertUpdateSuccess();
  });

  it('should provide an ability to log out', () => {
    profilePage.logout();
    cy.url().should('include', '/login'); // Validate redirect
  });
});
