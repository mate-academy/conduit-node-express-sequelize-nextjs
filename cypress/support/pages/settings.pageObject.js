import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

  get updateSettingsBtn() {
    return cy.get('[data-cy=update-settings-button]');
  }

  get logoutBtn() {
    return cy.get('[data-cy=logout-btn]');
  }

  changeInput(dataCy, newValue) {
    cy.get(`[data-cy=${dataCy}]`).clear();
    cy.get(`[data-cy=${dataCy}]`).type(newValue);
  }

  assertInputValue(dataCy, expectedValue) {
    cy.get(`[data-cy=${dataCy}]`).should('have.value', expectedValue);
  }

  checkProfileUrl(username) {
    cy.url().should('include', `/profile/${username}`);
  }

  clickOnUpdateSettingsBtn() {
    this.updateSettingsBtn.click();
  }

  clickOnLogoutBtn() {
    this.logoutBtn.click();
  }

  logout() {
    this.clickOnLogoutBtn();
  }
}

export default SettingsPageObject;
