class PageObject {
  visit(url) {
    cy.visit(url || this.url);
  }

  get homeLink() {
    return cy.getByDataCy('home-link');
  }

  get settingsLink() {
    return cy.getByDataCy('settings-link');
  }

  get profileLink() {
    return cy.getByDataCy('profile-link');
  }

  clickSettings() {
    this.settingsLink.click();
  }
}

export default PageObject;
