/// <reference types="cypress" />

Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy^="${selector}"]`);
});

Cypress.Commands.add(
  'register',
  (
    email = 'riot@qa.team',
    username = 'riot',
    password = '12345Qwert!',
  ) => {
    return cy.request('POST', '/api/users', {
      user: {
        email,
        username,
        password,
      },
    });
  },
);

Cypress.Commands.add(
  'login',
  (
    email = 'riot@qa.team',
    username = 'riot',
    password = '12345Qwert!',
  ) => {
    return cy.request('POST', '/api/users', {
      user: {
        email,
        username,
        password,
      },
    }).then((response) => {
      const user = {
        bio: response.body.user.bio,
        effectiveImage:
          'https://static.productionready.io/images/smiley-cyrus.jpg',
        email: response.body.user.email,
        image: response.body.user.image,
        token: response.body.user.token,
        username: response.body.user.username,
      };

      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('user', JSON.stringify(user));
          win.document.cookie = `auth=${user.token};path=/`;
        },
      });
    });
  },
);
