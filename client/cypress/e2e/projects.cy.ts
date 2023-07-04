import { mockdata } from '../fixtures/mockdata';

describe('login', () => {
  beforeEach(function () {
    cy.task('db:seed', mockdata.initialData).
      then(() => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.visit('/projects');
      });
  });

  afterEach(function () {
    cy.task('db:teardown', mockdata.initialData.user.sub);
  });

  it('should successfully log into our app', () => {
    cy.get('h1').contains('BudgetBlocks');
    cy.get('h2').contains('Hi, Example! Here are your projects.');
    //     cy.contains('button', 'Logout').should('be.visible');
  });


});
