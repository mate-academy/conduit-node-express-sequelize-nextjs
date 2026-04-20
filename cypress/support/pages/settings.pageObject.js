import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

  get updateSettingsBtn() {
    return cy.get('[data-cy="update-settings-btn"]');
  }

  get logoutBtn() {
    return cy.get('[data-cy="logout-btn"]');
  }

  changeItem(placeholder, newValue) {
    cy.get(`[placeholder="${placeholder}"]`).as('input');
    cy.get('@input').clear();
    cy.get('@input').type(newValue);
  }

  changeItemByDataCy(dataCy, newValue) {
    cy.get(`[data-cy="${dataCy}"]`).clear();
    cy.get(`[data-cy="${dataCy}"]`).type(newValue);
  }

  clickOnUpdateSettingsBtn() {
    this.updateSettingsBtn.click();
  }

  clickOnLogoutBtn() {
    this.logoutBtn.click();
  }
}

export default SettingsPageObject;
