import PageObject from '../PageObject';

class HomePageObject extends PageObject {
  url = '/#/';

  // Ми використовуємо метод з базового класу PageObject (profileLink)
  assertHeaderContainUsername(username) {
    this.profileLink
      .should('be.visible')
      .should('contain', username);
  }
}

export default HomePageObject;
