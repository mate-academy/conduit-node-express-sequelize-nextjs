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

  updateEmail(newEmail) {
    cy.get('[data-cy=settings-email]').clear();
    cy.get('[data-cy=settings-email]').type(newEmail);
    // Use the same save button for consistency, update if your UI uses a single save button
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
    // Update the message if your app uses a different success notification
    cy.contains('Update successful').should('exist');
  }
}

export default ProfilePageObject;
