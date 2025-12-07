import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

  get userNameField() {
    return cy.getByDataCy('username');
  }

  get bioField() {
    return cy.get('[data-cy="bio"]');
  }

  get emailField() {
    return cy.getByDataCy('email');
  }

  get passwordField() {
    return cy.getByDataCy('password');
  }

  get submitButton() {
    return cy.getByDataCy('submitButton').contains('Update Settings');
  }

  get logoutButton() {
    return cy.getByDataCy('logoutBtn');
  }

 

  typeUserName(username) {
    this.userNameField.type(username);
  }

  typeBio(bio) {
    this.bioField.type(bio);
  }

  typeEmail(email) {
    this.emailField.type(email);
  }

  typePassword(password) {
    this.passwordField.type(password);
  }

  updateSettings() {
    return this.submitButton.click();
  }

  logoutSettings() {
    this.logoutButton.click();
}

}

export default SettingsPageObject;
