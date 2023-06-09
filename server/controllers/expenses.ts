import express from 'express';
import { Prisma } from '@prisma/client'

import { 
  getExpenseFromDB,
  saveExpenseToDb,
  updateExpenseinDb,
  deleteExpenseFromDB,
} from '../models/expenses';

async function saveExpense (req: express.Request<{id: string}, {}, Prisma.ExpenseCreateInput>, res: express.Response) {
  try {
    console.log(req.params);
    const projectId = Number(req.params.id);
    const data = req.body;

    const newExpense = await saveExpenseToDb(projectId, data);

    res.status(201);
    res.send(newExpense);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function getExpense (req: express.Request, res: express.Response) {
  try {
    const id = Number(req.params.id);
    const expense = await getExpenseFromDB(id);
    res.status(200);
    res.send(expense);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
}; 

async function editExpense 
  (
    req: express.Request<{id: string}, {}, Prisma.ExpenseUpdateInput>, 
    res: express.Response
  ) {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    const expense = await updateExpenseinDb(id, data);
    res.status(200);
    res.send(expense);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

async function deleteExpense (req: express.Request, res: express.Response) {
  try {
    const id = Number(req.params.id);
    const expense = await deleteExpenseFromDB(id);
    res.status(204);
    res.send(expense);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

export {
  saveExpense,
  getExpense,
  editExpense,
  deleteExpense,
};
