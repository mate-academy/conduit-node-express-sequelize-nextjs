import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  get usernameField() {
    return cy.get('[data-cy="username"]');
  }

  get bioField() {
    return cy.get('[data-cy="bio"]');
  }

  get emailField() {
    return cy.get('[data-cy="email"]');
  }

  get passwordField() {
    return cy.get('[data-cy="password"]');
  }

  get updateButton() {
    return cy.get('[data-cy="update-btn"]');
  }

  get logoutButton() {
    return cy.get('[data-cy="logout-btn"]');
  }

  visit() {
    cy.visit('/settings');
  }

  typeUsername(username) {
    this.usernameField.clear().type(username);
  }

  typeBio(bio) {
    this.bioField.clear().type(bio);
  }

  typeEmail(email) {
    this.emailField.clear().type(email);
  }

  typePassword(password) {
    this.passwordField.clear().type(password);
  }

  clickUpdate() {
    this.updateButton.click();
  }

  clickLogout() {
    this.logoutButton.click();
  }

  assertUpdatedUsername(username) {
    cy.get('.navbar').should('contain.text', username);
  }

  assertUpdatedBio(bio) {
    cy.get('.user-info').should('contain.text', bio);
  }

  assertUpdatedEmail(email) {
    this.emailField.should('have.value', email);
  }
}

export default SettingsPageObject;
