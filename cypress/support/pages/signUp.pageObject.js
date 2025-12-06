import PageObject from '../PageObject';

class SignUpPageObject extends PageObject {
  url = '/user/register';

  get userNameField() {
    return cy.getByDataCy('username-sign-up');
  }

  get emailField() {
    return cy.getByDataCy('email-sign-in');
  }

  get passwordField() {
    return cy.getByDataCy('password-sign-in');
  }

  get signUpBtn() {
    return cy.getByDataCy('sign-in-btn');
  }

  get errorMessages() {
    return cy.get('.error-messages > :nth-child(1)');
  }

  typeUserName(username) {
    this.userNameField.type(username);
  }

  typeEmail(email) {
    this.emailField.type(email);
  }

  typePassword(password) {
    this.passwordField.type(password);
  }

  clickSignUpBtn() {
    this.signUpBtn.click();
  }
}

export default SignUpPageObject;
