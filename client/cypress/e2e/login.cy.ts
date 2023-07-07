describe('login', () => {
  beforeEach(function () {
    cy.login(Cypress.env('email'), Cypress.env('password'));
  });

  it('should successfully log into our app', () => {
    cy.dataTestId('title').should('be.visible');
    cy.dataTestId('greeting').should('be.visible');
    cy.dataTestId('home').should('be.visible');
    cy.dataTestId('log-out').should('be.visible');
    cy.dataTestId('add-item').should('be.visible');
  });
});

