import PageObject from '../PageObject';

class articlePageObject extends PageObject {
    url = '/editor';

    get articleTitleField() {
        return cy.getByDataCy('article-title');
    }

    typeArticleTitle(articleTitle) {
        return this.articleTitleField.type(articleTitle);
    }

    get articleDescriptionField() {
        return cy.getByPlaceholder(`What's this article about?`);
    }

    typeArticleDescription(description) {
        this.articleDescriptionField.type(description);
    }

    get articleBodyField() {
        return cy.getByPlaceholder(`Write your article (in markdown)`);
    }

    typeArticleBody(body) {
        this.articleBodyField.type(body);
    }

    get articleTagField() {
        return cy.getByPlaceholder('Enter tags');
    }

    typeArticleTag(tag) {
        this.articleTagField.type(tag);
    }

    get publishButton() {
        return cy.contains('button', 'Publish Article');
    }

    assertContainsPublishButton() {
        this.publishButton.should('be.visible');
    }

    clickInPublishButton() {
        this.publishButton.click();
        return cy.url().then((url) => {
            const slug = url.split('/article/')[1];
            return {
                article: {
                    slug
                }
            };
        });
    }

    assertContainsArticleTitle(title) {
        return cy.get('h1').should('contain', title);
    }

    assertContainsBody(body) {
        return cy.get('p').should('contain', body);
    }

    clickInProfileLink() {
        return cy.getByDataCy('profile-link').click();
    }

    assertContainsDescription(description) {
        return cy.get('p').should('contain', description);
    }

    assertContainsTag(tag) {
        return cy.get('.tag-default').should('contain', tag);
    }

    clickInNewArticle() {
        cy.getByDataCy('new-article-link').click();
    }

    clickInEditButton() {
        return cy.contains('a', 'Edit Article')
            .click();
    }

    clickInUpdateArticle() {
        return cy.contains('button', 'Update Article')
            .click();
    }

    clickInDeleteButton() {
        return cy.contains('button', 'Delete Article')
            .click();
    }

    clickInArticle() {
        return cy.get('.preview-link')
            .click();
    }

}

export default articlePageObject;