import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/#/settings';

  get bioField() { return cy.getByDataCy('settings-bio'); }
  get usernameField() { return cy.getByDataCy('settings-username'); }
  get emailField() { return cy.getByDataCy('settings-email'); }
  get passwordField() { return cy.getByDataCy('settings-password'); }
  get updateBtn() { return cy.getByDataCy('settings-submit'); }
  get logoutBtn() { return cy.getByDataCy('settings-logout'); }

  typeBio(v) { this.bioField.clear().type(v); }
  typeUsername(v) { this.usernameField.clear().type(v); }
  typeEmail(v) { this.emailField.clear().type(v); }
  typePassword(v) { this.passwordField.clear().type(v); }
  submit() { this.updateBtn.click(); }
  logout() { this.logoutBtn.click(); }
}
export default SettingsPageObject;
