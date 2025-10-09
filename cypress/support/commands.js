Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', '/api/users/login', { email, password })
    .its('body')
    .then((body) => {
      window.localStorage.setItem('token', body.user.token);
    });
});

 testing
Cypress.Commands.add('createArticle', (title, desc, body) => {
  const token = window.localStorage.getItem('token');
  cy.request({
    method: 'POST',
    url: '/api/articles',
    headers: { Authorization: `Token ${token}` },
    body: { article: { title, description: desc, body } },

Cypress.Commands.add('login', (email = 'riot@qa.team', username = 'riot', password = '12345Qwert!') => {
  cy.request('POST', '/api/users', {
    user: {
      email,
      username,
      password
    }
  }).then((response) => {
    const user = {
      bio: response.body.user.bio,
      effectiveImage: 'https://static.productionready.io/images/smiley-cyrus.jpg',
      email: response.body.user.email,
      image: response.body.user.image,
      token: response.body.user.token,
      username: response.body.user.username,
    };
    window.localStorage.setItem('user', JSON.stringify(user));
    cy.setCookie('auth', response.body.user.token);
next
  });
});
