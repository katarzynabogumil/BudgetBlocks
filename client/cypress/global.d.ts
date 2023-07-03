declare namespace Cypress {
  interface Chainable {
    login(): Chainable<any>;
    visitLoggedIn(endpoint: string, token: string): Chainable<any>;
  }
}