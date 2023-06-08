import express from 'express';

import {
  validateAccessToken,
} from "./middleware/auth0.middleware";

import { 
  saveUser,
  getUser,
} from './controllers/users';

import {
  getAllProjects,
  saveProject,
  editProject,
  deleteProject
} from './controllers/projects';

import { 
  saveExpense,
  editExpense,
  deleteExpense,
} from './controllers/expenses';

const router: express.Router = express.Router();

router.get('/projects', validateAccessToken, getAllProjects);
router.post('/project/:id', validateAccessToken, saveProject);
router.put('/project/:id', validateAccessToken, editProject);
router.delete('/project/:id', validateAccessToken, deleteProject);

router.post('/project/:id/add', validateAccessToken, saveExpense);
router.put('/expence/:id', validateAccessToken, editExpense);
router.delete('/expence/:id', validateAccessToken, deleteExpense);

// router.post('/comment/:id', validateAccessToken, func);
// router.put('/comment/:id', validateAccessToken, func);

router.get('/user', validateAccessToken, getUser);
router.post('/user', validateAccessToken, saveUser);

export default router;
