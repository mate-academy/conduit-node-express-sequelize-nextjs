import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';
  get usernameField() {
    return cy.get('input[placeholder="Username"]');
  }

  get bioField() {
    return cy.get('textarea[placeholder="Short bio about you"]');
  }

  get emailField() {
    return cy.get('input[placeholder="Email"]');
  };

  get passwordField() {
    return cy.get('input[placeholder="New Password"]');
  }

  get submitBtn() {
    return cy.get('button[type="submit"]');
  };

  get logoutBtn() {
    return cy.get('.btn-outline-danger');
  }

  updateField(fieldGetter, value) {
    this[fieldGetter].should('be.visible').clear();
    this[fieldGetter].type(value);
  }

  clickSubmit() {
    this.submitBtn.click();
  }

  clickLogout() {
    this.logoutBtn.click();
  }
}

export default SettingsPageObject;
