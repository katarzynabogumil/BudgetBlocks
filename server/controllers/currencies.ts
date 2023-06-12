import express from 'express';
import * as dotenv from "dotenv";
dotenv.config();

const URL = 'http://api.exchangeratesapi.io/latest?base=';
const API_KEY = '&access_key=' + process.env.CURRENCIES_API_KEY;

async function getCurrencyRates(req: express.Request, res: express.Response) {
  try {
    const base = req.params.base;

    const currencies = await fetch(URL + base + API_KEY)
      .then(res => res.status <= 400 ? res : Promise.reject(res))
      .then(res => res.json());

    res.status(200);
    res.send(currencies);
  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

export {
  getCurrencyRates
};
