Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', '/api/users/login', { email, password })
    .its('body')
    .then((body) => {
      window.localStorage.setItem('token', body.user.token);
    });
});

Cypress.Commands.add('createArticle', (title, desc, body) => {
  const token = window.localStorage.getItem('token');
  cy.request({
    method: 'POST',
    url: '/api/articles',
    headers: { Authorization: `Token ${token}` },
    body: { article: { title, description: desc, body } },
  });
});
