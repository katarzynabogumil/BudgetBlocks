import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveProjectToDb(userSub: string, data: Prisma.ProjectCreateInput) {
  const user = await prisma.user.findUnique({
    where: {
      sub: userSub
    },
  });
  if (!user) throw new Error();

  data.createdAt = new Date();

  const newProject = await prisma.project.create({
    data: {
      ...data,
      owners: {
        connect: { id: user.id }
      }
    },
  });
  return newProject;
}

async function getProjectsFromDB(userSub: string) {
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
};

async function getProjectInvitationsFromDB(userSub: string) {
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
};

async function getProjectFromDB(id: number) {
  const project = await prisma.project.findUnique({
    where: {
      id
    },
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
  });
  return project;
};

async function getProjectPublicFromDB(id: number) {
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
};

async function updateProjectinDb(projectId: number, inputData: Prisma.ProjectUpdateInput) {
  let {
    categories: _1,
    expenses: _2,
    owners: _3,
    invitedUsers: _4,
    ...data
  } = inputData;
  if (data.currencyRates === null) data.currencyRates = undefined;

  if (data.currencyRates) {
    data.currencyRates = data.currencyRates as Prisma.JsonObject;
  }

  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      ...data,
      updatedAt: new Date()
    }
  });
  return project;
};

async function addUserToProject(projectId: number, email: string) {
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
  });
  return project;
};

async function acceptInvitationDb(projectId: number, userSub: string) {
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
  });
  return project;
};

async function deleteProjectsFromDB(projectId: number) {
  const project = await prisma.project.delete({
    where: {
      id: projectId
    },
  });
  return project;
};

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
