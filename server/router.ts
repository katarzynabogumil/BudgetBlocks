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
  getProject,
  saveProject,
  editProject,
  deleteProject
} from './controllers/projects';

import { 
  getExpense,
  saveExpense,
  editExpense,
  deleteExpense,
} from './controllers/expenses';

import { 
  saveComment,
  deleteComment
} from './controllers/comments';

const router: express.Router = express.Router();

router.get('/projects', validateAccessToken, getAllProjects);
router.post('/project', validateAccessToken, saveProject);
router.get('/project/:id', validateAccessToken, getProject);
router.put('/project/:id', validateAccessToken, editProject);
router.delete('/project/:id', validateAccessToken, deleteProject);

router.post('/project/:id/expense', validateAccessToken, saveExpense);
router.get('/expense/:id', validateAccessToken, getExpense);
router.put('/expense/:id', validateAccessToken, editExpense);
router.delete('/expense/:id', validateAccessToken, deleteExpense);

router.post('/comment/:id', validateAccessToken, saveComment);
router.delete('/comment/:id', validateAccessToken, deleteComment);

router.get('/user', validateAccessToken, getUser);
router.post('/user', validateAccessToken, saveUser);

export default router;
