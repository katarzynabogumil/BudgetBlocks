import prisma from './prisma';
import { Prisma } from '@prisma/client'
import { ProjectInclOwners, ProjectInclExpenses, ProjectPublic } from '../interfaces/project.model';

const PROJECT_CONNECTIONS = {
  include: {
    owners: true,
    invitedUsers: true,
    expenses: {
      include: {
        category: {
          include: {
            expenses: true,
          }
        }
      }
    },
    categories: {
      include: {
        expenses: {
          include: {
            comments: true,
            category: true,
          }
        },
      }
    },
  },
}

async function saveProjectToDb
  (
    userSub: string,
    data: Prisma.ProjectCreateInput
  ): Promise<ProjectInclExpenses> {
  if (!data.name || !data.type || !data.budget || !data.currency) {
    throw new Error('Required fields are missing.')
  }

  const user = await prisma.user.findUnique({
    where: {
      sub: userSub
    },
  });
  if (!user) throw new Error('No user found.');

  data.createdAt = new Date();

  const newProject = await prisma.project.create({
    data: {
      ...data,
      owners: {
        connect: { id: user.id }
      }
    },
    ...PROJECT_CONNECTIONS,
  });
  return newProject;
}

async function getProjectsFromDB(userSub: string): Promise<ProjectInclOwners[]> {
  const projects = await prisma.project.findMany({
    where: {
      owners: {
        some: { sub: userSub }
      }
    },
    include: {
      owners: true,
      invitedUsers: true,
    },
  });
  return projects;
}

async function getProjectInvitationsFromDB(userSub: string): Promise<ProjectInclOwners[]> {
  const projects = await prisma.project.findMany({
    where: {
      invitedUsers: {
        some: { sub: userSub }
      }
    },
    include: {
      owners: true,
      invitedUsers: true,
    },
  });
  return projects;
}

async function getProjectFromDB(id: number): Promise<ProjectInclExpenses | null> {
  const project = await prisma.project.findUnique({
    where: {
      id
    },
    ...PROJECT_CONNECTIONS,
  });
  return project;
}

async function getProjectPublicFromDB(id: number): Promise<ProjectPublic | null> {
  const project = await prisma.project.findUnique({
    where: {
      id
    },
    select: {
      name: true,
      type: true,
      budget: true,
      currency: true,
      dateFrom: true,
      dateTo: true,
      area: true,
      location: true,
      noOfGuests: true,
      occasion: true,
      destination: true,
      description: true,
      categories: {
        select: {
          category: true,
        }
      },
    },
  });
  return project;
}

async function updateProjectinDb
  (
    projectId: number,
    inputData: Prisma.ProjectUpdateInput
  ): Promise<ProjectInclExpenses> {
  if (!inputData.name || !inputData.type || !inputData.budget || !inputData.currency) {
    throw new Error('Required fields are missing.')
  }

  const {
    categories: _1,
    expenses: _2,
    owners: _3,
    invitedUsers: _4,
    ...data
  } = inputData;

  data.currencyRates = data.currencyRates as Prisma.JsonObject;
  if (!data.currencyRates) data.currencyRates = undefined;

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...data,
      updatedAt: new Date()
    },
    ...PROJECT_CONNECTIONS,
  });
  return project;
}

async function addUserToProject
  (
    projectId: number,
    email: string
  ): Promise<ProjectInclExpenses> {
  const user = await prisma.user.findUnique({
    where: {
      email
    },
  });
  if (!user) throw new Error('User not registered.');

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      updatedAt: new Date(),
      invitedUsers: {
        connect: { id: user.id }
      },
    },
    ...PROJECT_CONNECTIONS,
  });
  return project;
}

async function acceptInvitationDb
  (
    projectId: number,
    userSub: string
  ): Promise<ProjectInclExpenses> {
  const user = await prisma.user.findUnique({
    where: {
      sub: userSub
    },
  });
  if (!user) throw new Error('User not registered.');

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      updatedAt: new Date(),
      owners: {
        connect: { id: user.id }
      },
      invitedUsers: {
        disconnect: { id: user.id }
      },
    },
    ...PROJECT_CONNECTIONS,
  });
  return project;
}

async function deleteProjectsFromDB(projectId: number): Promise<ProjectInclExpenses> {
  const project = await prisma.project.delete({
    where: {
      id: projectId
    },
    ...PROJECT_CONNECTIONS,
  });
  return project;
}

export {
  saveProjectToDb,
  updateProjectinDb,
  getProjectsFromDB,
  getProjectFromDB,
  deleteProjectsFromDB,
  addUserToProject,
  getProjectInvitationsFromDB,
  acceptInvitationDb,
  getProjectPublicFromDB
};
