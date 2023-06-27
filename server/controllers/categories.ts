import express from 'express';
import { Prisma } from '@prisma/client'

import {
  updateCategoryinDb
} from '../models/categories';

async function changeOrderId
  (
    req: express.Request<{ categoryId: string, orderId: string }, {}, Prisma.ExpenseUpdateInput>,
    res: express.Response
  ) {
  try {
    const categoryId = Number(req.params.categoryId);
    const orderId = Number(req.params.orderId);
    const category = await updateCategoryinDb(categoryId, orderId);
    res.status(200);
    res.send(category);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};




export {
  changeOrderId
};
