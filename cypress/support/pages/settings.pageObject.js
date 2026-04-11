import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

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

  get submitBtn() {
    return cy.getByDataCy('submit');
  }

  get logoutBtn() {
    return cy.getByDataCy('logout');
  }

  updateField(fieldGetter, value) {
    this[fieldGetter].should('be.visible').clear();
    this[fieldGetter].type(value);
  }

  clickSubmit() {
    this.submitBtn.should('be.visible').click();
  }

  clickLogout() {
    this.logoutBtn.should('be.visible').click();
  }
}

export default SettingsPageObject;
