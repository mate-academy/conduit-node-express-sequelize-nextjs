import PageObject from '../PageObject';

class SignInPageObject extends PageObject {
  url = '/#/login';

  get emailField() { return cy.getByDataCy('email-sign-in'); }
  get passwordField() { return cy.getByDataCy('password-sign-in'); }
  get signInBtn() { return cy.getByDataCy('sign-in-btn'); }
  get errorList() { return cy.getByDataCy('form-errors'); }

  typeEmail(email) { this.emailField.clear().type(email); }
  typePassword(password) { this.passwordField.clear().type(password); }
  clickSignInBtn() { this.signInBtn.click(); }
}
export default SignInPageObject;

