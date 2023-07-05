import { mockdata } from '../fixtures/mockdata';

describe('project-dashboard', () => {
  beforeEach(function () {
    cy.task('db:seed', mockdata.invitedUser);
    cy.task('db:seed', mockdata.initialData).
      then(() => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.visit('/projects');
        cy.get('app-project-item').children().contains(mockdata.initialData.project.name).click();
      });
  });

  afterEach(function () {
    cy.task('db:teardown', mockdata.initialData.user.sub);
    cy.task('db:teardown', mockdata.invitedUser.user.sub);
  });

  it('should successfully display project information', () => {
    cy.get('div.main-card').children().contains(mockdata.initialData.project.name);
    cy.get('div.main-card').children().contains('edit');
    cy.get('div.main-card').children().contains('remove');
    cy.get('div.main-card').children().contains('add users');
    cy.get('div.main-card').children().contains('Budget:');
    cy.get('div.main-card').children().contains(mockdata.initialData.project.budget
      .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    cy.get('div.main-card').children().contains('Project information:');
    cy.get('div.main-card').children().contains(mockdata.initialData.project.type);
    cy.get('div.main-card').children().contains(mockdata.initialData.project.destination);
    cy.get('div.main-card').children().contains(mockdata.initialData.project.description);
    cy.contains('Add an expense');
  });

  it('should successfully display expenses information', () => {
    cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[0].name);
    cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[1].name);
    cy.get('app-expense-item').children().contains('Category:');
    cy.get('app-expense-item').children().contains(mockdata.initialData.category.category);
    cy.get('app-expense-item').children().contains('Cost:');
    cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[0].cost);
    cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[1].cost);
  });

  describe('add expense', () => {
    it('should successfully add an expense to an existing category', () => {
      cy.contains('Add an expense').click();
      const newExpense = {
        name: 'New expense',
        cost: '100',
        category: 'Flights',
      }
      cy.get('input[formcontrolname="name"]').type(newExpense.name);
      cy.get('input[formcontrolname="cost"]').type(newExpense.cost);
      cy.get('select[formcontrolname="formCategory"]').select(newExpense.category);
      cy.get('button[type="submit"]').click();

      cy.get('app-expense-item').children().contains(newExpense.name);
      cy.get('app-expense-item').children().contains(newExpense.cost);
      cy.get('app-expense-item').children().contains(newExpense.category);
    });

    it('should successfully add an expense to a new category', () => {
      cy.contains('Add an expense').click();
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

      cy.get('app-expense-item').children().contains(newExpense.name);
      cy.get('app-expense-item').children().contains(newExpense.cost);
      cy.get('app-expense-item').children().contains(newExpense.newCategory);
    });

    it('should validate fields', () => {
      cy.contains('Add an expense').click();

      cy.get('button[type="submit"]').click();

      cy.get('app-expense-form').children().contains('Name is required.');
      cy.get('app-expense-form').children().contains('Cost is required.');
      cy.get('app-expense-form').children().contains('Category is required.');
    });
  });

  describe('compare mode', () => {
    it('should successfully enter compare mode', () => {
      cy.get('span.slider').click();

      cy.contains(mockdata.initialData.expenses[0].name).parents('app-expense-item')
        .should('have.class', 'compare-selected');
      cy.contains(mockdata.initialData.expenses[1].name).parents('app-expense-item')
        .should('have.class', 'compare-not-selected');
      cy.get('div.main-card').children().contains('Sum:').parent()
        .contains(mockdata.initialData.expenses[0].cost);
    });

    it('should successfully select other expense', () => {
      cy.get('span.slider').click();
      cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[1].name).click();

      cy.contains(mockdata.initialData.expenses[1].name).parents('app-expense-item')
        .should('have.class', 'compare-selected');
      cy.contains(mockdata.initialData.expenses[0].name).parents('app-expense-item')
        .should('have.class', 'compare-not-selected');
      cy.get('div.main-card').children().contains('Sum:').parent()
        .contains(mockdata.initialData.expenses[1].cost);
    });

    it('should successfully deselect other expense', () => {
      cy.get('span.slider').click();
      cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[1].name).click();
      cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[1].name).click();

      cy.contains(mockdata.initialData.expenses[0].name).parents('app-expense-item')
        .should('have.class', 'compare-selected');
      cy.contains(mockdata.initialData.expenses[1].name).parents('app-expense-item')
        .should('have.class', 'compare-not-selected');
      cy.get('div.main-card').children().contains('Sum:').parent()
        .contains(mockdata.initialData.expenses[0].cost);
    });
  });

  describe('ivite user', () => {
    it('should successfully invite user', () => {
      cy.get('div.main-card').contains('add users').click();

      cy.get('input[formcontrolname="invite"]').type(mockdata.invitedUser.user.email);
      cy.get('button[type="submit"]').click();

      cy.contains('close').click();
      cy.get('div.main-card').contains('add users').click();

      cy.get('app-add-users-form').children().contains(mockdata.invitedUser.user.email);
    });
  });

  describe('accept invitation', () => {
    beforeEach(function () {
      cy.get('div.main-card').contains('add users').click();
      cy.get('input[formcontrolname="invite"]').type(mockdata.invitedUser.user.email);
      cy.get('button[type="submit"]').click();

      cy.login(Cypress.env('email2'), Cypress.env('password2'));
      cy.visit('/projects');
    });

    it('should successfully accept an invitation', () => {
      cy.get('app-invite-item').children().contains(mockdata.initialData.project.name).click();
      cy.get('app-project-item').children().contains(mockdata.initialData.project.name);
    });
  });
});
