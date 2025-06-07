/// <reference types="cypress" />
/// <reference types="../support" />

import SignUpPageObject from '../support/pages/signUp.pageObject';  
import HomePageObject from '../support/pages/home.pageObject';
import { faker } from '@faker-js/faker';

const signUpPage = new SignUpPageObject();
const homePage = new HomePageObject();

describe('Sign Up Page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear'); // Ensure clean database state before each test
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
    signUpPage.signUp(user); // Register first time
    signUpPage.signUp(user); // Try to register again with same email
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
