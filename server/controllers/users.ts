import express from 'express';
import { Prisma } from '@prisma/client'
import { saveUserToDb, getUserFromDB } from '../models/users';

import debug from 'debug';
const error = debug('app:error');

async function saveUser
  (
    req: express.Request<object, object, Prisma.UserCreateInput>,
    res: express.Response
  ): Promise<void> {
  try {
    const userData = req.body;
    const newUser = await saveUserToDb(userData);
    res.status(201);
    res.send(newUser);
  } catch (e) {
    error('Error: ', e);
    res.sendStatus(500);
  }
}

async function getUser(req: express.Request, res: express.Response): Promise<void> {
  try {
    const userSub = req.auth?.payload.sub || '';
    if (userSub) {
      const user = await getUserFromDB(userSub);
      res.status(200);
      res.send(user);
    } else {
      error('Error: Failed authentication.');
      res.sendStatus(401);
    }
  } catch (e) {
    error('Error: ', e);
    res.sendStatus(500);
  }
}

export {
  saveUser,
  getUser,
};
