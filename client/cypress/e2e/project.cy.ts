import { mockdata } from '../fixtures/mockdata';

describe('all-projects-dashboard', () => {
  beforeEach(function () {
    cy.task('db:seed', mockdata.initialData).
      then(() => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.visit('/projects');
        cy.get('h2').contains(mockdata.initialData.project.name).click();
      });
  });

  afterEach(function () {
    cy.task('db:teardown', mockdata.initialData.user.sub);
  });

  it('should successfully display project information', () => {
    cy.get('h2').contains(mockdata.initialData.project.name);
    cy.get('a').contains('edit');
    cy.get('a').contains('remove');
    cy.get('a').contains('add users');

    cy.get('b').contains('Budget:');
    cy.get('b').contains('Project information:');

    cy.get('h2').contains('Add an expense');
  });

  it('should successfully display expense information', () => {
    cy.get('h2').contains(mockdata.initialData.expense.name);
    cy.get('b').contains('Category:');
    cy.get('div').contains(mockdata.initialData.category.category);
    cy.get('b').contains('Cost:');
    cy.get('div').contains(mockdata.initialData.expense.cost);
  });

  describe('add expense', () => {

    it('should successfully add an expense to an existing category', () => {
      cy.get('h2').contains('Add an expense').click();
      const newExpense = {
        name: 'New expense',
        cost: '100',
        category: 'Flights',
      }
      cy.get('input[formcontrolname="name"]').type(newExpense.name);
      cy.get('input[formcontrolname="cost"]').type(newExpense.cost);
      cy.get('select[formcontrolname="formCategory"]').select(newExpense.category);
      cy.get('button[type="submit"]').click();

      cy.get('h2').contains(newExpense.name);
      cy.get('div').contains(newExpense.cost);
      cy.get('div').contains(newExpense.category);
    });

    it('should successfully add an expense to a new category', () => {
      cy.get('h2').contains('Add an expense').click();
      const newExpense = {
        name: 'New expense',
        cost: '100',
        category: 'add new',
        newCategory: 'New category',
      }
      cy.get('input[formcontrolname="name"]').type(newExpense.name);
      cy.get('input[formcontrolname="cost"]').type(newExpense.cost);
      cy.get('select[formcontrolname="formCategory"]').select(newExpense.category);
      cy.get('input[formcontrolname="newCategory"]').type(newExpense.newCategory);
      cy.get('button[type="submit"]').click();

      cy.get('h2').contains(newExpense.name);
      cy.get('div').contains(newExpense.cost);
      cy.get('div').contains(newExpense.newCategory);
    });

    it('should validate fields', () => {
      cy.get('h2').contains('Add an expense').click();

      cy.get('button[type="submit"]').click();

      cy.get('div').contains('Name is required.');
      cy.get('div').contains('Cost is required.');
      cy.get('div').contains('Category is required.');
    });
  });

  describe('edit expense', () => {
    it('should successfully edit an expense', () => {
      cy.get('span').contains('expand_circle_down').click();
      cy.get('app-expense-details').find('a').contains('edit').click();

      const newName = 'New name';
      cy.get('input[formcontrolname="name"]').clear();
      cy.get('input[formcontrolname="name"]').type(newName);
      cy.get('button[type="submit"]').click();

      cy.get('h2').contains(newName);
    });

    it('should validate fields', () => {
      cy.get('span').contains('expand_circle_down').click();
      cy.get('app-expense-details').find('a').contains('edit').click();

      cy.get('input[formcontrolname="name"]').clear();
      cy.get('input[formcontrolname="cost"]').clear();
      cy.get('select[formcontrolname="formCategory"]').select('add new');

      cy.get('button[type="submit"]').click();

      cy.get('div').contains('Name is required.');
      cy.get('div').contains('Cost is required.');
      cy.get('div').contains('Category is required.');
    });
  });

  describe('delete expense', () => {
    it('should successfully delete expense', () => {
      cy.get('span').contains('expand_circle_down').click();
      cy.get('app-expense-details').find('a').contains('remove').click();
      cy.get('h2').contains(mockdata.initialData.project.name);
      cy.contains('h2', mockdata.initialData.expense.name).should('not.exist');
    });
  });
});
