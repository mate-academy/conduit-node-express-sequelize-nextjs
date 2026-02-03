/// <reference types="cypress" />

// ===============================
// Utils
// ===============================
Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy^="${selector}"]`);
});

// ===============================
// Auth commands (RealWorld API)
// ===============================

// REGISTER
// POST /api/users
Cypress.Commands.add(
  'register',
  (email, username, password) => {
    cy.request('POST', '/api/users', {
      user: {
        email,
        username,
        password,
      },
    }).then((response) => {
      // Persist user in localStorage to be authenticated in UI
      window.localStorage.setItem(
        'user',
        JSON.stringify(response.body.user)
      );
    });
  }
);

// LOGIN
// POST /api/users/login
Cypress.Commands.add(
  'login',
  (email, password) => {
    cy.request('POST', '/api/users/login', {
      user: {
        email,
        password,
      },
    }).then((response) => {
      // Normalize user object as frontend expects
      const user = {
        bio: response.body.user.bio,
        effectiveImage:
          response.body.user.image ||
          'https://static.productionready.io/images/smiley-cyrus.jpg',
        email: response.body.user.email,
        image: response.body.user.image,
        token: response.body.user.token,
        username: response.body.user.username,
      };

      window.localStorage.setItem('user', JSON.stringify(user));
      cy.setCookie('auth', response.body.user.token);
    });
  }
);
