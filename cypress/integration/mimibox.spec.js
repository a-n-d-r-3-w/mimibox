// mimibox.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('My First Test', () => {
    it('Visits the Kitchen Sink', () => {
        cy.visit('./index.html')

        cy.get('#entries tr').should('have.length', 3);
        cy.get('#entries tr').eq(0).get('th').eq(0).contains('th', 'Account');
        cy.get('#entries tr').eq(0).get('th').eq(1).contains('th', 'Username');
        cy.get('#entries tr').eq(0).get('th').eq(2).contains('th', 'Password');

        cy.get('#new-entry-account').type('Gmail');
        cy.get('#new-entry-username').type('mimibox@gmail.com');
        cy.get('#new-entry-password').type('guitar45Conjured51noted');
        cy.get('#add').click();
        
        cy.get('#new-entry-account').should('be.empty');
        cy.get('#new-entry-username').should('be.empty');
        cy.get('#new-entry-password').should('be.empty');

        cy.get('#entries tr').should('have.length', 4);

        cy.get('#entries tr').eq(1).get('td').eq(0).contains('Gmail');
        cy.get('#entries tr').eq(1).get('td').eq(1).contains('mimibox@gmail.com');
    })
})
