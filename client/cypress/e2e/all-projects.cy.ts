import { mockdata } from '../fixtures/mockdata';

describe('all-projects-dashboard', () => {
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

  it('should successfully display projects dashboard', () => {
    cy.dataTestId('greeting').should('be.visible');
    cy.dataTestId('home').should('be.visible');
    cy.dataTestId('log-out').should('be.visible');
    cy.dataTestId('add-project').should('be.visible');
  });

  it('should successfully display project information', () => {
    cy.dataTestId('project-name').should('be.visible');
    cy.dataTestId('project-edit').should('be.visible');
    cy.dataTestId('project-remove').should('be.visible');
  });

  describe('add project', () => {

    it('should successfully add a project', () => {
      cy.dataTestId('add-project').click();
      const newProject = {
        name: 'New project',
        budget: '1000',
        type: 'trip',
      }
      cy.dataTestId('form-name').type(newProject.name);
      cy.dataTestId('form-budget').type(newProject.budget);
      cy.dataTestId('form-type').select(newProject.type);
      cy.dataTestId('submit').click();

      cy.dataTestId('project-name').should('be.visible');
      cy.dataTestId('project-name').contains(newProject.name);
    });

    it('should validate fields', () => {
      cy.dataTestId('add-project').click();

      cy.dataTestId('submit').click();

      cy.dataTestId('name-validator').should('be.visible');
      cy.dataTestId('budget-validator').should('be.visible');
      cy.dataTestId('type-validator').should('be.visible');
    });
  });

  describe('edit project', () => {
    it('should successfully edit a project', () => {
      cy.dataTestId('project-edit').click();

      const newName = 'New name';
      cy.dataTestId('form-name').clear();
      cy.dataTestId('form-name').type(newName);
      cy.dataTestId('submit').click();

      cy.dataTestId('project-name').should('be.visible');
      cy.dataTestId('project-name').contains(newName);
    });

    it('should validate fields', () => {
      cy.dataTestId('project-edit').click();

      cy.dataTestId('form-name').clear();
      cy.dataTestId('form-budget').clear();
      cy.dataTestId('submit').click();

      cy.dataTestId('name-validator').should('be.visible');
      cy.dataTestId('budget-validator').should('be.visible');
    });
  });

  describe('delete project', () => {
    it('should successfully delete project', () => {
      cy.dataTestId('project-remove').click();
      cy.dataTestId('project-item').should('not.exist');
      cy.contains(mockdata.initialData.project.name).should('not.exist');
    });
  });
});
