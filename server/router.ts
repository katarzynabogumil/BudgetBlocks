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
  deleteProject,
  addUser
} from './controllers/projects';

import {
  getExpense,
  saveExpense,
  editExpense,
  deleteExpense,
  vote
} from './controllers/expenses';

import {
  saveComment,
  deleteComment
} from './controllers/comments';

import {
  getCurrencyRates
} from './controllers/currencies';

const router: express.Router = express.Router();

router.get('/projects', validateAccessToken, getAllProjects);
router.post('/project', validateAccessToken, saveProject);
router.get('/project/:id', validateAccessToken, getProject);
router.put('/project/:id', validateAccessToken, editProject);
router.delete('/project/:id', validateAccessToken, deleteProject);

router.post('/project/:projectId/expense', validateAccessToken, saveExpense);
router.get('/project/:projectId/expense/:id', validateAccessToken, getExpense);
router.put('/project/:projectId/expense/:id', validateAccessToken, editExpense);
router.delete('/project/:projectId/expense/:id', validateAccessToken, deleteExpense);
router.post('/project/:projectId/adduser', validateAccessToken, addUser);

router.put('/project/:projectId/expense/:id/:direction', validateAccessToken, vote);

router.post('/comment/:id', validateAccessToken, saveComment);
router.delete('/comment/:id', validateAccessToken, deleteComment);

router.get('/user', validateAccessToken, getUser);
router.post('/user', validateAccessToken, saveUser);

router.get('/currencies/:base', validateAccessToken, getCurrencyRates);

export default router;
