import prisma from "./prisma";
import { Prisma } from '@prisma/client'

async function saveProjectToDb (userSub: string, data: Prisma.ProjectCreateInput) {
  const user = await prisma.user.findUnique({
    where: {
      sub: userSub
    },
  });

  const addOwner = user ? {
    owners: {
      connect: { id: user.id } 
    }
  } : {}

  data.createdAt = new Date().toISOString();
  const newProject = await prisma.project.create({ 
    data: {
      ...data,
      ...addOwner
    },
  });
  return newProject;
}; 

async function getProjectsFromDB (userSub: string) {
  const projects = await prisma.project.findMany({
    where: {
      owners: {
        some: { sub: userSub }
      }
    },
    include: {
      owners: true,
      invitedUsers: true,
      expenses: {
        include: {
          upvotes: true,
          downvotes: true,
          comments: true,
        }
      }
    },
  });
  return projects;
}; 

async function updateProjectinDb (projectId: number, data: Prisma.ProjectUpdateInput) {
  // TODO - seperate functions for adding-removing users?
  const project = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: { 
      ...data,
      updatedAt: new Date().toISOString()
    }
  });
  return project;
}; 

async function deleteProjectsFromDB (projectId: number) {
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
  deleteProjectsFromDB,
};
