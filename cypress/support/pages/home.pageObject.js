import PageObject from '../PageObject';

class HomePageObject extends PageObject {
  url = '/#/';

  get usernameLink() {
    return cy.getByDataCy('profile-link');
  }

  assertHeaderContainUsername(username) {
    this.usernameLink
      .should('contain', username);
  }

  clickInGlobalFeed() {
    return cy.contains('.nav-link', 'Global Feed')
      .click();
  }

  clickInAuthor() {
    return cy.get('.author')
      .click();
  }

  followUser() {
    return cy.contains('button', 'Follow')
      .click();
  }

  assertFollowedUser() {
    return cy.contains('button', 'Unfollow').should('exist');
  }

  unfollowUser() {
    return cy.contains('button', 'Unfollow')
      .click();
  }

  assertUnfollowedUser() {
    return cy.contains('button', 'Follow').should('exist');
  }

}

export default HomePageObject;