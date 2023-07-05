describe('login', () => {
  beforeEach(function () {
    cy.login(Cypress.env('email'), Cypress.env('password'));
  });

  it('should successfully log into our app', () => {
    cy.get('h1').contains('BudgetBlocks');
    cy.contains('Hi, Example! Here are your projects.');
    cy.contains('Add a project');
    cy.contains('all projects');
    cy.contains('log out');
  });
});

