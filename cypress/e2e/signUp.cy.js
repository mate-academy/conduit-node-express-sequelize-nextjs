/* eslint-disable max-len */
/// <reference types="cypress" />
/// <reference types="../support" />

import SignUpPageObject from '../support/pages/signUp.pageObject';
import homePageObject from '../support/pages/home.pageObject';

const signUpPage = new SignUpPageObject();
const homePage = new homePageObject();

describe('Sign Up page', () => {
  let user;
  let user2;
  before(() => {
    cy.task('db:clear');
    cy.task('generateUser').then((generateUser) => {
      user = generateUser;
    });

    cy.task('generateUser').then((generateUser) => {
      user2 = generateUser;
    });
     
  });

 it('should provide an ability to log in with existing credentials', () => {
   signUpPage.visit();
   // cy.register(user.email, user.username, user.password)
signUpPage.typeUserName(user.username);
   signUpPage.typeEmail(user.email);
   signUpPage.typePassword(user.password);
   signUpPage.clickSignUpBtn();

   homePage.assertHeaderContainUsername(user.username);
 });

  it('should provide an ability to log in with tooken username', () => {
    signUpPage.visit();
    // cy.register(user.email, user.username, user.password)
    signUpPage.typeUserName(user.username);
    signUpPage.typeEmail(user2.email);
    signUpPage.typePassword(user.password);
    signUpPage.clickSignUpBtn();
signUpPage.errorMessages.should('have.text', 'username:This username is taken.');
    
  });

  it('should provide an ability to log in with tooken email', () => {
    signUpPage.visit();
    // cy.register(user.email, user.username, user.password)
    signUpPage.typeUserName(user2.username);
    signUpPage.typeEmail(user.email);
    signUpPage.typePassword(user.password);
    signUpPage.clickSignUpBtn();
    signUpPage.errorMessages.should('have.text', 'email:This email is taken.');
  });

  it('should provide an ability to log in with the same password', () => {
   
    signUpPage.visit();
    // cy.register(user.email, user.username, user.password)
    signUpPage.typeUserName(user2.username);
    signUpPage.typeEmail(user2.email);
    signUpPage.typePassword(user.password);
    signUpPage.clickSignUpBtn();
     homePage.assertHeaderContainUsername(user2.username);
  });

  
});
