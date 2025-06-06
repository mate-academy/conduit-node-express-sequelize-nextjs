/// <reference types="cypress" />
/// <reference types="../support" />

import SignUpPageObject from '../support/pages/signUp.pageObject';
import HomePageObject from '../support/pages/home.pageObject';
import { faker } from '@faker-js/faker';

const signUpPage = new SignUpPageObject();
const homePage = new HomePageObject();

describe('Sign Up Page', () => {
  let user;

  before(() => {
    cy.task('db:clear'); // Ensure clean database state
    user = {
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  it('should register a user with valid credentials', () => {
    signUpPage.signUp(user);
    homePage.assertUserLoggedIn(user.username);
  });

  it('should prevent registration with an already taken email', () => {
    signUpPage.signUp(user); // Using same email
    signUpPage.assertErrorMessage('Email already in use');
  });

  it('should prevent registration with a weak password', () => {
    signUpPage.signUp({
      ...user,
      password: '123',
    });
    signUpPage.assertErrorMessage('Password too short');
  });
});
