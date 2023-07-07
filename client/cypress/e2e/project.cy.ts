import { mockdata } from '../fixtures/mockdata';

describe('project-dashboard', () => {
  beforeEach(function () {
    cy.task('db:seed', mockdata.invitedUser);
    cy.task('db:seed', mockdata.initialData).
      then(() => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.visit('/projects');
        cy.dataTestId('project-name').contains(mockdata.initialData.project.name).click();
      });
  });

  afterEach(function () {
    cy.task('db:teardown', mockdata.initialData.user.sub);
    cy.task('db:teardown', mockdata.invitedUser.user.sub);
  });

  it('should successfully display project information', () => {
    cy.dataTestId('project-name').should('be.visible');
    cy.dataTestId('project-name').contains(mockdata.initialData.project.name);
    cy.dataTestId('project-edit').should('exist');
    cy.dataTestId('project-remove').should('exist');
    cy.dataTestId('project-add-users').should('exist');

    cy.dataTestId('project-dashboard').children().contains(mockdata.initialData.project.budget
      .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    cy.dataTestId('project-dashboard').children().contains(mockdata.initialData.project.type);
    cy.dataTestId('project-dashboard').children().contains(mockdata.initialData.project.destination);
    cy.dataTestId('project-dashboard').children().contains(mockdata.initialData.project.description);

    cy.dataTestId('add-expense').should('exist');
  });

  it('should successfully display expenses information', () => {
    cy.dataTestId('expense-name').contains(mockdata.initialData.expenses[0].name);
    cy.dataTestId('expense-name').contains(mockdata.initialData.expenses[1].name);

    cy.dataTestId('expense-data').contains(mockdata.initialData.category.category);
    cy.dataTestId('expense-data').contains(mockdata.initialData.expenses[0].cost.toString());
    cy.dataTestId('expense-data').contains(mockdata.initialData.expenses[1].cost.toString());
  });

  describe.only('add expense', () => {
    it('should successfully add an expense to an existing category', () => {
      cy.dataTestId('add-expense').click();
      const newExpense = {
        name: 'New expense',
        cost: '100',
        category: 'Flights',
      }
      cy.dataTestId('form-name').type(newExpense.name);
      cy.dataTestId('form-cost').type(newExpense.cost);
      cy.dataTestId('form-formCategory').select(newExpense.category);

      cy.dataTestId('submit').click();

      cy.dataTestId('expense-name').contains(newExpense.name);
      cy.dataTestId('expense-data').contains(newExpense.cost);
      cy.dataTestId('expense-data').contains(newExpense.category);
    });

    it('should successfully add an expense to a new category', () => {
      cy.dataTestId('add-expense').click();
      const newExpense = {
        name: 'New expense',
        cost: '100',
        category: 'add new',
        newCategory: 'New category',
      }
      cy.dataTestId('form-name').type(newExpense.name);
      cy.dataTestId('form-cost').type(newExpense.cost);
      cy.dataTestId('form-formCategory').select(newExpense.category);
      cy.dataTestId('form-newCategory').type(newExpense.newCategory);

      cy.dataTestId('submit').click();

      cy.dataTestId('expense-name').contains(newExpense.name);
      cy.dataTestId('expense-data').contains(newExpense.cost);
      cy.dataTestId('expense-data').contains(newExpense.newCategory);
    });

    it('should validate fields', () => {
      cy.dataTestId('add-expense').click();

      cy.dataTestId('submit').click();

      cy.dataTestId('name-validator').should('be.visible');
      cy.dataTestId('cost-validator').should('be.visible');
      cy.dataTestId('category-validator').should('be.visible');
    });
  });

  describe('compare mode', () => {
    it('should successfully enter compare mode', () => {
      cy.dataTestId('compare-mode-switch').click();

      cy.contains(mockdata.initialData.expenses[0].name).parents('[data-testid="expense-item"]')
        .should('have.class', 'compare-selected');
      cy.contains(mockdata.initialData.expenses[1].name).parents('[data-testid="expense-item"]')
        .should('have.class', 'compare-not-selected');

      cy.dataTestId('project-dashboard').children().contains('Sum:').parent()
        .contains(mockdata.initialData.expenses[0].cost);
    });

    it('should successfully select other expense', () => {
      cy.dataTestId('compare-mode-switch').click();
      cy.contains(mockdata.initialData.expenses[1].name).click();

      cy.contains(mockdata.initialData.expenses[1].name).parents('[data-testid="expense-item"]')
        .should('have.class', 'compare-selected');
      cy.contains(mockdata.initialData.expenses[0].name).parents('[data-testid="expense-item"]')
        .should('have.class', 'compare-not-selected');

      cy.dataTestId('project-dashboard').children().contains('Sum:').parent()
        .contains(mockdata.initialData.expenses[1].cost);
    });

    it('should successfully deselect other expense', () => {
      cy.dataTestId('compare-mode-switch').click();
      cy.contains(mockdata.initialData.expenses[1].name).click();
      cy.contains(mockdata.initialData.expenses[1].name).click();

      cy.contains(mockdata.initialData.expenses[0].name).parents('[data-testid="expense-item"]')
        .should('have.class', 'compare-selected');
      cy.contains(mockdata.initialData.expenses[1].name).parents('[data-testid="expense-item"]')
        .should('have.class', 'compare-not-selected');

      cy.dataTestId('project-dashboard').children().contains('Sum:').parent()
        .contains(mockdata.initialData.expenses[0].cost);
    });
  });

  describe('ivite user', () => {
    it('should successfully invite user', () => {
      cy.dataTestId('project-add-users').click();
      cy.dataTestId('form-invite').type(mockdata.invitedUser.user.email);
      cy.dataTestId('submit').click();

      cy.dataTestId('close').click();
      cy.dataTestId('project-add-users').click();

      cy.dataTestId('add-users-form').children().contains(mockdata.invitedUser.user.email);
    });
  });

  describe('accept invitation', () => {
    beforeEach(function () {
      cy.dataTestId('project-add-users').click();
      cy.dataTestId('form-invite').type(mockdata.invitedUser.user.email);
      cy.dataTestId('submit').click();

      cy.login(Cypress.env('email2'), Cypress.env('password2'));
      cy.visit('/projects');
    });

    it('should successfully accept an invitation', () => {
      cy.dataTestId('invite-item').children().contains(mockdata.initialData.project.name).click();
      cy.dataTestId('project-item').children().contains(mockdata.initialData.project.name);
    });
  });
});
