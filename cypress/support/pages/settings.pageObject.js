import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

  get userNameField() {
    return cy.get('[data-cy="username"]');
  }

  get bioField() {
    return cy.getByDataCy('bio');
  }

  get emailField() {
    return cy.get('[data-cy="email"]');
  }

  get passwordField() {
    return cy.get('[data-cy="password"]');
  }

  get submitButton() {
    return cy.contains('[data-cy="submitButton"]', 'Update Settings');
  }

  get logoutButton() {
    return cy.get('.btn-outline-danger');
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
    this.submitButton.click();
  }

  logoutSettings() {
    this.logoutButton.click();
}

}

export default SettingsPageObject;
