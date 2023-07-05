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
    cy.get('div.main-card').children().contains('Hi, Example! Here are your projects.');
    cy.get('div.main-card').children().contains('all projects');
    cy.get('div.main-card').children().contains('log out');
  });

  it('should successfully display project information', () => {
    cy.get('app-project-item').children().contains(mockdata.initialData.project.name);
    cy.get('app-project-item').children().contains('edit');
    cy.get('app-project-item').children().contains('remove');
  });

  describe('add project', () => {

    it('should successfully add a project', () => {
      cy.contains('Add a project').click();
      const newProject = {
        name: 'New project',
        budget: '1000',
        type: 'trip',
      }
      cy.get('input[formcontrolname="name"]').type(newProject.name);
      cy.get('input[formcontrolname="budget"]').type(newProject.budget);
      cy.get('select[formcontrolname="type"]').select(newProject.type);
      cy.get('button[type="submit"]').click();

      cy.get('h2').contains(newProject.name);
    });

    it('should validate fields', () => {
      cy.contains('Add a project').click();

      cy.get('button[type="submit"]').click();

      cy.get('app-project-form').children().contains('Name is required.');
      cy.get('app-project-form').children().contains('Budget is required.');
      cy.get('app-project-form').children().contains('Type is required.');
    });
  });

  describe('edit project', () => {
    it('should successfully edit a project', () => {
      cy.get('app-project-item').children().contains('edit').click();

      const newName = 'New name';
      cy.get('input[formcontrolname="name"]').clear();
      cy.get('input[formcontrolname="name"]').type(newName);
      cy.get('button[type="submit"]').click();

      cy.get('h2').contains(newName);
    });

    it('should validate fields', () => {
      cy.get('app-project-item').children().contains('edit').click();

      cy.get('input[formcontrolname="name"]').clear();
      cy.get('input[formcontrolname="budget"]').clear();
      cy.get('button[type="submit"]').click();

      cy.get('app-project-form').children().contains('Name is required.');
      cy.get('app-project-form').children().contains('Budget is required.');
    });
  });

  describe('delete project', () => {
    it('should successfully delete project', () => {
      cy.get('app-project-item').children().contains('remove').click();
      cy.get('app-project-item').should('not.exist');
      cy.get('h2').contains(mockdata.initialData.project.name).should('not.exist');
    });
  });
});
