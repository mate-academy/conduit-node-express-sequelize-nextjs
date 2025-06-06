
import PageObject from '../PageObject';

class ProfilePageObject extends PageObject {
  visit() {
    cy.visit('/settings');
  }

  updateBio(bio) {
    cy.get('[data-cy=bio]').clear();
    cy.get('[data-cy=bio]').type(bio);
    cy.get('[data-cy=save-settings]').click();
  }

  updateUsername(username) {
    cy.get('[data-cy=username]').clear();
    cy.get('[data-cy=username]').type(username);
    cy.get('[data-cy=save-settings]').click();
  }

  updateEmail(email) {
    cy.get('[data-cy=email]').clear();
    cy.get('[data-cy=email]').type(email);
    cy.get('[data-cy=save-settings]').click();
  }

  updatePassword(oldPassword, newPassword) {
    cy.get('[data-cy=old-password]').type(oldPassword);
    cy.get('[data-cy=new-password]').type(newPassword);
    cy.get('[data-cy=save-settings]').click();
  }

  logout() {
    cy.contains('Log Out').click();
  }

  assertUpdateSuccess() {
    cy.contains('.success-message', 'Settings updated successfully').should(
      'be.visible'
    );
  }
}

export default ProfilePageObject;
