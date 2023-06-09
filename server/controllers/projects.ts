import express from 'express';
import { Prisma } from '@prisma/client'

import { 
  saveProjectToDb, 
  getProjectsFromDB, 
  getProjectFromDB,
  updateProjectinDb, 
  deleteProjectsFromDB
} from '../models/projects';

async function saveProject (req: express.Request<{}, {}, Prisma.ProjectCreateInput>, res: express.Response) {
  try {
    const projectData = req.body;
    const userSub = req.auth?.payload.sub || '';

    const newProject = await saveProjectToDb(userSub, projectData);

    res.status(201);
    res.send(newProject);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function getAllProjects (req: express.Request, res: express.Response) {
  try {
    const userSub = req.auth?.payload.sub || '';
    if (userSub) {
      const projects = await getProjectsFromDB(userSub);
      res.status(200);
      res.send(projects);
    } else {
      console.log('Error: Failed authentication.');
      res.sendStatus(401);
    }
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function getProject (req: express.Request, res: express.Response) {
  try {
    const id = Number(req.params.id);
    const project = await getProjectFromDB(id);
    res.status(200);
    res.send(project);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function editProject 
  (
    req: express.Request<{id: string}, {}, Prisma.ProjectUpdateInput>, 
    res: express.Response
  ) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const project = await updateProjectinDb(id, data);
    res.status(200);
    res.send(project);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

async function deleteProject (req: express.Request, res: express.Response) {
  try {
    const id = Number(req.params.id);
    const project = await deleteProjectsFromDB(id);
    res.status(204);
    res.send(project);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

export {
  getAllProjects,
  getProject,
  saveProject,
  editProject,
  deleteProject
};
