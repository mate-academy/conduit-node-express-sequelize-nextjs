import PageObject from './pageObject';

export default class SettingsPageObject extends PageObject {
  visit() {
    cy.visit('/settings');
    return this;
  }
  bioInput() { return cy.get('[data-cy="bio-input"]'); }
  usernameInput() { return cy.get('[data-cy="username-input"]'); }
  emailInput() { return cy.get('[data-cy="email-input"]'); }
  passwordInput() { return cy.get('[data-cy="password-input"]'); }
  saveButton() { return cy.get('[data-cy="save-button"]'); }
}
