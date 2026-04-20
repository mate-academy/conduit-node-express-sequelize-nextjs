import PageObject from '../PageObject';

class homePageObject extends PageObject {
  url = '/#/';

  get usernameLink() {
    return cy.getByDataCy('/profile/');
  }
}

export default homePageObject;
