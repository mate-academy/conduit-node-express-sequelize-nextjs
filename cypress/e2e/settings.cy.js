import { faker } from '@faker-js/faker';
import SettingsPageObject from '../support/pages/settings.pageObject';
import PageObject          from '../support/PageObject';


const settings = new SettingsPageObject();
const common = new PageObject();

describe('Settings (Profile) page', () => {
  let user;

  beforeEach(() => {
    cy.task('db:clear');

    cy.task('generateUser').then((u) => {
      user = u;

      cy.request({
        method: 'POST',
        url: '/api/users',
        body: { user }
      }).its('status').should('eq', 200);

      cy.request({
        method: 'POST',
        url: '/api/users/login',
        body: { user: { email: user.email, password: user.password } }
      })
        .its('body.user.token')
        .then((token) => {
          window.localStorage.setItem('jwtToken', token);
        });

      settings.visit();
    });
  });

  it('updates bio', () => {
    const newBio = faker.lorem.sentence(6);

    settings.bioInput().clear().type(newBio);
    settings.saveButton().click();

    common.toast().should('contain', 'Profile updated');
    common.navProfileLink().click();
    cy.get('[data-cy="user-bio"]').should('contain', newBio);
  });

  it('updates username', () => {
    const newUsername = faker.internet.userName().toLowerCase();

    settings.usernameInput().clear().type(newUsername);
    settings.saveButton().click();

    common.toast().should('contain', 'Profile updated');
    cy.url().should('include', `/@${newUsername}`);
    cy.get('[data-cy="profile-username"]').should('contain', newUsername);
  });

  it('updates email', () => {
    const newEmail = faker.internet.email().toLowerCase();

    settings.emailInput().clear().type(newEmail);
    settings.saveButton().click();

    common.toast().should('contain', 'Profile updated');
    common.logout();
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      body: { user: { email: newEmail, password: user.password } }
    })
      .its('body.user.token')
      .then((token) => {
        window.localStorage.setItem('jwtToken', token);
      });
    common.navProfileLink().click();
    cy.get('[data-cy="profile-email"]').should('contain', newEmail);
  });

  it('updates password', () => {
    const newPassword = `A1!${faker.internet.password(8)}`;

    settings.passwordInput().clear().type(newPassword);
    settings.saveButton().click();

    common.toast().should('contain', 'Profile updated');
    common.logout();
    cy.request({
      method: 'POST',
      url: '/api/users/login',
      body: { user: { email: user.email, password: newPassword } }
    })
      .its('body.user.token')
      .then((token) => {
        window.localStorage.setItem('jwtToken', token);
      });
    cy.visit('/');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });
});
