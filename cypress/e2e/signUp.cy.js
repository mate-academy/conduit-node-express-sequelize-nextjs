/// <reference types="cypress" />
/// <reference types="../support" />

import { faker } from '@faker-js/faker';

describe('Sign Up page', () => {
  it('should allow user to sign up via API helper and be recognized in UI', () => {
    const email = faker.internet.email({ allowSpecialCharacters: false }).toLowerCase();
    const username = faker.internet.username().slice(0, 15);
    const password = faker.internet.password({ length: 12 });

    cy.register(email, username, password);
    cy.login(email, password);

    cy.getByDataCy('profile-link').should('contain', username);
  });
});
