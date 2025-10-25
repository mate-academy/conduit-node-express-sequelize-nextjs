/// <reference types='cypress' />
/// <reference types='../support' />

import SettingsPage from '../support/pages/SettingsPage';
import faker from 'faker';

describe('Settings page', () => {
  const settingsPage = new SettingsPage();
  const userEmail = Cypress.env('USER_EMAIL');
  const userPassword = Cypress.env('USER_PASSWORD');

  beforeEach(() => {
    cy.task('db:clear'); // czyszczenie bazy przed każdym testem
    cy.login(userEmail, userPassword); // login pomocniczy, jeśli masz taki command
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
    const newPassword = faker.internet.password({ length: 10 }); // długość ustawiona
    settingsPage.typePassword(newPassword);
    settingsPage.clickUpdateBtn();
    settingsPage.assertPasswordUpdated(newPassword);
  });

  it('should provide an ability to log out', () => {
    settingsPage.clickLogoutBtn();
    settingsPage.assertLoggedOut();
  });
});
