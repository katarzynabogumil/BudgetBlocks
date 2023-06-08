import express from 'express';

import {
  validateAccessToken,
} from "./middleware/auth0.middleware";

import {
  getAllProjects,
  getProject,
} from './controllers/projects';

import { 
  saveUser,
  getUser,
} from './controllers/users';

const router: express.Router = express.Router();

router.get('/projects', validateAccessToken, getAllProjects);

router.get('/project/:id', validateAccessToken, getProject);
// router.post('/project/:id', validateAccessToken, func);
// router.put('/project/:id', validateAccessToken, func);
// router.delete('/project/:id', validateAccessToken, func);

// router.get('/expence/:id', validateAccessToken, func);
// router.get('/expence/:id/comments', validateAccessToken, func);
// router.post('/expence/:id', validateAccessToken, func);
// router.put('/expence/:id', validateAccessToken, func);
// router.delete('/expence/:id', validateAccessToken, func);

// router.post('/comment/:id', validateAccessToken, func);
// router.put('/comment/:id', validateAccessToken, func);

router.get('/user', getUser);
router.post('/user', saveUser);

export default router;
