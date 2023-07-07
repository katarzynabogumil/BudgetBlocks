import { mockdata } from '../fixtures/mockdata';

describe('expense-details', () => {
  beforeEach(function () {
    cy.task('db:seed', mockdata.initialData).
      then(() => {
        cy.login(Cypress.env('email'), Cypress.env('password'));
        cy.visit('/projects');
        cy.dataTestId('project-name').contains(mockdata.initialData.project.name).click();
        cy.dataTestId('expense-name').contains(mockdata.initialData.expenses[0].name)
          .parents('[data-testid="expense-item"]').find('[data-testid="show-details"]').click();
      });
  });

  afterEach(function () {
    cy.task('db:teardown', mockdata.initialData.user.sub);
  });

  it('should successfully display expense details', () => {
    cy.dataTestId('expense-notes').should('be.visible');
    cy.dataTestId('expense-notes').contains(mockdata.initialData.expenses[0].notes)
      .should('be.visible');
    cy.dataTestId('expense-notes').contains(mockdata.initialData.expenses[1].notes)
      .should('not.be.visible');

    cy.dataTestId('expense-comment').should('be.visible');
    cy.dataTestId('expense-comment').contains(mockdata.initialData.comment.text)
      .should('be.visible');
  });

  describe('edit expense', () => {
    it('should successfully edit an expense', () => {
      cy.dataTestIdVisible('expense-edit').click();

      const newName = 'New name';
      cy.dataTestId('form-name').clear();
      cy.dataTestId('form-name').type(newName);
      cy.dataTestId('submit').click();

      cy.dataTestId('expense-name').contains(newName);
    });

    it('should validate fields', () => {
      cy.dataTestIdVisible('expense-edit').click();

      cy.dataTestId('form-name').clear();
      cy.dataTestId('form-cost').clear();
      cy.dataTestId('form-formCategory').select('add new');

      cy.dataTestId('submit').click();

      cy.dataTestId('name-validator').should('be.visible');
      cy.dataTestId('cost-validator').should('be.visible');
      cy.dataTestId('category-validator').should('be.visible');
    });
  });

  describe('delete expense', () => {
    it('should successfully delete expense', () => {
      cy.dataTestIdVisible('expense-remove').click();
      cy.dataTestId('expense-item').contains(mockdata.initialData.expenses[0].name)
        .should('not.exist');
    });
  });

  describe('add comment', () => {
    it('comment form should be visible', () => {
      cy.dataTestIdVisible('form-comment').should('be.visible');
      cy.dataTestIdVisible('submit-comment').should('be.visible');
    });

    it('should successfully add a comment to an expense', () => {
      const newComment = 'New Comment';
      cy.dataTestIdVisible('form-comment').type(newComment);
      cy.dataTestIdVisible('submit-comment').click();
      cy.dataTestIdVisible('expense-comment').contains(newComment);
    });

    it('should not add an empty comment', () => {
      cy.dataTestId('expense-name').contains(mockdata.initialData.expenses[0].name)
        .parents('[data-testid="expense-item"]').find('[data-testid="hide-details"]').click();
      cy.dataTestId('expense-name').contains(mockdata.initialData.expenses[1].name)
        .parents('[data-testid="expense-item"]').find('[data-testid="show-details"]').click();
      cy.dataTestIdVisible('submit-comment').click();
      cy.dataTestId('no-comments').should('be.visible');
    });
  });

  describe('delete comment', () => {
    it('should successfully delete comment', () => {
      cy.dataTestId('comment-remove').click();
      cy.dataTestId('no-comments').should('be.visible');
    });
  });

});
