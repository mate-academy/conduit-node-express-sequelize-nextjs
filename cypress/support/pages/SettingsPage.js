import PageObject from '../PageObject';

class SettingsPage extends PageObject {
  url = '/settings';

  // Gettery do pól formularza
  get usernameField() {
    return cy.getByDataCy('username');
  }

  get bioField() {
    return cy.getByDataCy('bio');
  }

  get emailField() {
    return cy.getByDataCy('email');
  }

  get passwordField() {
    return cy.getByDataCy('password');
  }

  get updateBtn() {
    return cy.getByDataCy('update-btn');
  }

  get logoutBtn() {
    return cy.getByDataCy('logout');
  }

  // Metody interakcji
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

  clickUpdateBtn() {
    this.updateBtn.click();
  }

  clickLogoutBtn() {
    this.logoutBtn.click();
