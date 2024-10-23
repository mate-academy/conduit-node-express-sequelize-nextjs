import PageObject from '../PageObject';

class HomePageObject extends PageObject {
  url = '/#/';

  get usernameLink() {
    return cy.getByDataCy('profile-link');
  }

  assertHeaderContainUsername(username) {
    this.usernameLink
      .should('contain', username);
  }
  get settingsLink() {
    return cy.getByDataCy('user-seting-link');
  }
  clickOnSettingsLink() {
    this.settingsLink.click();
  }

  get settingsUsernameFiled() {
    return cy.getByDataCy('username-input-field');
  }

  fillUpdateSettingUsername(updateUsername) {
    this.settingsUsernameFiled.should('not.be.disabled')
      .clear().type(updateUsername);
  }

  get updateSettingsBtn() {
    return cy.getByDataCy('update-settings-button');
  }

  clickOnUpdateSettingsBtn() {
    this.updateSettingsBtn.click();
  }

  veifyUpdateUsername(updateUsername) {
    this.usernameLink.should('contain', updateUsername);
  }
  get settingsBioField() {
    return cy.getByDataCy('bio-input-field');
  }

  fillUpdateSettingsBio(updateBio) {
    this.settingsBioField.clear().type(updateBio);
  }
  get accountBioField() {
    return cy.getByDataCy('account-bio-field');
  }

  verifyUpdateBio(updateBio) {
    this.accountBioField.should('contain', updateBio);
  }

  get settingsEmailFiled() {
    return cy.getByDataCy('email-input-field');
  }

  fillUpdateSettingsEmail(updateEmail) {
    this.settingsEmailFiled.clear().type(updateEmail);
  }

  verifyUpdateEmail(updateEmail) {
    this.settingsEmailFiled.should('contain.value', updateEmail);
  }

  get newPasswrodField() {
    return cy.getByDataCy('newpassword-input-field');
  }

  fillUpdateSettingPassword(updatePasswrod) {
    this.newPasswrodField.type(updatePasswrod);
  }

}

export default HomePageObject;
