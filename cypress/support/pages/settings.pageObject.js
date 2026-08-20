import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

  get usernameField() {
    return cy.getByDataCy('settings-username');
  }

  get bioField() {
    return cy.getByDataCy('settings-bio');
  }

  get emailField() {
    return cy.getByDataCy('settings-email');
  }

  get passwordField() {
    return cy.getByDataCy('settings-password');
  }

  get updateSettingsBtn() {
    return cy.getByDataCy('settings-submit');
  }

  get logoutBtn() {
    return cy.getByDataCy('settings-logout');
  }

  assertLoaded() {
    this.usernameField.should('not.have.value', '');
    this.emailField.should('not.have.value', '');
  }

  updateUsername(username) {
    this.usernameField.clear().type(username);
    this.clickUpdateSettingsBtn();
  }

  updateBio(bio) {
    this.bioField.clear().type(bio);
    this.clickUpdateSettingsBtn();
  }

  updateEmail(email) {
    this.emailField.clear().type(email);
    this.clickUpdateSettingsBtn();
  }

  updatePassword(password) {
    this.passwordField.type(password);
    this.clickUpdateSettingsBtn();
  }

  clickUpdateSettingsBtn() {
    cy.intercept('PUT', '**/api/user').as('updateUser');
    this.updateSettingsBtn.click();
    cy.wait('@updateUser')
      .its('response.statusCode')
      .should('eq', 200);
  }

  clickLogoutBtn() {
    this.logoutBtn.click();
  }

  assertEmail(email) {
    this.emailField.should('have.value', email);
  }
}

export default SettingsPageObject;
