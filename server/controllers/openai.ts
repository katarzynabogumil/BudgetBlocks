import express from 'express';
import { getProjectPublicFromDB } from '../models/projects';
import * as dotenv from "dotenv";

dotenv.config();

const RATING_PROMPT = process.env.RATING_PROMPT || '';
const CATEGORY_PROMPT = process.env.CATEGORY_PROMPT || '';
const URL = 'https://api.openai.com/v1/chat/completions';
const HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
};
const CONF = {
  model: 'gpt-3.5-turbo',
  temperature: 0,
  top_p: 1,
  n: 1,
  stream: false,
};

export const getProjectRating = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const projectId = Number(req.params.projectId);
    const projectData = await getProjectPublicFromDB(projectId);
    if (!projectData) throw new Error('Project not found.');

    const prompt = RATING_PROMPT + JSON.stringify(projectData);

    const response = await fetch(URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        messages: [
          {
            role: 'assistant',
            content: prompt
          }
        ],
        ...CONF
      }),
    });

    const responseData = await response.json();
    if (!responseData.error) {
      const rating = Number(responseData.choices[0].message.content);
      // const rating = 3;
      res.status(201);
      res.send({ rating });
    } else res.sendStatus(400);

  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};

export const getMissingCategories = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const projectId = Number(req.params.projectId);
    const projectData = await getProjectPublicFromDB(projectId);
    if (!projectData) throw new Error('Project not found.');

    const prompt = CATEGORY_PROMPT + JSON.stringify(projectData);

    const response = await fetch(URL, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({
        messages: [
          {
            role: 'assistant',
            content: prompt
          }
        ],
        ...CONF
      }),
    });

    const responseData = await response.json();
    if (!responseData.error) {
      const categories = responseData.choices[0].message.content;
      // const categories = 'Food, Souvenirs';

      res.status(201);
      res.send({ categories });
    } else res.sendStatus(400);

  } catch (e) {
    console.log('Error: ', e);
    res.sendStatus(500);
  }
};