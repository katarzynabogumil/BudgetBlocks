describe('landing page', () => {
  it('should display title, log in and sign up buttons', () => {
    cy.visit('/');
    cy.dataTestId('title').should('be.visible');
    cy.dataTestId('log-in').should('be.visible');
    cy.dataTestId('sign-up').should('be.visible');
  });
});