import express from 'express';

import {
  validateAccessToken,
} from './middleware/auth0.middleware';

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
  addUser,
  acceptInvitation,
  getProjectInvitations
} from './controllers/projects';

import {
  getExpense,
  saveExpense,
  editExpense,
  deleteExpense,
  vote
} from './controllers/expenses';

import {
  getAllComments,
  saveComment,
  deleteComment
} from './controllers/comments';

import {
  changeOrderId
} from './controllers/categories';

import {
  getCurrencyRates
} from './controllers/currencies';

import {
  getProjectRating,
  getMissingCategories
} from './controllers/openai';

import {
  paramsValidationRules,
  currenciesParamsValidationRules,
  voteParamsValidationRules,
  userValidationRules,
  addUserValidationRules,
  projectValidationRules,
  expenseValidationRules,
  commentValidationRules,
  validate,
} from './middleware/sanitize.middleware';

const router: express.Router = express.Router();

router.get('/projects', validateAccessToken, getAllProjects);
router.get('/projects/invitations', validateAccessToken, getProjectInvitations);

router.post('/project', validateAccessToken, projectValidationRules(), validate, saveProject);
router.get('/project/:id', validateAccessToken, paramsValidationRules(), validate, getProject);
router.put('/project/:id', validateAccessToken, projectValidationRules(), validate, editProject);
router.delete('/project/:id', validateAccessToken, paramsValidationRules(), validate, deleteProject);

router.post('/project/:projectId/expense', validateAccessToken, expenseValidationRules(), validate, saveExpense);
router.get('/project/:projectId/expense/:id', validateAccessToken, paramsValidationRules(), validate, getExpense);
router.put('/project/:projectId/expense/:id', validateAccessToken, expenseValidationRules(), validate, editExpense);
router.delete('/project/:projectId/expense/:id', validateAccessToken, paramsValidationRules(), validate, deleteExpense);

router.post('/project/:projectId/adduser', validateAccessToken, addUserValidationRules(), validate, addUser);
router.put('/project/:projectId/accept', validateAccessToken, paramsValidationRules(), validate, acceptInvitation);

router.put('/project/:projectId/expense/:id/:direction', validateAccessToken, voteParamsValidationRules(), validate, vote);

router.get('/comments/:projectId', validateAccessToken, paramsValidationRules(), validate, getAllComments);
router.post('/comment/:expenseId', validateAccessToken, commentValidationRules(), validate, saveComment);
router.delete('/comment/:commentId', validateAccessToken, paramsValidationRules(), validate, deleteComment);

router.put('/categories/:categoryId/:orderId', validateAccessToken, paramsValidationRules(), validate, changeOrderId);

router.get('/user', validateAccessToken, paramsValidationRules(), validate, getUser);
router.post('/user', validateAccessToken, userValidationRules(), validate, saveUser);
//
router.get('/currencies/:base', validateAccessToken, currenciesParamsValidationRules(), validate, getCurrencyRates);

router.get('/rating/:projectId', validateAccessToken, paramsValidationRules(), validate, getProjectRating);
router.get('/missing-categories/:projectId', validateAccessToken, paramsValidationRules(), validate, getMissingCategories);

export default router;
