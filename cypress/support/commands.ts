/// <reference types='cypress' />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('signOut', () => {
    cy.log(`sign out by clearing all cookies.`);
    cy.clearCookies({ domain: null });
  });
  
  Cypress.Commands.add(`signIn`, () => {
    cy.log(`Signing in.`);
    cy.visit(`/sign-in`);
  
    cy.window()
      .should(window => {
        expect(window).to.not.have.property(`Clerk`, undefined);
      })
      .then(async (window) => {
        expect(window.Clerk.loaded).to.eq(true);
        cy.clearCookies({ domain: null });
        const res = await window.Clerk.client.signIn.create({
          identifier: Cypress.env(`test_email`),
          password: Cypress.env(`test_password`),
        });

        await window.Clerk.setActive({
          session: res.createdSessionId,
        });
        
        cy.log(`Finished Signing in.`);
      });
  });
