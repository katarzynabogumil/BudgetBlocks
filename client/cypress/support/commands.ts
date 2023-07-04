/// <reference types="cypress" />
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
Cypress.Commands.add('login', (email: string, password: string) => {
  const log = Cypress.log({
    displayName: "AUTH0 LOGIN",
    message: [`Authenticating ${email}`],
    autoEnd: false,
  });
  log.snapshot("before");

  const args = { email, password };

  cy.visit('http://localhost:4200/');
  cy.get('.auth-btn').contains('Log In').click();

  cy.origin(Cypress.env('auth0_domain'), { args }, ({ email, password }) => {
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[name="submit"]').click();
  });

  cy.url().should("equal", "http://localhost:4200/projects");

  log.snapshot("after");
  log.end();
});


Cypress.Commands.add('visitLoggedIn', (endpoint, token) => {
  Cypress.log({
    name: 'visitLoggedIn',
  });

  const options = {
    method: 'GET',
    url: `http://localhost:4200${endpoint}`,
    auth: {
      'bearer': token
    }
  };
  return cy.request(options);
});

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
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }