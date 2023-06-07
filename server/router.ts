import express from 'express';

import {
  checkRequiredPermissions,
  validateAccessToken,
} from "./middleware/auth0.middleware";

// import { getBands } from './controllers/artists';

const router: express.Router = express.Router();

// router.get('/projects', (req, res) => {
//   res.status(200).send('All projects.');
// });

router.get('/projects', validateAccessToken, (req, res) => {
  res.status(200).send('All projects.');
});

router.get('/', (req, res) => {
  res.status(200).send('Home.');
});

export default router;
