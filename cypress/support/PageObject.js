class PageObject {
    visit(url) {
        cy.visit(url);
    }

    getByDataCy(selector) {
        return cy.get(`[data-cy=${selector}]`);
    }
}

export default PageObject;
