import express from 'express';
import { Prisma } from '@prisma/client'


async function getCurrencyRates(req: express.Request, res: express.Response) {
  try {
    const userData = req.body;

    res.status(201);
    res.send();
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};


export {
  getCurrencyRates
};
