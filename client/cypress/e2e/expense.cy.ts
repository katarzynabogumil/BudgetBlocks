import { mockdata } from '../fixtures/mockdata';

describe('expense-details', () => {
  beforeEach(function () {
    cy.task('db:seed', mockdata.initialData).
      then(() => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.visit('/projects');
        cy.get('app-project-item').children().contains(mockdata.initialData.project.name).click();
        cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[0].name)
          .parents('app-expense-item').children().contains('expand_circle_down').click();
      });
  });

  afterEach(function () {
    cy.task('db:teardown', mockdata.initialData.user.sub);
  });

  it('should successfully display expense details', () => {
    cy.get('app-expense-details').children().contains('Notes:');
    cy.get('app-expense-details').children().contains('Comments:');

    cy.get('app-expense-details').children().contains(mockdata.initialData.expenses[0].notes)
      .should('be.visible');
    cy.get('app-expense-details').children().contains(mockdata.initialData.expenses[1].notes)
      .should('not.be.visible');
    cy.get('app-expense-details').children().contains(mockdata.initialData.comment.text);
  });

  describe('edit expense', () => {
    it('should successfully edit an expense', () => {
      cy.get('app-expense-details:visible').children().contains('edit').click();

      const newName = 'New name';
      cy.get('input[formcontrolname="name"]').clear();
      cy.get('input[formcontrolname="name"]').type(newName);
      cy.get('button[type="submit"]').click();

      cy.get('app-expense-item').children().contains(newName);
    });

    it('should validate fields', () => {
      cy.get('app-expense-details:visible').children().contains('edit').click();

      cy.get('input[formcontrolname="name"]').clear();
      cy.get('input[formcontrolname="cost"]').clear();
      cy.get('select[formcontrolname="formCategory"]').select('add new');

      cy.get('button[type="submit"]').click();

      cy.get('app-expense-form').children().contains('Name is required.');
      cy.get('app-expense-form').children().contains('Cost is required.');
      cy.get('app-expense-form').children().contains('Category is required.');
    });
  });

  describe('delete expense', () => {
    it('should successfully delete expense', () => {
      cy.get('app-expense-details:visible').children().contains('a', 'remove').click();
      cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[0].name).should('not.exist');
    });
  });

  describe('add comment', () => {
    it('comment form should be visible', () => {
      cy.get('input:visible[formcontrolname="comment"]').should('be.visible');
      cy.get('button:visible[type="submit"]').should('be.visible');
    });

    it('should successfully add a comment to an expense', () => {
      const newComment = 'New Comment';
      cy.get('input:visible[formcontrolname="comment"]').type(newComment);
      cy.get('button:visible[type="submit"]').click();
      cy.get('app-expense-details:visible').children().contains(newComment);
    });

    it('should not add an empty comment', () => {
      cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[0].name).parents('app-expense-item')
        .contains('expand_circle_up').click();
      cy.get('app-expense-item').children().contains(mockdata.initialData.expenses[1].name).parents('app-expense-item')
        .contains('expand_circle_down').click();
      cy.get('button:visible[type="submit"]').click();
      cy.get('app-expense-details:visible').children().contains(`This expense doesn't have any comments yet.`);
    });
  });

  describe('delete comment', () => {
    it('should successfully delete comment', () => {
      cy.get('app-expense-details:visible').children().contains('Comments:')
        .parents('app-expense-details').children().contains('remove').click();
      cy.get('app-expense-details:visible').children().contains(`This expense doesn't have any comments yet.`);
    });
  });

});
