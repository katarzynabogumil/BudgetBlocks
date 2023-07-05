describe('login', () => {
  beforeEach(function () {
    cy.login(Cypress.env('email'), Cypress.env('password'));
  });

  it('should successfully log into our app', () => {
    cy.get('h1').contains('BudgetBlocks');
    cy.get('h2').contains('Hi, Example! Here are your projects.');
    cy.get('h2').contains('Add a project');
    cy.get('span').contains('all projects');
    cy.get('span').contains('log out');
  });
});

