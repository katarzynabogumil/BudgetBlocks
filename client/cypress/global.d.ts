declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<any>;
    visitLoggedIn(endpoint: string, token: string): Chainable<any>;
  }
}