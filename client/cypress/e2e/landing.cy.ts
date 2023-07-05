describe('landing page', () => {
  it('the h1 contains the correct text', () => {
    cy.visit('/');
    cy.get('h1').contains('BudgetBlocks');
    cy.get('button').contains('Log In');
    cy.get('button').contains('Sign Up');
  });
});