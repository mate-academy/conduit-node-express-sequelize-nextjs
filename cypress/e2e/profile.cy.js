import { faker } from '@faker-js/faker';
import ProfilePage from '../support/pages/ProfilePage';

const profilePage = new ProfilePage();

describe('Profile update tests', () => {
    beforeEach(() => {
        // Clear DB (adjust your command if needed)
        cy.exec('npm run db:reset');

        // Login
        cy.visit('/login');
        cy.get('[data-cy=email]').type('test@example.com');
        cy.get('[data-cy=password]').type('password123');
        cy.get('[data-cy=login]').click();

        // Ensure we are on profile page
        cy.url().should('include', '/profile');
    });

    it('updates bio', () => {
        const bio = faker.lorem.sentence();
        profilePage.updateBio(bio);
        profilePage.submit();
        profilePage.getBioField().should('have.value', bio);
    });

    it('updates username', () => {
        const username = faker.internet.userName();
        profilePage.updateUsername(username);
        profilePage.submit();
        profilePage.getUsernameField().should('have.value', username);
    });

    it('updates email', () => {
        const email = faker.internet.email();
        profilePage.updateEmail(email);
        profilePage.submit();
        profilePage.getEmailField().should('have.value', email);
    });

    it('updates password', () => {
        const password = faker.internet.password(12);
        profilePage.updatePassword(password);
        profilePage.submit();
        cy.contains('Profile updated successfully'); // adjust according to your app
    });
});
