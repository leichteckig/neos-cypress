describe('Log into Neos', () => {
    beforeEach(() => {
        cy.intercept({
            url: '/neos/ui-services/change',
            method: 'POST'
        }).as('change');

        cy.visit('/');
    })

    it('should log in and create a new page', () => {
        // Login
        cy.get('.neos-login-box').should('be.visible');
        cy.get('#username').type(Cypress.env('user'));
        cy.get('#password').type(Cypress.env('pass'),{ log: false });

        // Point for mistake?
        cy.contains('.neos-actions', 'Login').should('be.visible');
        cy.contains('.neos-actions', 'Login').click();
        cy.get('.style__logo___3Jtvl').should('be.visible');

        // Create new page
        cy.get('#neos-PageTree-AddNode').click();
        cy.get('.style__panel__contents___2NfjT > :nth-child(2) > .style__btn___3rhzP').click();

        // Configure and save page
        cy.get('.style__dialog__contents___32lNX').should('be.visible');
        cy.get('#__neos__editor__property---title--creation-dialog').type('Created by Cypress');
        cy.get('#neos-NodeCreationDialog-CreateNew').click();

        // Verify page (API and Assertion)
        cy.wait('@change').its('response.statusCode').should('equal', 200)
        cy.contains('#treeitem-5c3b6d8e-label', 'Created by Cypress').should('be.visible');
    });
});