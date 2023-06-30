import prisma from '../models/prisma';
import { mockdata } from './mocks';
import {
  saveProjectToDb,
  getProjectsFromDB,
  getProjectFromDB,
  updateProjectinDb,
  deleteProjectsFromDB,
  addUserToProject,
  getProjectInvitationsFromDB,
  acceptInvitationDb
} from '../models/projects';
import { Prisma } from '@prisma/client';
import { User, Project } from '@prisma/client';

describe('Database integration tests - project:', () => {
  let user: User;
  let project: Project;

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();

    user = await prisma.user.create({ data: mockdata.user });
    project = await prisma.project.create({
      data: {
        ...mockdata.project,
        owners: {
          connect: { id: user.id }
        },
        invitedUsers: {
          connect: { id: user.id }
        }
      },
    });
  })

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
    await prisma.$disconnect();
  });


  describe('saveProjectToDb:', () => {
    test('should create new project with valid data', async () => {
      const data = mockdata.project;
      const createdProject = await saveProjectToDb(user.sub, data);
      expect(createdProject).toHaveProperty('id');
      expect(createdProject).toHaveProperty('name', data.name);
    });

    test('should not create new project with missing input', async () => {
      const { name: _, ...invalidData } = mockdata.project;
      const wrapper = async () => {
        try {
          await saveProjectToDb(user.sub, invalidData as Prisma.ProjectCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not create new project with duplicate id', async () => {
      const data = { id: project.id, ...mockdata.project };
      const wrapper = async () => {
        try {
          await saveProjectToDb(user.sub, data);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('getProjectsFromDB:', () => {

    test('should get projects from db with valid data', async () => {
      await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });
      const projects = await getProjectsFromDB(user.sub);
      expect(projects[0]).toHaveProperty('id');
      expect(projects[0]).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get projects from db with invalid data', async () => {
      await prisma.project.create({
        data: {
          ...mockdata.project,
          owners: {
            connect: { id: user.id }
          }
        },
      });
      await expect(getProjectsFromDB('')).resolves.toEqual([]);
    });

    test('should not get projects from db if not saved yet', async () => {
      await prisma.project.deleteMany();
      await expect(getProjectsFromDB(user.sub)).resolves.toEqual([]);
    });
  });


  describe('getProjectInvitationsFromDB:', () => {

    test('should get project invitations from db with valid data', async () => {

      const projects = await getProjectInvitationsFromDB(user.sub);
      expect(projects[0]).toHaveProperty('id');
      expect(projects[0]).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get project invitations from db with invalid data', async () => {
      await expect(getProjectInvitationsFromDB('')).resolves.toEqual([]);
    });

    test('should not get project invitations from db if not saved yet', async () => {
      await prisma.project.deleteMany();
      await expect(getProjectInvitationsFromDB(user.sub)).resolves.toEqual([]);
    });
  });


  describe('getProjectFromDB:', () => {

    test('should get project from db with valid data', async () => {
      const foundProject = await getProjectFromDB(project.id);
      expect(foundProject).toHaveProperty('id');
      expect(foundProject).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get project from db with invalid data', async () => {
      const foundProject = await getProjectFromDB(-1);
      expect(foundProject).toEqual(null);
    });

    test('should not get project from db if not saved yet', async () => {
      await prisma.project.deleteMany();
      const foundProject = await getProjectFromDB(project.id);
      expect(foundProject).toEqual(null);
    });
  });


  describe('getProjectPublicFromDB:', () => {

    test('should get project from db with valid data', async () => {
      const foundProject = await getProjectFromDB(project.id);
      expect(foundProject).toHaveProperty('id');
      expect(foundProject).toHaveProperty('name', mockdata.project.name);
    });

    test('should not get project from db with invalid data', async () => {
      const foundProject = await getProjectFromDB(-1);
      expect(foundProject).toEqual(null);
    });

    test('should not get project from db if not saved yet', async () => {
      await prisma.project.deleteMany();
      const foundProject = await getProjectFromDB(project.id);
      expect(foundProject).toEqual(null);
    });
  });


  describe('updateProjectinDb:', () => {

    test('should update project from db with valid data', async () => {
      const projectData = mockdata.project;
      projectData.name = 'New name';
      const updatedProject = await updateProjectinDb(project.id, projectData);
      expect(updatedProject).toHaveProperty('id');
      expect(updatedProject).toHaveProperty('name', projectData.name);
    });

    test('should not update project from db with invalid data', async () => {
      project.name = '';
      const wrapper = async () => {
        try {
          await updateProjectinDb(project.id, project as Prisma.ProjectCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not update project from db if not saved yet', async () => {
      const wrapper = async () => {
        try {
          await updateProjectinDb(-1, project as Prisma.ProjectCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('updateProjectinDb:', () => {

    test('should update project from db with valid data', async () => {
      const projectData = mockdata.project;
      projectData.name = 'New name';
      const updatedProject = await updateProjectinDb(project.id, projectData);
      expect(updatedProject).toHaveProperty('id');
      expect(updatedProject).toHaveProperty('name', projectData.name);
    });

    test('should not update project from db with invalid data', async () => {
      project.name = '';
      const wrapper = async () => {
        try {
          await updateProjectinDb(project.id, project as Prisma.ProjectCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not update project from db if not saved yet', async () => {
      const wrapper = async () => {
        try {
          await updateProjectinDb(-1, project as Prisma.ProjectCreateInput);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('addUserToProject:', () => {

    test('should add user to project with valid data', async () => {
      const invitedUser = await prisma.user.create({ data: mockdata.invitedUser });
      const updatedProject = await addUserToProject(project.id, invitedUser.email);
      expect(updatedProject.invitedUsers[1]).toHaveProperty('id', invitedUser.id);
      expect(updatedProject.invitedUsers[1]).toHaveProperty('email', invitedUser.email);
    });

    test('should not add user to project if user not saved yet', async () => {
      const wrapper = async () => {
        try {
          await addUserToProject(project.id, mockdata.invitedUser.email);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('acceptInvitationDb:', () => {

    test('should accept invitation with valid data', async () => {
      const invitedUser = await prisma.user.create({ data: mockdata.invitedUser });
      await addUserToProject(project.id, invitedUser.email);
      const updatedProject = await acceptInvitationDb(project.id, invitedUser.sub);
      expect(updatedProject.owners[1]).toHaveProperty('id', invitedUser.id);
      expect(updatedProject.owners[1]).toHaveProperty('email', invitedUser.email);
    });

    test('should not accept invitation if user not invited yet', async () => {
      const invitedUser = await prisma.user.create({ data: mockdata.invitedUser });
      const wrapper = async () => {
        try {
          await acceptInvitationDb(project.id, invitedUser.sub);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });

    test('should not accept invitation if user not saved yet', async () => {
      const wrapper = async () => {
        try {
          await acceptInvitationDb(project.id, mockdata.invitedUser.sub);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });


  describe('deleteProjectsFromDB:', () => {

    test('should delete project with valid data', async () => {
      const deletedProject = await deleteProjectsFromDB(project.id);
      expect(deletedProject).toHaveProperty('id', project.id);
    });

    test('should not delete project if project not saved yet', async () => {
      await prisma.project.deleteMany();
      const wrapper = async () => {
        try {
          await acceptInvitationDb(project.id, mockdata.invitedUser.sub);
        } catch (e) {
          return e as Error;
        }
      }
      const error = await wrapper();
      expect(error).toBeInstanceOf(Error);
    });
  });
});