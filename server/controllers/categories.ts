import express from 'express';
import { Prisma } from '@prisma/client'

import {
  updateCatOrderIdinDb
} from '../models/categories';

import debug from 'debug';
const error = debug('app:error');

async function changeOrderId
  (
    req: express.Request<{ categoryId: string, orderId: string }, object, Prisma.ExpenseUpdateInput>,
    res: express.Response
  ): Promise<void> {
  try {
    const categoryId = Number(req.params.categoryId);
    const orderId = Number(req.params.orderId);
    const category = await updateCatOrderIdinDb(categoryId, orderId);
    res.status(200);
    res.send(category);
  } catch (e) {
    error('Error: ', e);
    res.sendStatus(500);
  }
}

export {
  changeOrderId
};
