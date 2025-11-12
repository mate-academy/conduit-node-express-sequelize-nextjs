/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import { PageObject } from '../support/PageObject';

const page = new PageObject();

describe('Settings Page - profile updates', () => {
  before(() => {
    // wyczyść bazę danych przed uruchomieniem testów
    cy.task('db:reset');
  });

  beforeEach(() => {
    // logowanie istniejącego użytkownika
    cy.signInAsTestUser();
    cy.visit('/settings');
  });

  it('should update bio successfully', () => {
    const newBio = faker.lorem.sentence();

    cy.get('[data-cy="settings-bio"]').clear();
    cy.get('[data-cy="settings-bio"]').type(newBio);

    cy.get('[data-cy="settings-submit"]').click();

    cy.reload();

    cy.get('[data-cy="settings-bio"]').should('have.value', newBio);
  });

  it('should update username successfully', () => {
    const newUsername = faker.internet.userName();

    cy.get('[data-cy="settings-username"]').clear();
    cy.get('[data-cy="settings-username"]').type(newUsername);

    cy.get('[data-cy="settings-submit"]').click();

    cy.reload();

    cy.get('[data-cy="settings-username"]').should('have.value', newUsername);
  });

  it('should update email successfully', () => {
    const newEmail = faker.internet.email();

    cy.get('[data-cy="settings-email"]').clear();
    cy.get('[data-cy="settings-email"]').type(newEmail);

    cy.get('[data-cy="settings-submit"]').click();

    cy.reload();

    cy.get('[data-cy="settings-email"]').should('have.value', newEmail);
  });

  it('should update password successfully', () => {
    const newPassword = faker.internet.password(10);

    cy.get('[data-cy="settings-password"]').clear();
    cy.get('[data-cy="settings-password"]').type(newPassword);

    cy.get('[data-cy="settings-submit"]').click();

    // Sprawdzenie komunikatu o sukcesie
    cy.get('body').should('contain.text', 'Update successful');
  });
});
