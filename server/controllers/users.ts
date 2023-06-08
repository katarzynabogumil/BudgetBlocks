import express from 'express';

import { saveUserToDb, getUserFromDB } from '../models/users';
import { User } from '../interfaces/user';

async function saveUser (req: express.Request<{}, {}, User>, res: express.Response) {
  try {
    console.log('saving')
    const userData = req.body;
    console.log(userData)
    const newUser = await saveUserToDb(userData);
    res.status(200);
    res.send(newUser);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function getUser (req: express.Request, res: express.Response) {
  try {
    const userSub = req.auth?.payload.sub || '';
    if (userSub) {
      const user = await getUserFromDB(userSub);
      res.status(200);
      res.send(user);
    } else {
      console.log('Error: Fail authentication.');
      res.sendStatus(401);
    }
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

export {
  saveUser,
  getUser,
};
