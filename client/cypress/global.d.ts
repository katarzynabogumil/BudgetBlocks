declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<HTMLElement>;
    dataTestId(value: string): Chainable<JQuery<HTMLElement>>;
    dataTestIdVisible(value: string): Chainable<JQuery<HTMLElement>>;
  }
}