describe('login', () => {
  beforeEach(function () {
    cy.login();
  });

  it('should successfully log into our app', () => {
    cy.get('h1').contains('BudgetBlocks');
    cy.get('h2').contains('Hi, Example! Here are your projects.');
  });
});
